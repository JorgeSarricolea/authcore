import { z } from 'zod';

export const sendVerificationCodeSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export type SendVerificationCodeSchemaType = z.infer<
  typeof sendVerificationCodeSchema
>;
