import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    // Firebase config
    NEXT_PRIVATE_FIREBASE_PROJECT_ID: z.string(),
    NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL: z.string().optional(),
    NEXT_PRIVATE_FIREBASE_PRIVATE_KEY: z.string().optional(),

    // API keys and auth
    GEMINI_API_KEY: z.string().optional(),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    NEXTAUTH_URL: z.string().url().optional(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    OLLAMA_URL: z.string().optional(),
    // PostHog
    POSTHOG_API_KEY: z.string().optional(),
    PROJECT_ID: z.string().optional(),

    // Other services
    BLOB_READ_WRITE_TOKEN: z.string().optional(),
    TRIGGER_SECRET_KEY: z.string().optional(),

    // Environment
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // Firebase public config
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string(),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string(),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string(),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string(),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().optional(),
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().optional(),

    NEXT_PUBLIC_SMTP_HOST: z.string().optional(),
    NEXT_PUBLIC_SMTP_PORT: z.string().optional(),
    NEXT_PUBLIC_SMTP_USER: z.string().optional(),
    NEXT_PUBLIC_SMTP_PASS: z.string().optional(),
    NEXT_PUBLIC_SMTP_FROM: z.string().optional(),

    // Google Calendar API
    NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY: z.string().optional(),

    // PostHog public config
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // Firebase config
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PRIVATE_FIREBASE_PROJECT_ID:
      process.env.NEXT_PRIVATE_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL:
      process.env.NEXT_PRIVATE_FIREBASE_CLIENT_EMAIL,
    NEXT_PRIVATE_FIREBASE_PRIVATE_KEY:
      process.env.NEXT_PRIVATE_FIREBASE_PRIVATE_KEY,

    // SMTP config
    NEXT_PUBLIC_SMTP_HOST: process.env.NEXT_PUBLIC_SMTP_HOST,
    NEXT_PUBLIC_SMTP_PORT: process.env.NEXT_PUBLIC_SMTP_PORT,
    NEXT_PUBLIC_SMTP_USER: process.env.NEXT_PUBLIC_SMTP_USER,
    NEXT_PUBLIC_SMTP_PASS: process.env.NEXT_PUBLIC_SMTP_PASS,
    NEXT_PUBLIC_SMTP_FROM: process.env.NEXT_PUBLIC_SMTP_FROM,

    // Auth config
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,

    // API keys
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY,
    OLLAMA_URL: process.env.OLLAMA_URL,

    // PostHog
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    POSTHOG_API_KEY: process.env.POSTHOG_API_KEY,
    PROJECT_ID: process.env.PROJECT_ID,

    // Other services
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY,

    // Environment
    NODE_ENV: process.env.NODE_ENV,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
