import { env } from "@/utils/env";
export const GET = async () => {
  try {
    const response = await fetch(
      `https://us.posthog.com/api/projects/${env.PROJECT_ID}/insights/trend/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.POSTHOG_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          events: [{ id: "$pageview", name: "$pageview", type: "events" }],
          date_from: "all",
        }),
      },
    );

    console.log("PostHog API status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PostHog API error response:", errorText);
      throw new Error(
        `Failed to fetch PostHog analytics: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error("PostHog API error:", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    );
  }
};
