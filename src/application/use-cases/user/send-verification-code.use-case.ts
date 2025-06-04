import VerificationCodeService from "@/application/services/auth/verification-code.service";
import { BaseUseCase } from "@/core/base.use-case";
import { IUserRepository } from "@/domain/repositories/user.repository";
import MailService from "@/infrastructure/external-services/mail/mail.service";
import { SendVerificationCodeSchemaType } from "@/interfaces/validators/schemas/user/send-verification-code.schema";
import AppException from "@/shared/utils/exception.util";

export class SendVerificationCodeUseCase extends BaseUseCase<
  SendVerificationCodeSchemaType,
  void
> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly verificationCodeService: typeof VerificationCodeService,
    private readonly mailService: typeof MailService
  ) {
    super();
  }

  async execute(input: SendVerificationCodeSchemaType): Promise<void> {
    try {
      const { email } = input;

      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new AppException("Invalid request", 400);
      }

      const { code: verificationCode, expiresAt: verificationExpires } =
        this.verificationCodeService.generateCode(6, 60); // 6 digits, 60 minutes expiration

      await this.userRepository.update(user.id, {
        email_verification_code: verificationCode,
        email_verification_expires: verificationExpires,
      });

      await this.mailService.sendVerificationEmail(email, verificationCode);
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Error sending verification code: ${(error as Error).message}`,
        500
      );
    }
  }
}
