"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { signInWithCustomToken } from "firebase/auth";
import { auth as firebaseAuth } from "@/utils/firebase";
import Loading from "../global/loading";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, userId, getToken } = useAuth();

  // Tracks whether we've finished the signIn/fetch steps
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    if (!isLoaded) return; // Wait until Clerk is loaded
    if (!userId) {
      // If user is not signed in,
      // decide whether you want to block or allow a "guest" view
      setIsSyncing(false);
      return;
    }

    // If user *is* signed in, do the Firebase custom token flow
    const doSync = async () => {
      try {
        const token = await getToken({ template: "integration_firebase" });
        await signInWithCustomToken(firebaseAuth, token ?? "");
        // Then call your API route
        await fetch("/api/user", { method: "POST" });
      } finally {
        setIsSyncing(false);
      }
    };

    void doSync();
  }, [isLoaded, userId, getToken]);

  // While we are still syncing, show a loading spinner (or blank screen)
  if (isSyncing) {
    return <Loading />;
  }

  console.log("aaa");

  // Otherwise render the real app
  return <>{children}</>;
}
