import { FirebaseError } from "firebase/app";

type AuthContext = "signin" | "signup" | "oauth" | "reset" | "generic";

const isFirebaseError = (e: unknown): e is FirebaseError => {
  return !!e && typeof e === "object" && "code" in e && "message" in e;
};

const BASE_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "Please enter a valid email.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/user-disabled": "This account has been disabled.",
  "auth/operation-not-allowed": "This sign-in method is not enabled.",
  "auth/unauthorized-domain": "This domain is not authorized for sign-in.",
  "auth/invalid-api-key": "Project configuration error. Contact support.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/invalid-login-credentials": "Email or password is incorrect.",
};

const CONTEXT_OVERRIDES: Partial<Record<AuthContext, Record<string, string>>> =
  {
    signin: {
      "auth/user-not-found": "No account found for this email.",
      "auth/wrong-password": "Incorrect password.",
      "auth/invalid-credential": "Email or password is incorrect.",
      "auth/invalid-login-credentials": "Email or password is incorrect.",
    },
    signup: {
      "auth/email-already-in-use": "This email is already in use.",
      "auth/weak-password": "Password is too weak.",
      "auth/operation-not-allowed": "Email/password sign-up is disabled.",
    },
    oauth: {
      "auth/popup-closed-by-user": "Sign-in window was closed.",
      "auth/cancelled-popup-request": "Another sign-in is in progress.",
      "auth/popup-blocked": "Popup was blocked. Allow popups and try again.",
      "auth/account-exists-with-different-credential":
        "This email is linked to a different sign-in method.",
      "auth/credential-already-in-use":
        "This credential is already linked to another account.",
    },
    reset: {
      "auth/user-not-found": "No account found for this email.",
      "auth/invalid-email": "Please enter a valid email.",
    },
  };

export const authErrorMessage = (
  err: unknown,
  ctx: AuthContext = "generic",
): string => {
  if (!isFirebaseError(err)) return "Something went wrong. Please try again.";

  const code = err.code as string;

  const byCtx = CONTEXT_OVERRIDES[ctx]?.[code];
  if (byCtx) return byCtx;

  const base = BASE_MESSAGES[code];
  if (base) return base;

  return "Something went wrong. Please try again.";
};
