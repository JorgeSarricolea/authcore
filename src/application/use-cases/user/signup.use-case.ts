import DefaultRoleService from "@/application/services/auth/default-role.service";
import UserValidationService from "@/application/services/auth/user-validation.service";
import VerificationCodeService from "@/application/services/auth/verification-code.service";
import { BaseUseCase } from "@/core/base.use-case";
import { User } from "@/domain/entities/user.entity";
import { IRoleRepository } from "@/domain/repositories/role.repository";
import { IUserRepository } from "@/domain/repositories/user.repository";
import PasswordService from "@/infrastructure/external-services/encryption/password.service";
import MailService from "@/infrastructure/external-services/mail/mail.service";
import { SignupUserSchemaType } from "@/interfaces/validators/schemas/user/signup.user.schema";
import AppException from "@/shared/utils/exception.util";

export class SignUpUseCase extends BaseUseCase<SignupUserSchemaType, User> {
  private readonly defaultRoleService: DefaultRoleService;
  private readonly userValidationService: UserValidationService;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly verificationCodeService: typeof VerificationCodeService,
    private readonly passwordService: PasswordService,
    private readonly mailService: typeof MailService,
    roleRepository: IRoleRepository
  ) {
    super();
    this.defaultRoleService = new DefaultRoleService(roleRepository);
    this.userValidationService = new UserValidationService(userRepository);
  }

  async execute(input: SignupUserSchemaType): Promise<User> {
    try {
      await this.userValidationService.validateEmailNotExists(input.email);

      const hashedPassword = await this.passwordService.hash(input.password);

      const { code: verificationCode, expiresAt: verificationExpires } =
        this.verificationCodeService.generateCode(6, 15);

      const defaultRole = await this.defaultRoleService.getDefaultRole();

      const user = new User({
        email: input.email,
        password: hashedPassword,
        name: input.first_name,
        last_name: input.last_name,
        email_verified: false,
        email_verification_code: verificationCode,
        email_verification_expires: verificationExpires,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const createdUser = await this.userRepository.create(user);

      // Assign the default role to the user
      await this.userRepository.assignRoles(createdUser.id, [defaultRole.id]);

      await this.mailService.sendVerificationEmail(
        createdUser.email,
        createdUser.email_verification_code!
      );

      return createdUser;
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Error during user signup: ${(error as Error).message}`,
        500
      );
    }
  }
}
