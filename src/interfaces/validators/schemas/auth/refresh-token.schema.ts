import { z } from 'zod';

// Empty schema since token will come from Authorization header
export const refreshTokenSchema = z.object({});

export type RefreshTokenSchemaType = z.infer<typeof refreshTokenSchema>;
