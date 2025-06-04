import { BaseRouter } from '@/core/base.router';
import { BaseController } from '@/core/base.controller';
import { authMiddleware } from '@/interfaces/middlewares/auth.middleware';
import { verifyEmailMiddleware } from '@/interfaces/middlewares/verify-email.middleware';
import { Request, Response } from 'express';
import AppException from '@/shared/utils/exception.util';
import JwtService from '@/infrastructure/external-services/auth/jwt.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roleId: string;
    email_verified: boolean;
  };
}

class TestController extends BaseController {
  private readonly jwtService: JwtService;

  constructor() {
    super();
    this.jwtService = new JwtService();
  }

  async getProtectedData(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new AppException('User not authenticated', 401);
      }

      // Verify token is still valid
      const token = this.jwtService.extractTokenFromRequest(req);
      const _decoded = this.jwtService.verifyAccessToken(token);

      this.sendResponse(
        res,
        {
          user: {
            id: req.user.id,
            email: req.user.email,
            emailVerified: req.user.email_verified,
          },
          timestamp: new Date().toISOString(),
        },
        'Access granted to protected route',
      );
    } catch (error) {
      if (error instanceof AppException) {
        this.handleError(res, error);
      } else {
        this.handleError(res, new AppException('Authentication failed', 401));
      }
    }
  }
}

class TestRouter extends BaseRouter<TestController> {
  constructor() {
    super('/test', new TestController());
  }

  protected initializeRoutes(): void {
    // Route that requires authentication and email verification
    this.get('/protected', this.controller.getProtectedData, undefined, [
      authMiddleware,
      verifyEmailMiddleware,
    ]);
  }
}

export default new TestRouter().getRouter();
