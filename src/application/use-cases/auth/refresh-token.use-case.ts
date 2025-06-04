import { AuthTokens } from "@/application/use-cases/user/login.use-case";
import { BaseUseCase } from "@/core/base.use-case";
import { IUserRepository } from "@/domain/repositories/user.repository";
import JwtService from "@/infrastructure/external-services/auth/jwt.service";
import AppException from "@/shared/utils/exception.util";

interface RefreshTokenInput {
  refresh_token: string;
}

export class RefreshTokenUseCase extends BaseUseCase<
  RefreshTokenInput,
  AuthTokens
> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService
  ) {
    super();
  }

  async execute(input: RefreshTokenInput): Promise<AuthTokens> {
    try {
      const { refresh_token } = input;

      const decodedToken = this.jwtService.verifyRefreshToken(refresh_token);

      const userId = decodedToken.id;
      const email = decodedToken.email;

      if (!userId || !email) {
        throw new AppException("Invalid refresh token: missing user data", 401);
      }

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new AppException("User not found", 404);
      }

      const tokenPayload = {
        id: userId,
        email,
        roleId: user.roles?.[0]?.id,
        emailVerified: user.email_verified,
      };

      const accessToken = this.jwtService.generateAccessToken(tokenPayload);
      const refreshToken = this.jwtService.generateRefreshToken(tokenPayload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof AppException) {
        throw error;
      }
      throw new AppException(
        `Error refreshing token: ${(error as Error).message}`,
        401
      );
    }
  }
}
