"use client";
import { useParams, useRouter } from "next/navigation";
import Information from "./information";
import OrgHeader from "./org-header";
import { useQuery } from "@tanstack/react-query";
import { Label } from "../ui/label";
import { getUsersbyOrgId } from "./actions";
import ManageSkeleton from "./manage-skeleton";
import { getSession } from "@/app/(auth)/actions";

const Manage = () => {
  const router = useRouter();

  const { data: session, isPending: sessionPending } = useQuery({
    queryKey: ["session"],
    queryFn: async () => getSession(),
  });

  console.log(session);
  const orgId = session?.orgId;
  // const { orgId } = useParams();

  const orgQuery = useQuery({
    queryKey: ["my-org", orgId],
    queryFn: async () => {
      const resp = await fetch(`/api/orgs/${orgId}`);
      return {
        status: resp.status,
        data: (await resp.json())["message"],
      };
    },
    enabled: !!orgId,
  });

  const { data: userData, isPending } = useQuery({
    queryKey: ["user", orgId],
    queryFn: async () => getUsersbyOrgId(orgId ?? ""),
    enabled: !!orgQuery.data && orgQuery.data.status === 200,
  });
  console.log(userData);

  if (!orgQuery.data) return;
  if (orgQuery.data.status == 400) {
    router.push("/user");
    return;
  }

  return (
    <>
      {isPending || sessionPending ? (
        <div className="flex flex-col items-start justify-center h-screen w-11/12 m-8 gap-5 ">
          <Label className="font-extrabold text-3xl self-start">Manage</Label>
          <ManageSkeleton />
        </div>
      ) : (
        <div className="flex flex-col w-11/12 m-8 gap-5">
          <Label className="font-extrabold text-3xl self-start">Manage</Label>
          <OrgHeader editable org={orgQuery.data.data} />
          <Information
            orgId={orgId}
            orgData={orgQuery.data.data}
            users={userData}
          />
        </div>
      )}
    </>
  );
};

export default Manage;
