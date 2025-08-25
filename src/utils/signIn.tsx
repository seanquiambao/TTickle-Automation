"use client";
import { signIn } from "next-auth/react";
import { getIdToken, signInWithPopup } from "firebase/auth";
import { auth, providers } from "./firebase";
import { createSessionFromIdToken } from "@/app/(auth)/actions";

interface Props {
  callback: string;
}

const SignIn = ({ callback }: Props) =>
  void signIn("google", { callbackUrl: callback });

export default SignIn;

export const signInProviders = async (name: "google" | "facebook") => {
  const provider = providers[name];
  const { user } = await signInWithPopup(auth, provider);
  console.log(user);
  const idToken = await getIdToken(user, true);
  await createSessionFromIdToken(idToken);

  return { success: true, uid: user.uid };
};
