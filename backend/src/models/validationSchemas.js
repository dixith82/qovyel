// Prisma owns the database models (see prisma/schema.prisma); these are
// the *input* validation schemas for what the API accepts, which is a
// separate and intentionally stricter concern (e.g. message length limits
// that have no bearing on the DB column type).
import { z } from "zod";

// These mirror the exact option lists in the frontend Contact form
// (src/data/services.js, and the projectType/budget select options in
// Contact.jsx) so "invalid service / budget / project type" is rejected
// consistently on both ends. All three fields remain optional — only a
// *non-empty* value is checked against the known set.
const SERVICE_OPTIONS = ["Web Development", "App Development", "AI Solutions", "Data & Dashboards", "UI/UX Design"];
const BUDGET_OPTIONS = ["< $2k", "$2k – $5k", "$5k – $15k", "$15k+", "Not sure yet"];
const PROJECT_TYPE_OPTIONS = ["Website", "Web Application", "Mobile App", "AI Solution", "Dashboard", "Other"];

// Permissive on purpose (international numbers, spacing, punctuation) —
// rejects obviously-not-a-phone-number input (letters, too short/long)
// without being strict about a single regional format.
const PHONE_PATTERN = /^[+()\d][\d\s().-]{6,24}$/;

export const contactInquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.string().trim().toLowerCase().email("Please provide a valid email address."),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Please provide a valid phone number.")
    .max(40)
    .optional()
    .or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  // z.enum(...).optional().or(z.literal("")) reports Zod's generic union
  // error ("Invalid input") instead of the enum's own message when a
  // non-empty, non-matching value is sent — so a plain string + refine
  // is used instead to keep the specific, user-facing message.
  service: z
    .string()
    .trim()
    .refine((v) => v === "" || SERVICE_OPTIONS.includes(v), "Please select a valid service.")
    .optional()
    .or(z.literal("")),
  budget: z
    .string()
    .trim()
    .refine((v) => v === "" || BUDGET_OPTIONS.includes(v), "Please select a valid budget.")
    .optional()
    .or(z.literal("")),
  projectType: z
    .string()
    .trim()
    .refine((v) => v === "" || PROJECT_TYPE_OPTIONS.includes(v), "Please select a valid project type.")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Please include a few more details (10+ characters).")
    .max(4000, "Message is too long (4000 character limit)."),
});

export const newsletterSubscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please provide a valid email address."),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please provide a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "CLOSED"]),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  url: z.string().trim().url("Please provide a valid URL."),
  order: z.number().int().optional(),
  featured: z.boolean().optional(),
});

export const projectUpdateSchema = projectSchema.partial();

export const testimonialSchema = z.object({
  name: z.string().trim().min(1).max(160),
  role: z.string().trim().min(1).max(160),
  company: z.string().trim().min(1).max(160),
  testimonial: z.string().trim().min(1).max(2000),
  isDemo: z.boolean().optional(),
  order: z.number().int().optional(),
});

export const testimonialUpdateSchema = testimonialSchema.partial();
