import { z } from "zod";

// Schema for contact form submissions
export const contactSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less")
    .trim(),
  email: z.string()
    .email("Invalid email format")
    .max(150, "Email must be 150 characters or less")
    .trim(),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be 5000 characters or less")
    .trim()
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Schema for admin authentication
export const authSchema = z.object({
  password: z.string()
    .min(1, "Password is required")
    .max(100, "Password is too long")
});

export type AuthFormData = z.infer<typeof authSchema>;

// Schema for ID parameters (UUID or generic ID, we'll use a generic string that matches UUID/number format but restrict length to prevent excessive parsing)
export const idSchema = z.object({
  id: z.string()
    .min(1, "ID is required")
    .max(64, "ID is too long")
    // If Supabase uses UUIDs, it's safer to just restrict length and let Supabase validate strictly,
    // or we can add a regex if we know it's a UUID. We'll use a basic alphanumeric + hyphens regex.
    .regex(/^[a-zA-Z0-9-]+$/, "Invalid ID format")
});

export type IdData = z.infer<typeof idSchema>;

// Schema for portfolio rating submissions
export const ratingSchema = z.object({
  score: z.number().int().min(1, "Score must be at least 1").max(5, "Score must be at most 5"),
});

export type RatingData = z.infer<typeof ratingSchema>;
