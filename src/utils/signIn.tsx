"use client";
import { signIn } from "next-auth/react";
import { signInWithPopup } from "firebase/auth";
import { auth, providers } from "./firebase";

interface Props {
  callback: string;
}

const SignIn = ({ callback }: Props) =>
  void signIn("google", { callbackUrl: callback });

export default SignIn;

export const signInProviders = async (name: "google" | "facebook") => {
  const provider = providers[name];
  return signInWithPopup(auth, provider);
};
