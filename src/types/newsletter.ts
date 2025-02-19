export type NewsletterMetadata = {
  subject: string;
  status: string;
  date: Date;
};

export type NewsletterContent = {
  body: string;
  to: string;
};
export type NewsletterType = NewsletterMetadata & NewsletterContent;
