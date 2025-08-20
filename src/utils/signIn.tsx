"use client";
import { signIn } from "next-auth/react";

interface Props {
  callback: string;
}

const SignIn = ({ callback }: Props) =>
  void signIn("google", { callbackUrl: callback });

export default SignIn;
