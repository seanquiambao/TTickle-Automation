import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "./env";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL!,
      privateKey: env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
}
export const adminAuth = getAuth();
