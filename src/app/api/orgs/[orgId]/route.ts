import { Organization } from "@/data/types";
import { options } from "@/utils/auth";
import { getOrg, updateOrg } from "@/utils/repository/orgRepository";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: {
    orgId: string;
  };
};

export const GET = async (request: NextRequest, { params }: Params) => {
  // const session = await getServerSession(options);
  // if (!session) {
  //   return NextResponse.json(
  //     { message: "You are not authorized to access the Groups API." },
  //     { status: 403 },
  //   );
  // }

  let dataRequested = true;
  if (
    request.nextUrl.searchParams.has("data") &&
    !JSON.parse(request.nextUrl.searchParams.get("data") as string)
  ) {
    dataRequested = false;
  }

  const org = await getOrg(params.orgId);
  if (!org) {
    return NextResponse.json(
      {
        message: "This organization does not exist.",
      },
      { status: 400 },
    );
  }

  // if (
  //   dataRequested &&
  //   org.owner != session.user.uuid &&
  //   !org.users.includes(session.user.uuid) &&
  //   session.user.role.toLowerCase() != "administrator"
  // ) {
  //   return NextResponse.json(
  //     { message: "You are not authorized to access another Group's data." },
  //     { status: 401 },
  //   );
  // }

  return NextResponse.json(
    { message: dataRequested ? org : org != undefined },
    { status: org != undefined ? 200 : 400 },
  );
};

type Props = Partial<Organization>;

const updateOrganization = <K extends keyof Organization>(
  org: Organization,
  key: K,
  value: Organization[K],
) => {
  org[key] = value; // no cast needed here
};

export const POST = async (request: NextRequest, { params }: Params) => {
  // const session = await getServerSession(options);
  // if (!session) {
  //   return NextResponse.json(
  //     { message: "You are not authorized to access the Groups API." },
  //     { status: 403 },
  //   );
  // }
  const org = await getOrg(params.orgId);
  if (!org) {
    return NextResponse.json(
      {
        message: "This organization does not exist.",
      },
      { status: 400 },
    );
  }

  const data = (await request.json().catch(() => undefined)) as
    | Props
    | undefined;
  if (!data) {
    return NextResponse.json(
      {
        message: "Please provide updated group data.",
      },
      { status: 400 },
    );
  }

  for (const key of Object.keys(data) as (keyof Organization)[]) {
    const val = data[key] as Organization[typeof key];
    // If val is not undefined, update the org.
    if (val !== undefined) {
      updateOrganization(org, key, val);
    }
  }

  const update = await updateOrg(org);
  return NextResponse.json(
    {
      message: update
        ? "Organization updated."
        : "Unable to update organization",
    },
    { status: update ? 200 : 400 },
  );
};
