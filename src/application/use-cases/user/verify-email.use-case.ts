import { BaseUseCase } from "@/core/base.use-case";
import { IUserRepository } from "@/domain/repositories/user.repository";
import MailService from "@/infrastructure/external-services/mail/mail.service";
import { VerifyEmailSchemaType } from "@/interfaces/validators/schemas/user/verify-email.schema";
import AppException from "@/shared/utils/exception.util";

export class VerifyEmailUseCase extends BaseUseCase<
  VerifyEmailSchemaType,
  void
> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailService: typeof MailService
  ) {
    super();
  }

  async execute(input: VerifyEmailSchemaType): Promise<void> {
    try {
      const { email, verification_code } = input;

      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new AppException("User not found", 404);
      }

      if (user.email_verified) {
        throw new AppException("Email already verified", 400);
      }

      if (!user.email_verification_code || !user.email_verification_expires) {
        throw new AppException("No verification code found", 400);
      }

      if (new Date() > user.email_verification_expires) {
        throw new AppException("Verification code has expired", 400);
      }

      if (user.email_verification_code !== verification_code) {
        throw new AppException("Invalid verification code", 400);
      }

      await this.userRepository.update(user.id, {
        email_verified: true,
        email_verification_code: undefined,
        email_verification_expires: undefined,
      });

      // Send confirmation email
      await this.mailService.sendEmailVerifiedConfirmation(email);
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Error verifying email: ${(error as Error).message}`,
        500
      );
    }
  }
}
