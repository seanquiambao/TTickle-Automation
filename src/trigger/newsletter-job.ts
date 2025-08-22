import { logger, schedules } from "@trigger.dev/sdk/v3";
import { env } from "@/utils/env";
export const emailNewsletterJob = schedules.task({
  id: "send-newsletters",
  cron: "*/5 * * * *", // every 5 minutes
  maxDuration: 300,
  run: async () => {
    logger.log("Running newsletter job...");
    const url = `${env.NEXTAUTH_URL}/api/newsletter/schedule`;
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ content: "Dynamic!" }),
    });
    const data = await res.json();
    logger.log("Newsletter job ran:", data);
  },
});
