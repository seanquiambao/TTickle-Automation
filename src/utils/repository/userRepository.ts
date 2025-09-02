import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { User as UserMetadata } from "next-auth";
import { db } from "../firebase";

export const getUser = async (
  id: string,
): Promise<UserMetadata | undefined> => {
  const result = await getDoc(doc(collection(db, "users"), id));
  if (!result.data()) return undefined;
  return result.data() as unknown as UserMetadata;
};

type props = {
  uid: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  orgId?: string;
  role?: { orgRole?: "owner" | "admin" | "member" | null };
};

export const updateUser = async (metadata: props) => {
  const exists = await getUser(metadata.uid);
  if (!exists) return false;

  // Decide how to set role when org changes:
  // - If orgId is explicitly null → also clear orgRole.
  // - If orgId provided and orgRole omitted → default to "member" (or keep existing; your call).
  const patch: Partial<Claims> = {};
  if ("orgId" in metadata) {
    patch.orgId = metadata.orgId ?? null;
    if (metadata.orgId === null) {
      patch.orgRole = null;
    } else if (metadata.role?.orgRole !== undefined) {
      patch.orgRole = metadata.role.orgRole;
    } else {
      patch.orgRole = "member";
    }
  } else if (metadata.role?.orgRole !== undefined) {
    patch.orgRole = metadata.role.orgRole;
  }

  if (Object.keys(patch).length > 0) {
    await updateCustomClaims(metadata.uid, patch);
  }

  await updateDoc(doc(collection(db, "users"), metadata.uid), {
    ...metadata,
  });

  return true;
};

import { auth as adminAuth } from "firebase-admin";

type SiteRole = "owner" | "admin" | "user";
type OrgRole = "owner" | "admin" | "member" | null;

type Claims = {
  siteRole?: SiteRole;
  orgId?: string | null;
  orgRole?: OrgRole;
};

const ALLOWED_KEYS = new Set<keyof Claims>(["siteRole", "orgId", "orgRole"]);

const updateCustomClaims = async (
  uid: string,
  patch: Partial<Claims>,
): Promise<Claims> => {
  const user = await adminAuth().getUser(uid);
  const current = (user.customClaims ?? {}) as Claims;

  const next: Record<string, unknown> = { ...current };
  for (const [k, v] of Object.entries(patch)) {
    if (!ALLOWED_KEYS.has(k as keyof Claims)) continue;
    if (v === undefined) delete next[k];
    else next[k] = v;
  }

  await adminAuth().setCustomUserClaims(uid, next);
  return next as Claims;
};
