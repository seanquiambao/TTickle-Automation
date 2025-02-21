import { db } from "@/utils/firebase";
import { auth } from "@clerk/nextjs/server";
import { addDoc, getDocs, collection, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const newslettersRef = collection(db, "newsletters");
    const q = query(newslettersRef, where("orgId", "==", "org_123"));
    const querySnapshot = await getDocs(q);

    const newsletters = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ newsletters });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { document } = await req.json();
  console.log(document);

  try {
    await addDoc(collection(db, "newsletters"), {
      orgId: "org_123",
      newsletter: document,
      timestamp: new Date(),
    });
    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
