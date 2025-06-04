import VerificationCodeService from "@/application/services/auth/verification-code.service";
import { RefreshTokenUseCase } from "@/application/use-cases/auth/refresh-token.use-case";
import { RequestResetPasswordUseCase } from "@/application/use-cases/auth/request-reset-password.use-case";
import { ResetPasswordUseCase } from "@/application/use-cases/auth/reset-password.use-case";
import { ValidateAccessUseCase } from "@/application/use-cases/auth/validate-access.use-case";
import { LoginUseCase } from "@/application/use-cases/user/login.use-case";
import { SendVerificationCodeUseCase } from "@/application/use-cases/user/send-verification-code.use-case";
import { SignUpUseCase } from "@/application/use-cases/user/signup.use-case";
import { VerifyEmailUseCase } from "@/application/use-cases/user/verify-email.use-case";
import { IRoleRepository } from "@/domain/repositories/role.repository";
import { IUserRepository } from "@/domain/repositories/user.repository";
import JwtService from "@/infrastructure/external-services/auth/jwt.service";
import PasswordService from "@/infrastructure/external-services/encryption/password.service";
import MailService from "@/infrastructure/external-services/mail/mail.service";
import RoleRepository from "@/infrastructure/orm/repositories/role.prisma.repository";
import UserRepository from "@/infrastructure/orm/repositories/user.prisma.repository";

export default class AuthFactory {
  // Shared instances for singleton behavior
  private static userRepository: IUserRepository;
  private static roleRepository: IRoleRepository;
  private static jwtService: JwtService;
  private static passwordService: PasswordService;
  private static mailService: typeof MailService;
  private static verificationCodeService: typeof VerificationCodeService;

  // Repository methods
  private static createUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository();
    }
    return this.userRepository;
  }

  private static createRoleRepository(): IRoleRepository {
    if (!this.roleRepository) {
      this.roleRepository = new RoleRepository();
    }
    return this.roleRepository;
  }

  // Service methods
  private static createJwtService(): JwtService {
    if (!this.jwtService) {
      this.jwtService = new JwtService();
    }
    return this.jwtService;
  }

  private static createPasswordService(): PasswordService {
    if (!this.passwordService) {
      this.passwordService = new PasswordService();
    }
    return this.passwordService;
  }

  private static createMailService(): typeof MailService {
    if (!this.mailService) {
      this.mailService = MailService;
    }
    return this.mailService;
  }

  private static createVerificationCodeService(): typeof VerificationCodeService {
    if (!this.verificationCodeService) {
      this.verificationCodeService = VerificationCodeService;
    }
    return this.verificationCodeService;
  }

  // Use case factories
  public static createSignUpUseCase(): SignUpUseCase {
    return new SignUpUseCase(
      this.createUserRepository(),
      this.createVerificationCodeService(),
      this.createPasswordService(),
      this.createMailService(),
      this.createRoleRepository()
    );
  }

  public static createLoginUseCase(): LoginUseCase {
    return new LoginUseCase(
      this.createUserRepository(),
      this.createPasswordService(),
      this.createJwtService()
    );
  }

  public static createVerifyEmailUseCase(): VerifyEmailUseCase {
    return new VerifyEmailUseCase(
      this.createUserRepository(),
      this.createMailService()
    );
  }

  public static createSendVerificationCodeUseCase(): SendVerificationCodeUseCase {
    return new SendVerificationCodeUseCase(
      this.createUserRepository(),
      this.createVerificationCodeService(),
      this.createMailService()
    );
  }

  public static createValidateAccessUseCase(): ValidateAccessUseCase {
    return new ValidateAccessUseCase(this.createUserRepository());
  }

  public static createRequestResetPasswordUseCase(): RequestResetPasswordUseCase {
    return new RequestResetPasswordUseCase(
      this.createUserRepository(),
      this.createVerificationCodeService(),
      this.createMailService()
    );
  }

  public static createResetPasswordUseCase(): ResetPasswordUseCase {
    return new ResetPasswordUseCase(
      this.createUserRepository(),
      this.createPasswordService()
    );
  }

  public static createRefreshTokenUseCase(): RefreshTokenUseCase {
    return new RefreshTokenUseCase(
      this.createUserRepository(),
      this.createJwtService()
    );
  }
}
