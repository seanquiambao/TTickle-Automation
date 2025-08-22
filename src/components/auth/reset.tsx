"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Mail, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { passwordResetAction } from "@/app/(auth)/actions";
import { useRouter } from "next/navigation";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-start justify-center bg-ttickles-white p-6 sm:p-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_-10%,_rgba(80,71,163,0.06),_transparent_60%)]" />
      <div className="w-full max-w-md">
        <Image
          src="/temporarylogo.png"
          alt="Tt logo"
          width={120}
          height={120}
          priority
          className="mx-auto mb-6 sm:mb-8"
        />

        <Card className="border border-gray-100 shadow-sm transition-shadow duration-300 hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold leading-6 text-ttickles-darkblue">
              Reset your password
            </CardTitle>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Enter your email and we’ll send you a reset link.
            </p>
          </CardHeader>

          <CardContent>
            {sent ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 size={32} className="text-emerald-500" />
                <p className="text-sm text-center text-muted-foreground">
                  If an account exists for{" "}
                  <span className="font-medium text-ttickles-lightblue">
                    {email}
                  </span>
                  , a reset link has been sent. Check your inbox and spam
                  folder.
                </p>
                <div className="mt-2 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button
                    onClick={() => router.back()}
                    variant="outline"
                    className="w-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to sign in
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setSent(false)}
                  >
                    Use a different email
                  </Button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  startTransition(async () => {
                    await passwordResetAction(email.trim());
                    setSent(true);
                  });
                }}
                className="space-y-4"
              >
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    aria-label="Email"
                    className="pl-10 bg-ttickles-white text-black border border-ttickles-lightblue/60 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-ttickles-darkblue text-white hover:bg-ttickles-darkblue/90 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>

                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reset;
