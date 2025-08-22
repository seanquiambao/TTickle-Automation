import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { NextAuthOptions, Session, User } from "next-auth";
import { Adapter } from "next-auth/adapters";
import { getServerSession } from "next-auth/next";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { env } from "./env";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      profile(profile: GoogleProfile) {
        return {
          id: profile.sub,
          uuid: crypto.randomUUID(),
          email: profile.email,
          name: profile.name,
          role: "User",
          image: profile.picture,
          orgId: "",
        };
      },
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar",
        },
      },
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL,
      privateKey: env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY,
    }),
  }) as unknown as Adapter,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async session({ session, user }) {
      session.user = user;
      return session;
    },
  },
};

type AuthenticateProps = {
  status: number;
  user?: User;
};

export const authenticate = async (): Promise<AuthenticateProps> => {
  const session: Session | null = await getSession();
  if (!session?.user || !session.user.email) {
    return {
      status: 403,
    };
  }
  return {
    status: 200,
    user: session.user,
  };
};

export const getSession = async () => {
  return await getServerSession(options);
};
