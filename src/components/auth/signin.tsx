"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, Loader2, Facebook } from "lucide-react";
import { authenticate, createSessionFromIdToken } from "@/app/(auth)/actions";
import { signInProviders } from "@/utils/signIn";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/navigation";
import { authErrorMessage } from "@/utils/firebase-error";

const SignIn = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const validate = () => {
    const e = email.trim();
    const p = password.trim();
    if (!e || !p) {
      setFormError("Email and password are required.");
      return false;
    }
    setFormError(null);
    return true;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await user.getIdToken(true);
      if (!idToken) throw new Error("No ID token found.");

      await createSessionFromIdToken(idToken);
      router.push("/user");
    } catch (err) {
      setFormError(authErrorMessage(err, "signin"));
    } finally {
      setLoading(false);
    }
  };

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
            <CardTitle className="text-center text-2xl leading-6 font-bold text-ttickles-blue">
              Sign In
            </CardTitle>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              Welcome back!
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4" aria-busy={loading}>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  className="pl-10 bg-ttickles-white text-black border border-ttickles-lightblue/60 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                />
              </div>

              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="pl-10 pr-10 bg-ttickles-white text-black border border-ttickles-lightblue/60 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {formError && (
                <p
                  className="text-sm text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  {formError}
                </p>
              )}

              <div className="space-y-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-ttickles-darkblue text-white hover:bg-ttickles-darkblue/90 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    href="/reset-password"
                    className="text-xs text-ttickles-blue underline-offset-2 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="text-center text-sm">
                Don{"'"}t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-ttickles-blue underline-offset-2 hover:underline"
                >
                  Sign up
                </Link>
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs text-gray-400">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={async () => {
                    const { success } = await signInProviders("google");
                    if (success) router.push("/user");
                  }}
                  className="w-full justify-center gap-2 border-gray-200 bg-white hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                >
                  <Image
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    width={18}
                    height={18}
                  />
                  <span>Google</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={async () => {
                    const { success } = await signInProviders("facebook");
                    if (success) router.push("/user");
                  }}
                  className="w-full justify-center gap-2 border-gray-200 bg-white hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                >
                  <Image
                    src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                    alt="Facebook"
                    width={18}
                    height={18}
                  />
                  <span>Facebook</span>
                </Button>

                {process.env.NODE_ENV === "development" && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={async () => console.log(await authenticate())}
                      className="w-full justify-center gap-2 border-gray-200 bg-white hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                    >
                      <Facebook className="h-4 w-4" />
                      <span>Auth</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={async () => {
                        const u = auth.currentUser;
                        if (!u) return null;
                        const res = await u.getIdTokenResult(true);
                        const { siteRole, orgId, orgRole } = res.claims as {
                          siteRole?: string;
                          orgId?: string;
                          orgRole?: string;
                        };
                        const exists =
                          Object.prototype.hasOwnProperty.call(
                            res.claims,
                            "siteRole",
                          ) &&
                          Object.prototype.hasOwnProperty.call(
                            res.claims,
                            "orgId",
                          ) &&
                          Object.prototype.hasOwnProperty.call(
                            res.claims,
                            "orgRole",
                          );
                        console.log({ exists, siteRole, orgId, orgRole });
                      }}
                      className="w-full justify-center gap-2 border-gray-200 bg-white hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
                    >
                      <Facebook className="h-4 w-4" />
                      <span>Claims</span>
                    </Button>
                  </>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
