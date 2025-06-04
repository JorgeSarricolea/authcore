import { z } from "zod";
import { passwordValidator } from "./base.user.schema";

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: passwordValidator,
});

export type LoginUserSchemaType = z.infer<typeof loginUserSchema>;
