import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { env } from "./env";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

if (!getApps().length) {
  app = initializeApp({
    credential: cert({
      projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL!,
      privateKey: env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    }),
  });
} else {
  app = getApps()[0]!;
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
