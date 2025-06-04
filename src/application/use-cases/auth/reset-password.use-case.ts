import { BaseUseCase } from "@/core/base.use-case";
import { IUserRepository } from "@/domain/repositories/user.repository";
import PasswordService from "@/infrastructure/external-services/encryption/password.service";
import { ResetPasswordSchemaType } from "@/interfaces/validators/schemas/user/reset-password.schema";
import AppException from "@/shared/utils/exception.util";

export class ResetPasswordUseCase extends BaseUseCase<
  ResetPasswordSchemaType,
  void
> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService
  ) {
    super();
  }

  async execute(input: ResetPasswordSchemaType): Promise<void> {
    try {
      const { email, reset_token, new_password } = input;

      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new AppException("Invalid or expired reset code", 400);
      }

      if (!user.reset_token || !user.reset_token_exp) {
        throw new AppException("Invalid or expired reset code", 400);
      }

      if (new Date() > user.reset_token_exp) {
        throw new AppException("Reset code has expired", 400);
      }

      if (user.reset_token !== reset_token) {
        throw new AppException("Invalid reset code", 400);
      }

      const hashedPassword = await this.passwordService.hash(new_password);

      await this.userRepository.update(user.id, {
        password: hashedPassword,
        reset_token: undefined,
        reset_token_exp: undefined,
      });
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Error resetting password: ${(error as Error).message}`,
        500
      );
    }
  }
}
