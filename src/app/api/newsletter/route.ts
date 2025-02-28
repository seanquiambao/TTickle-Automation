import { db } from "@/utils/firebase";
import { auth } from "@clerk/nextjs/server";
import {
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const q = query(
      collection(db, "newsletters"),
      where("orgId", "==", "org_123"),
    );
    const querySnapshot = await getDocs(q);

    const newsletters = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        newsletter: data.newsletter[0],
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
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const newsletterRef = await addDoc(collection(db, "newsletters"), {
      orgId: "org_123",
      newsletter: [" "],
      newsletterStatus: "revise",
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
  const { userId } = await auth();
  if (!userId) {
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
  const { userId } = await auth();
  if (!userId) {
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
