import { BaseUseCase } from "@/core/base.use-case";
import { User } from "@/domain/entities/user.entity";
import { IUserRepository } from "@/domain/repositories/user.repository";
import JwtService from "@/infrastructure/external-services/auth/jwt.service";
import PasswordService from "@/infrastructure/external-services/encryption/password.service";
import { LoginUserSchemaType } from "@/interfaces/validators/schemas/user/login.user.schema";
import AppException from "@/shared/utils/exception.util";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  user: User;
  tokens: AuthTokens;
}

export class LoginUseCase extends BaseUseCase<
  LoginUserSchemaType,
  LoginResult
> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {
    super();
  }

  async execute(input: LoginUserSchemaType): Promise<LoginResult> {
    try {
      const { email, password } = input;

      const user = await this.userRepository.findByEmail(email);

      if (!user) {
        throw new AppException("Invalid email or password", 401);
      }

      const isPasswordValid = await this.passwordService.compare(
        password,
        user.password ?? ""
      );

      if (!isPasswordValid) {
        throw new AppException("Invalid email or password", 401);
      }

      const tokenPayload = {
        id: user.id,
        email: user.email,
        roleId: user.roles?.[0]?.id,
        emailVerified: user.email_verified,
      };

      const accessToken = this.jwtService.generateAccessToken(tokenPayload);
      const refreshToken = this.jwtService.generateRefreshToken(tokenPayload);

      return {
        user,
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Error during login: ${(error as Error).message}`,
        500
      );
    }
  }
}
