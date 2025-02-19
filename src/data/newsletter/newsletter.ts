import { NewsletterMetadata } from "@/types/newsletter";

export const QUESTIONS = [
  {
    title: "To",
    type: "select",
  },
  {
    title: "title",
    type: "input",
  },
  {
    title: "Preview Text",
    type: "input",
  },
];

export const MOCK: NewsletterMetadata[] = [
  {
    subject: "Giving Guide 2025",
    date: new Date(),
    status: "approve",
  },
  {
    subject: "Interview with Enya Umanzor",
    date: new Date(),
    status: "approve",
  },
  {
    subject: "Giving Back with Phillips Foundation",
    date: new Date(),
    status: "done",
  },
];
