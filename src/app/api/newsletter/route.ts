import { getSession } from "@/app/(auth)/actions";
import { options } from "@/utils/auth";
import { db } from "@/utils/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  // const session = await getServerSession(options);
  // if (!session) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }

  const session = await getSession();
  console.log(session);

  try {
    const q = query(
      collection(db, "newsletters"),
      where("orgId", "==", session.orgId),
    );
    const querySnapshot = await getDocs(q);

    const newsletters = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      const newsletterContent =
        data?.newsletter?.content?.[0]?.content
          ?.map(({ text }: { text: string }) => text)
          .join("") || "";
      return {
        newsletter: newsletterContent || data.newsletter[0],
        newsletterId: data.newsletterId,
        newsletterStatus: data.newsletterStatus,
      };
    });
    return NextResponse.json({ newsletters }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

export const POST = async () => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const newsletterRef = await addDoc(collection(db, "newsletters"), {
      orgId: session.user.orgId,
      newsletter: [" "],
      newsletterStatus: "draft",
      timestamp: new Date(),
    });
    await updateDoc(newsletterRef, { newsletterId: newsletterRef.id });

    return NextResponse.json(
      { newsletterId: newsletterRef.id },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

export const DELETE = async (req: NextRequest) => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { newsletterId } = await req.json();

  try {
    const q = query(
      collection(db, "newsletters"),
      where("newsletterId", "in", newsletterId),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: "Newsletter not found" },
        { status: 404 },
      );
    }

    const deletePromises = querySnapshot.docs.map((docSnap) => {
      const docRef = docSnap.ref;
      return deleteDoc(docRef);
    });

    await Promise.all(deletePromises);

    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { newsletterIds, newStatus } = await req.json();

  try {
    const q = query(
      collection(db, "newsletters"),
      where("newsletterId", "in", newsletterIds),
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: "Newsletter not found" },
        { status: 404 },
      );
    }

    const updatedPromises = querySnapshot.docs.map((docSnap) => {
      const newsletterRef = doc(db, "newsletters", docSnap.id);
      return updateDoc(newsletterRef, { newsletterStatus: newStatus });
    });

    await Promise.all(updatedPromises);

    return NextResponse.json({ status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: `Internal Server Error: ${err}` },
      { status: 500 },
    );
  }
};
