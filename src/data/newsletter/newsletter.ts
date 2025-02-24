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
    id: 0,
    subject: "Giving Guide 2025",
    date: new Date(),
    status: "approve",
  },
  {
    id: 1,
    subject: "Interview with Enya Umanzor",
    date: new Date(),
    status: "approve",
  },
  {
    id: 2,
    subject: "Giving Back with Phillips Foundation",
    date: new Date(),
    status: "done",
  },
];
