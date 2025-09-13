"use server";
import { options } from "@/utils/auth";
import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getServerSession } from "next-auth";

export const getUsersbyOrgId = async (orgId: string | string[]) => {
  try {
    const q = query(collection(db, "users"), where("orgId", "==", orgId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const { name, email, role } = doc.data();
      return {
        id: doc.id,
        name,
        email,
        role,
      };
    });
  } catch (err) {
    throw new Error(`Internal Server Error: ${err}`);
  }
};
