import { z } from 'zod';

export const requestResetPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export type RequestResetPasswordSchemaType = z.infer<
  typeof requestResetPasswordSchema
>;
