import React from "react";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import SignIn from "@/utils/signIn";
import { options } from "@/utils/auth";
import { Role } from "@/data/types";
import { redirect } from "next/navigation";
const ProtectedPage = async ({
  children,
  role = "User",
}: {
  children: React.ReactNode;
  role?: Role;
}) => {
  const session = await getServerSession(options);
  const header = await headers();
  const pathName = header.get("x-url") || "";
  if (!session) {
    return <SignIn callback={pathName} />;
  }
  if (role != session.user.role) {
    redirect("/user");
  }

  return <>{children}</>;
};

export default ProtectedPage;
