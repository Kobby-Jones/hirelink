import { z } from "zod";

const MAX_NAME = 80;
const MAX_PHONE = 20;
const MAX_URL = 200;

export const personalSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(MAX_NAME, "Too long"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .max(MAX_PHONE, "Too long")
    .regex(/^[0-9+()\-\s]+$/, "Use valid phone characters"),
});

export const experienceSchema = z.object({
  yearsExperience: z
    .number({ error: "Enter years of experience" })
    .min(0, "Must be 0 or more")
    .max(50, "Unrealistic value"),
  skillsText: z
    .string()
    .min(1, "Enter at least one skill")
    .max(250, "Too long")
    .refine(
      (v) => v.split(",").map((s) => s.trim()).filter(Boolean).length >= 1,
      "Enter at least one skill (comma-separated)"
    ),
  portfolioUrl: z
    .string()
    .max(MAX_URL, "Too long")
    .optional()
    .or(z.literal("")),
});

export const resumeSchema = z.object({
  resumeFile: z
    .custom<File>((f) => f instanceof File, "Resume file is required")
    .refine((f) => f.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
      (f) =>
        [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(f.type),
      "Only PDF, DOC, or DOCX allowed"
    ),
});

export const fullSchema = personalSchema
  .merge(experienceSchema)
  .merge(resumeSchema);

export type ApplicationFormValues = z.infer<typeof fullSchema>;
