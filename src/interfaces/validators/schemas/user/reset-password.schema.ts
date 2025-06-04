import { passwordValidator } from "@/interfaces/validators/schemas/user/base.user.schema";
import { z } from "zod";

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  reset_token: z.string().min(6, "Invalid reset code"),
  new_password: passwordValidator,
});

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
