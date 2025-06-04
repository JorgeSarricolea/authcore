import { BaseUseCase } from "@/core/base.use-case";
import { User } from "@/domain/entities/user.entity";
import { IRoleRepository } from "@/domain/repositories/role.repository";
import { IUserRepository } from "@/domain/repositories/user.repository";
import DefaultRoleService from "@/application/services/auth/default-role.service";
import UserValidationService from "@/application/services/auth/user-validation.service";
import MailService from "@/infrastructure/external-services/mail/mail.service";
import { GoogleUserInfo } from "@/infrastructure/external-services/auth/google-oauth.service";
import AppException from "@/shared/utils/exception.util";

export class GoogleAuthUseCase extends BaseUseCase<GoogleUserInfo, User> {
  private readonly defaultRoleService: DefaultRoleService;
  private readonly userValidationService: UserValidationService;

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailService: typeof MailService,
    roleRepository: IRoleRepository
  ) {
    super();
    this.defaultRoleService = new DefaultRoleService(roleRepository);
    this.userValidationService = new UserValidationService(userRepository);
  }

  async execute(googleUser: GoogleUserInfo): Promise<User> {
    try {
      if (!googleUser.id || !googleUser.email) {
        throw new AppException("Invalid Google user information", 400);
      }

      // Check if user exists with this Google ID
      const existingUser = await this.userRepository.findByGoogleId(
        googleUser.id
      );

      if (existingUser) {
        return existingUser;
      }

      // Check if user exists with this email
      const userWithEmail = await this.userRepository.findByEmail(
        googleUser.email
      );

      if (userWithEmail) {
        // If user exists but doesn't have Google ID, update it
        if (!userWithEmail.google_id) {
          userWithEmail.google_id = googleUser.id;
          const updatedUser = await this.userRepository.update(
            userWithEmail.id,
            {
              google_id: googleUser.id,
            }
          );

          // Send welcome email for first-time Google users
          await this.mailService.sendEmailVerifiedConfirmation(
            updatedUser.email
          );

          return updatedUser;
        }
        return userWithEmail;
      }

      // Create new user
      const defaultRole = await this.defaultRoleService.getDefaultRole();

      const user = new User({
        email: googleUser.email,
        name: googleUser.given_name,
        last_name: googleUser.family_name,
        google_id: googleUser.id,
        email_verified: googleUser.verified_email,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const createdUser = await this.userRepository.create(user);

      // Assign the default role to the user
      await this.userRepository.assignRoles(createdUser.id, [defaultRole.id]);

      // Send welcome email for first-time Google users
      await this.mailService.sendEmailVerifiedConfirmation(createdUser.email);

      return createdUser;
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Error during Google authentication: ${(error as Error).message}`,
        500
      );
    }
  }
}
