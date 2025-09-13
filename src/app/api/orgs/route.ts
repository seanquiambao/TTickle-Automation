import { authenticate, getSession } from "@/app/(auth)/actions";
import { Organization } from "@/data/types";
// import { options } from "@/utils/auth";
import { createOrg, getOrg } from "@/utils/repository/orgRepository";
import { getUser, updateUser } from "@/utils/repository/userRepository";
// import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Mode = "join" | "create";

type Props = {
  org?: Organization;
  orgId?: string;
  mode: Mode;
};

export const GET = async () => {
  // const session = await getServerSession(options);
  // if (!session) {
  //   return NextResponse.json(
  //     { message: "You are not authorized to access the Groups API." },
  //     { status: 403 },
  //   );
  // }

  // const { uid, auth, message } = await authenticate();
  // if (!uid || auth !== 200) {
  //   return NextResponse.json(
  //     {
  //       message: message,
  //     },
  //     { status: auth },
  //   );
  // }
  const session = await getSession();

  const result = await getUser(session.uid);
  if (!result) {
    return NextResponse.json(
      {
        message:
          "Something went wrong retrieving your user data. Please try again later.",
      },
      { status: 400 },
    );
  }
  const org = await getOrg(result.orgId);
  return NextResponse.json(
    { message: org ?? "You are not a part of an organization." },
    { status: org ? 200 : 400 },
  );
};

export const POST = async (request: NextRequest) => {
  const { uid, message, auth } = await authenticate();
  if (!uid || auth !== 200) {
    return NextResponse.json(
      {
        message: message,
      },
      { status: auth },
    );
  }

  if (
    request.headers.get("Content-Type")?.toLowerCase() != "application/json"
  ) {
    return NextResponse.json(
      {
        message:
          "Please provide a group and whether you are joining or creating ('join' or 'create').",
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
        message:
          "Please provide a group and whether you are joining or creating ('join' or 'create').",
      },
      { status: 400 },
    );
  }

  if (data.mode === "join") {
    const result = await getOrg(data.orgId!);
    if (!result) {
      return NextResponse.json(
        { message: "This organization does not exist." },
        { status: 400 },
      );
    }
    await updateUser({
      uid,
      orgId: data.orgId!,
      role: { orgRole: "member" },
    });
    return NextResponse.json(
      { message: "Succesfully joined the organization." },
      { status: 200 },
    );
  } else if (data.mode === "create") {
    const result = await createOrg(data.org!);
    await updateUser({
      uid,
      orgId: data.org!.id,
      role: { orgRole: "owner" },
    });

    return NextResponse.json(
      { message: result ?? "This organization already exists." },
      { status: result ? 200 : 400 },
    );
  }

  return NextResponse.json(
    { message: "You did not provide a correct mode ('join' or 'create')." },
    { status: 400 },
  );
};
