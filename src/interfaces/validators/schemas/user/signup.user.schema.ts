import { baseUserSchema } from '@/interfaces/validators/schemas/user/base.user.schema';
import { z } from 'zod';

export const signupUserSchema = baseUserSchema.pick({
  first_name: true,
  last_name: true,
  email: true,
  password: true,
  birth_date: true,
});

export type SignupUserSchemaType = z.infer<typeof signupUserSchema>;
