import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { render } from "@react-email/render";
import { ModernBusinessTemplate } from "@/components/email/template";
import { MinimalistTemplate } from "@/components/email/template";
import { VibrantTemplate } from "@/components/email/template";
import { CorporateTemplate } from "@/components/email/template";
import { env } from "./env";

const transporter = nodemailer.createTransport({
  host: (env.NEXT_PUBLIC_SMTP_HOST as string) ?? "",
  port: (env.NEXT_PUBLIC_SMTP_PORT as unknown as number) ?? 25,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: (env.NEXT_PUBLIC_SMTP_USER as string) ?? "",
    pass: (env.NEXT_PUBLIC_SMTP_PASS as string) ?? "",
  },
});

export const sendEmail = async (
  subject: string,
  body: string,
  recipients: string[],
  template: "modern" | "minimalist" | "vibrant" | "classic",
): Promise<SMTPTransport.SentMessageInfo> => {
  const fromLine = env.NEXT_PUBLIC_SMTP_FROM ?? "no-reply";
  console.log(body);
  let emailHtml = "";
  switch (template) {
    case "modern":
      emailHtml = await render(ModernBusinessTemplate({ body }));
      break;
    case "minimalist":
      emailHtml = await render(MinimalistTemplate({ body }));
      break;
    case "vibrant":
      emailHtml = await render(VibrantTemplate({ body }));
      break;
    case "classic":
      emailHtml = await render(CorporateTemplate({ body }));
      break;
    default:
      emailHtml = body;
  }
  return await transporter.sendMail({
    from: fromLine,
    to: recipients.join(", "),
    subject: subject,
    text: body,
    html: emailHtml,
  });
};
