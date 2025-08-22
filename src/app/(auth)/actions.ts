"use server";

import { adminAuth } from "@/utils/admin";
import { sendEmail } from "@/utils/email";
import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await signInWithEmailAndPassword(auth, email, password);

  return { success: true, message: "Sign-in successful" };
};

export const passwordResetAction = async (email: string) => {
  try {
    const link = await adminAuth.generatePasswordResetLink(email, {
      url: "https://your-domain.com/reset/confirm", // must be allow-listed in Firebase Auth
      // dynamicLinkDomain: "yourapp.page.link", // if using Firebase Dynamic Links
    });
    console.log("Password reset link:", link);
    // Send the email yourself for full branding:
    // refactor to
    // await sendEmail({
    //   subject: "Reset your password",
    //   body: `<p>Click to reset your password:</p><p><a href="${link}">Reset Password</a></p>`,
    //   recipients: [email],
    //   template: "modern"
    // });

    await sendEmail(
      "Reset your password",
      `<p>Click to reset your password:</p><p><a href="${link}">Reset Password</a></p>`,
      [email],
      "modern",
    );
  } catch (error) {
    console.error("Error sending password reset email:", error);
    // swallow errors (e.g., user-not-found) to avoid enumeration
  }
  return { ok: true };
};
