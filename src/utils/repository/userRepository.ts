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
};

export const updateUser = async (metadata: props) => {
  if (!(await getUser(metadata.uid))) return false;
  await updateDoc(doc(collection(db, "users"), metadata.uid), { ...metadata });
  return true;
};
