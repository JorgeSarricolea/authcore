import { z } from 'zod';

export const verifyEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
  verification_code: z
    .string()
    .min(6, 'Verification code must be at least 6 characters'),
});

export type VerifyEmailSchemaType = z.infer<typeof verifyEmailSchema>;
