import { z } from "zod";

// Reusable password validator
export const passwordValidator = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

export const baseUserSchema = z.object({
  id: z.string().uuid().optional(),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .optional(),
  email: z.string().email("Invalid email format"),
  password: passwordValidator,
  birth_date: z
    .union([z.date(), z.string().transform((str) => new Date(str))])
    .optional(),
  email_verified: z.boolean().optional(),
  verification_code: z.string().optional(),
  verification_expires: z.date().optional(),
  reset_password_code: z.string().optional(),
  reset_password_expires: z.date().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
  role_id: z.string().uuid().optional(),
});
