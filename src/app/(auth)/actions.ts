"use server";

import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await signInWithEmailAndPassword(auth, email, password);

  return { success: true, message: "Sign-in successful" };
};
