import { options } from "@/utils/auth";
import { updateUser } from "@/utils/repository/userRepository";
import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Props = User;
export const POST = async (request: NextRequest) => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json(
      { message: "You are not authorized to access the Users API." },
      { status: 403 },
    );
  }
  if (
    request.headers.get("Content-Type")?.toLowerCase() != "application/json"
  ) {
    return NextResponse.json(
      { message: "Please provide updated user data." },
      { status: 400 },
    );
  }

  const data = (await request.json().catch(() => undefined)) as
    | Props
    | undefined;
  if (!data) {
    return NextResponse.json(
      { message: "Please provide updated user data." },
      { status: 400 },
    );
  }

  const { uid } = session.user as User & { uid: string; orgId?: string };
  const result = await updateUser({
    uid,
    name: data.name,
    email: data.email,
    image: data.image,
    orgId: data.orgId,
  });
  return NextResponse.json(
    { message: result ?? "Unable to update your user data." },
    { status: result ? 200 : 400 },
  );
};
