import { z } from 'zod';

export const baseRoleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
});

export type BaseRoleSchema = z.infer<typeof baseRoleSchema>;
