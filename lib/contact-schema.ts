import { z } from "zod";

export const CONTACT_ROLES = [
  "Real Estate Operations Assistant",
  "Executive Assistant",
  "Lead Generation Specialist",
  "Listing & Transaction Coordinator",
  "Property Management Assistant",
  "Marketing Coordinator",
  "Accounts & Bookkeeping Assistant",
  "Research & Data Analyst",
] as const;

export const contactSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(100, "Use 100 characters or fewer."),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address.")
      .max(254, "Use 254 characters or fewer."),
    company: z
      .string()
      .trim()
      .min(2, "Please enter your company or agency.")
      .max(160, "Use 160 characters or fewer."),
    phone: z
      .string()
      .trim()
      .max(40, "Use 40 characters or fewer.")
      .refine(
        (value) =>
          !value ||
          (/^\+?[\d\s().-]+$/.test(value) &&
            value.replace(/\D/g, "").length >= 6),
        "Please enter a valid phone number, or leave it blank.",
      )
      .optional(),
    role: z.enum(CONTACT_ROLES, {
      message: "Please select the role you need.",
    }),
    message: z
      .string()
      .trim()
      .min(10, "Tell us a little more, using at least 10 characters.")
      .max(4000, "Use 4,000 characters or fewer."),
    website: z.string().max(200).optional(),
  })
  .strict();

export type ContactValues = z.infer<typeof contactSchema>;
export type ContactRole = (typeof CONTACT_ROLES)[number];

export function formatEnquiry(values: ContactValues) {
  return [
    "REAL ESTATE STAFF — TEAM ENQUIRY",
    "",
    `Name: ${values.fullName}`,
    `Email: ${values.email}`,
    `Company / agency: ${values.company}`,
    `Phone: ${values.phone || "Not provided"}`,
    `Role needed: ${values.role}`,
    "",
    "Message:",
    values.message,
    "",
    "This is a local copy of your enquiry. Saving it does not send it to Real Estate Staff.",
  ].join("\n");
}
