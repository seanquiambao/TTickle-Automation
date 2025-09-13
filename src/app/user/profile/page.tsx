"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  ShieldCheck,
  Building2,
  User2,
  ImageIcon,
  ScrollIcon,
  EthernetPort,
} from "lucide-react";
import { auth } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import {
  authenticate,
  createSessionFromIdToken,
  getSession,
  getToken,
} from "@/app/(auth)/actions";
import Loading from "@/components/global/loading";

// ---- Types ----
export type OrgRole = "owner" | "admin" | "member" | null;
export type SiteRole = "owner" | "admin" | "user";

interface FirestoreUserDoc {
  uid: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  orgId?: string | null;
  role?: { orgRole?: OrgRole };
}

interface Claims {
  siteRole?: SiteRole;
  orgId?: string | null;
  orgRole?: OrgRole;
}

// // API helper: you must implement /api/user/profile on the server using admin SDK + your updateUser code
// async function updateProfileApi(payload: {
//   uid: string;
//   name?: string | null;
//   image?: string | null;
//   orgId?: string | null;
//   orgRole?: OrgRole;
// }) {
//   const res = await fetch("/api/user/profile", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(text || "Failed to update profile");
//   }
//   return (await res.json()) as { ok: true };
// }

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uid, setUid] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [orgId, setOrgId] = useState<string | "" | null>("");
  const [orgRole, setOrgRole] = useState<OrgRole>(null);
  const [siteRole, setSiteRole] = useState<SiteRole | undefined>(undefined);
  const session = getSession();
  console.log("Session:", session);

  const initials = useMemo(() => {
    const n = name?.trim() || email?.trim() || "U";
    return n
      .split(/[\s@._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]!.toUpperCase())
      .join("");
  }, [name, email]);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      try {
        if (!u) {
          setLoading(false);
          return;
        }
        setUid(u.uid);
        setEmail(u.email ?? null);
        setEmailVerified(u.emailVerified ?? null);

        // Claims (force refresh so they're current)
        const tokenResult = await u.getIdTokenResult(true);
        const claims = tokenResult.claims as Claims;
        setSiteRole(claims.siteRole);
        setOrgRole((claims.orgRole ?? null) as OrgRole);
        setOrgId((claims.orgId ?? "") as string | "");

        // Firestore profile doc
        const snap = await getDoc(doc(db, "users", u.uid));
        const data = snap.data() as FirestoreUserDoc | undefined;
        if (data) {
          setName((data.name ?? "") as string);
          setImage((data.image ?? "") as string);
          // prefer Firestore orgId if set, else keep claims value
          if (data.orgId !== undefined)
            setOrgId((data.orgId ?? "") as string | "");
          if (data.role?.orgRole !== undefined)
            setOrgRole((data.role.orgRole ?? null) as OrgRole);
        }
      } catch (e: unknown) {
        console.error(e);
        toast.error(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const onSave = useCallback(async () => {
    if (!uid) return;
    setSaving(true);
    try {
      //   await updateProfile({
      //     uid,
      //     name: name.trim() || null,
      //     image: image.trim() || null,
      //     orgId: (orgId ?? "").toString().trim() || null,
      //     orgRole,
      //   });

      const u = auth.currentUser;
      if (u) {
        const idToken = await u.getIdToken(true);
        await createSessionFromIdToken(idToken);
      }

      toast.success("Profile updated");
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }, [uid, name, image, orgId, orgRole]);

  if (loading) {
    return <Loading />;
  }

  if (!uid) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm text-gray-600">
          You must be signed in to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-start w-11/12 m-8 gap-5 ">
      <div className="flex items-center justify-between w-full">
        <Label className="font-extrabold text-3xl self-start">Profile</Label>
        <div className="text-sm text-gray-500">
          Site role:{" "}
          <span className="font-medium text-ttickles-darkblue">
            {siteRole ?? "—"}
          </span>
        </div>
      </div>

      <div className="w-full flex gap-6">
        <Card className="border border-gray-100 shadow-sm hover:shadow-md w-full duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-ttickles-blue">Identity</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[auto,1fr] md:gap-6">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-20 w-20 ring-2 ring-ttickles-lightblue/50">
                <AvatarImage
                  src={image || undefined}
                  alt={name || "User avatar"}
                />
                <AvatarFallback className="bg-ttickles-lightblue/20 text-ttickles-darkblue">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="avatar"
                  className="cursor-pointer rounded-md border border-ttickles-lightblue/60 bg-white px-3 py-1 text-xs text-ttickles-darkblue hover:bg-gray-50"
                >
                  <span className="inline-flex items-center gap-1">
                    <ImageIcon className="h-4 w-4" />
                    Change
                  </span>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      // NOTE: plug in your storage upload; for now we just preview
                      const url = URL.createObjectURL(f);
                      setImage(url);
                      toast.message(
                        "Selected new avatar. Don't forget to Save.",
                      );
                    }}
                  />
                </label>
                <Button variant="ghost" size="sm" onClick={() => setImage("")}>
                  Remove
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Display name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-ttickles-white text-black border border-ttickles-lightblue/60 focus-visible:ring-ttickles-darkblue"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    value={email ?? ""}
                    readOnly
                    className="pl-10 bg-gray-50 text-gray-700 border border-ttickles-lightblue/40"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {emailVerified ? (
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-orange-600">
                      <ShieldCheck className="h-3.5 w-3.5 rotate-45" /> Not
                      verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-100 shadow-sm hover:shadow duration-300 w-1/2">
          <CardHeader className="pb-2">
            <CardTitle className="text-ttickles-blue">Organization</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-1">
            <div className="grid gap-2">
              <Label htmlFor="orgId" className="inline-flex items-center gap-1">
                <Building2 className="h-4 w-4 text-ttickles-blue" /> Org ID
              </Label>
              <Input
                id="orgId"
                value={(orgId ?? "") as string}
                onChange={(e) => setOrgId(e.target.value)}
                placeholder="e.g. acme-123"
                className="bg-ttickles-white text-black border border-ttickles-lightblue/60 focus-visible:ring-ttickles-darkblue"
              />
              <p className="text-xs text-gray-500">
                Leave blank to clear org membership.
              </p>
            </div>

            <div className="grid gap-2">
              <Label className="inline-flex items-center gap-1">
                <User2 className="h-4 w-4 text-ttickles-blue" /> Org role
              </Label>
              <p className=" border border-ttickles-lightblue/60 bg-ttickles-white text-black px-3 py-2 rounded-md">
                {orgRole ?? "none"}
              </p>
              <p className="text-xs text-gray-500">
                Changing role updates your custom claims.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          className="border-ttickles-lightblue/60"
          onClick={async () => {
            const u = auth.currentUser;
            if (!u) return;
            const idToken = await u.getIdToken(true);
            await createSessionFromIdToken(idToken);
            toast.success("Session refreshed");
          }}
        >
          Refresh access
        </Button>
        <Button
          onClick={onSave}
          disabled={saving}
          className="bg-ttickles-darkblue text-white hover:bg-ttickles-darkblue/90"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save changes"
          )}
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
              <EthernetPort className="h-4 w-4" />
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
                  Object.prototype.hasOwnProperty.call(res.claims, "orgId") &&
                  Object.prototype.hasOwnProperty.call(res.claims, "orgRole");
                console.log({ exists, siteRole, orgId, orgRole });
              }}
              className="w-full justify-center gap-2 border-gray-200 bg-white hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
            >
              <ScrollIcon className="h-4 w-4" />
              <span>Claims</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={async () => {
                const token = await getToken();
                const res = await fetch("http://localhost:3001/api/image", {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                const data = await res.json();
                console.log(data);
              }}
              className="w-full justify-center gap-2 border-gray-200 bg-white hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#5047a3]"
            >
              <EthernetPort className="h-4 w-4" />
              <span>JWT Verify</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
