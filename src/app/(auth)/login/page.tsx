"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signInAction } from "../actions";

const signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const formData = new FormData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    formData.append("email", email);
    formData.append("password", password);
    const result = signInAction(formData);
    console.log(result);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-ttickles-white w-full p-10">
      <Image
        src="/temporarylogo.png"
        alt="logo"
        width={200}
        height={200}
        className="mb-4"
      />
      <Card className="bg-white rounded-xl max-w-xl mx-auto p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
        <CardHeader className="bg-transparent">
          <CardTitle className="text-xl text-center text-ttickles-lightblue">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-transparent">
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="bg-ttickles-white text-black border border-ttickles-lightblue placeholder-gray-400 focus:ring-2 focus:ring-[#5047a3]"
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="bg-ttickles-white text-black border border-ttickles-lightblue placeholder-gray-400 focus:ring-2 focus:ring-[#5047a3]"
            />
            <Button
              type="submit"
              className="w-full bg-ttickles-darkblue hover:bg-ttickles-darkblue/80 text-white"
            >
              Sign In
            </Button>
          </form>
          <div className="my-4 flex items-center gap-2">
            <div className="flex-grow border-t border-[#34304e]" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-grow border-t border-[#34304e]" />
          </div>
          <div className="flex gap-3">
            <Button
              //   onClick={() => signIn("google")}
              className="w-full max-w-sm bg-white border hover:bg-gray-100 text-black flex items-center justify-center gap-2"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Google
            </Button>

            <Button
              //   onClick={() => signIn("github")}
              className="w-full max-w-sm bg-black hover:bg-gray-900 text-white flex items-center justify-center gap-2"
            >
              <Image
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="GitHub"
                width={20}
                height={20}
                className="invert"
              />
              GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default signin;
