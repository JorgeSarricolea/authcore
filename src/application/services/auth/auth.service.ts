import { User } from '@/domain/entities/user.entity';
import JwtService from '@/infrastructure/external-services/auth/jwt.service';
import {
  LoginUseCase,
  AuthTokens,
} from '@/application/use-cases/user/login.use-case';
import UserRepository from '@/infrastructure/orm/repositories/user.prisma.repository';
import PasswordService from '@/infrastructure/external-services/encryption/password.service';

export default class AuthService {
  private loginUseCase: LoginUseCase;

  constructor() {
    const userRepository = new UserRepository();
    const jwtService = new JwtService();
    const passwordService = new PasswordService();
    this.loginUseCase = new LoginUseCase(
      userRepository,
      passwordService,
      jwtService,
    );
  }

  async generateTokens(user: User): Promise<AuthTokens> {
    const tokenPayload = {
      id: user.id,
      email: user.email,
      roleId: user.roles?.[0]?.id,
      emailVerified: user.email_verified,
    };

    const jwtService = new JwtService();
    const accessToken = jwtService.generateAccessToken(tokenPayload);
    const refreshToken = jwtService.generateRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken,
    };
  }
}
