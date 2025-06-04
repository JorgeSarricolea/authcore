import VerificationCodeService from "@/application/services/auth/verification-code.service";
import { BaseUseCase } from "@/core/base.use-case";
import { IUserRepository } from "@/domain/repositories/user.repository";
import MailService from "@/infrastructure/external-services/mail/mail.service";
import { RequestResetPasswordSchemaType } from "@/interfaces/validators/schemas/user/request-reset-password.schema";
import AppException from "@/shared/utils/exception.util";

export class RequestResetPasswordUseCase extends BaseUseCase<
  RequestResetPasswordSchemaType,
  void
> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly verificationCodeService: typeof VerificationCodeService,
    private readonly mailService: typeof MailService
  ) {
    super();
  }

  async execute(input: RequestResetPasswordSchemaType): Promise<void> {
    try {
      const { email } = input;

      const user = await this.userRepository.findByEmail(email);

      // This is important for security to avoid email enumeration attacks
      if (!user) {
        return; // Early return with no error
      }

      const { code: resetCode, expiresAt: resetExpires } =
        this.verificationCodeService.generateCode(6, 60);

      await this.userRepository.update(user.id, {
        reset_token: resetCode,
        reset_token_exp: resetExpires,
      });

      await this.mailService.sendPasswordResetEmail(email, resetCode);
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Error processing password reset request: ${(error as Error).message}`,
        500
      );
    }
  }
}
