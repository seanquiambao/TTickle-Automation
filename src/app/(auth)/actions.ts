"use server";

import { FieldValue } from "firebase-admin/firestore";
import { cookies } from "next/headers";
import { adminAuth, adminDb } from "@/utils/admin";
import { sendFirebaseEmail } from "@/utils/email";
import { env } from "@/utils/env";
import { auth } from "@/utils/firebase";

const SESSION_COOKIE = "ttickle_session";
const SESSION_DAYS = 7;

export async function createSessionFromIdToken(idToken: string) {
  try {
    const decoded = await adminAuth.verifyIdToken(idToken, true);
    const uid = decoded.uid;
    if (!uid) {
      return { success: false, message: "Token missing UID." };
    }

    const ref = adminDb.doc(`users/${decoded.uid}`);
    const snapshot = await ref.get();

    if (!snapshot.exists) {
      await ref.set({
        uid: decoded.uid,
        email: decoded.email ?? "",
        name: decoded.name ?? "",
        image: decoded.picture ?? "",
        siteRole: "user",
        orgId: decoded.orgId ?? "",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      await ref.set(
        {
          email: decoded.email ?? snapshot.get("email") ?? "",
          name: decoded.name ?? snapshot.get("name") ?? "",
          image: decoded.picture ?? snapshot.get("image") ?? "",
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }

    const userRecord = await adminAuth.getUser(uid);
    const existing = userRecord.customClaims ?? {};
    const needsSeed =
      existing.siteRole === undefined ||
      existing.orgId === undefined ||
      existing.orgRole === undefined;

    if (needsSeed) {
      await adminAuth.setCustomUserClaims(uid, {
        ...existing,
        siteRole: existing.siteRole ?? "user",
        orgId: existing.orgId ?? null,
        orgRole: existing.orgRole ?? null,
      });
      // Note: client ID token must be refreshed to read these claims on the client.
      // (Session cookie verification on the server already sees future updates.)
    }

    const expiresIn = SESSION_DAYS * 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    cookies().set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    });

    return { success: true, uid: decoded.uid };
  } catch (error) {
    return { success: false, message: "Token verification failed.", error };
  }
}

export const getSessionCookie = () => {
  const sessionCookie = cookies().get(SESSION_COOKIE)?.value;
  return sessionCookie || "";
};

export const serverSignOut = async () => {
  cookies().set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return { success: true };
};

export const passwordResetAction = async (email: string) => {
  try {
    const link = await adminAuth.generatePasswordResetLink(email, {
      url: `${env.DOMAIN_URL}/reset/confirm`, // must be allow-listed in Firebase Auth
      // dynamicLinkDomain: "yourapp.page.link", // if using Firebase Dynamic Links
    });

    await sendFirebaseEmail({
      to: email,
      subject: "Reset your password",
      html: `<p>Click to reset your password:</p><p><a href="${link}">Reset Password</a></p>`,
    });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    // swallow errors (e.g., user-not-found) to avoid enumeration
  }
  return { ok: true };
};

export const authenticate = async () => {
  const sessionCookie = await getSessionCookie();
  const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
  console.log(decoded);

  if (!decoded?.uid) {
    return {
      message: "Invalid Authentication",
      auth: 401,
    };
  }

  return {
    uid: decoded.uid,
    user: decoded.name,
    auth: 200,
    message: null,
  };
};

export const getSession = async () => {
  const sessionCookie = await getSessionCookie();
  if (!sessionCookie) return null;
  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!decoded?.uid) return null;

    const userRecord = await adminAuth.getUser(decoded.uid);
    return {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      image: decoded.picture,
      orgId: userRecord.customClaims?.orgId ?? null,
      siteRole: userRecord.customClaims?.siteRole ?? "user",
      orgRole: userRecord.customClaims?.orgRole ?? null,
    };
  } catch {
    return null;
  }
};

export const getToken = async (forceRefresh = false) => {
  const u = auth.currentUser;
  return u ? await u.getIdToken(forceRefresh) : null;
};
