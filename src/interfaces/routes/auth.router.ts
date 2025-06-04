import { RateLimitLevel } from "@/application/services/rate-limiter/rate-limiter.service";
import { BaseRouter } from "@/core/base.router";
import AuthController from "@/interfaces/controllers/auth.controller";
import { authMiddleware } from "@/interfaces/middlewares/auth.middleware";
import { rateLimiter } from "@/interfaces/middlewares/rate-limiter.middleware";
import { validateRefreshToken } from "@/interfaces/middlewares/validate-refresh-token.middleware";
import { loginUserSchema } from "@/interfaces/validators/schemas/user/login.user.schema";
import { requestResetPasswordSchema } from "@/interfaces/validators/schemas/user/request-reset-password.schema";
import { resetPasswordSchema } from "@/interfaces/validators/schemas/user/reset-password.schema";
import { sendVerificationCodeSchema } from "@/interfaces/validators/schemas/user/send-verification-code.schema";
import { signupUserSchema } from "@/interfaces/validators/schemas/user/signup.user.schema";
import { verifyEmailSchema } from "@/interfaces/validators/schemas/user/verify-email.schema";

class AuthRouter extends BaseRouter<AuthController> {
  constructor() {
    super("/auth", new AuthController());
  }

  protected initializeRoutes(): void {
    this.post("/signup", this.controller.signUp, signupUserSchema, [
      rateLimiter(RateLimitLevel.HIGH),
    ]);

    this.post("/login", this.controller.login, loginUserSchema, [
      rateLimiter(RateLimitLevel.MEDIUM),
    ]);

    this.post("/logout", this.controller.logout);

    this.post(
      "/send-verification-code",
      this.controller.sendVerificationCode,
      sendVerificationCodeSchema,
      [rateLimiter(RateLimitLevel.STRICT)]
    );

    this.post("/verify-email", this.controller.verifyEmail, verifyEmailSchema, [
      rateLimiter(RateLimitLevel.STRICT),
    ]);

    this.post(
      "/request-reset-password",
      this.controller.requestResetPassword,
      requestResetPasswordSchema,
      [rateLimiter(RateLimitLevel.STRICT)]
    );

    this.post(
      "/reset-password",
      this.controller.resetPassword,
      resetPasswordSchema,
      [rateLimiter(RateLimitLevel.STRICT)]
    );

    this.post("/refresh-token", this.controller.refreshToken, undefined, [
      validateRefreshToken,
      rateLimiter(RateLimitLevel.MEDIUM),
    ]);

    this.get("/validate-access", this.controller.validateAccess, undefined, [
      authMiddleware,
      rateLimiter(RateLimitLevel.LOW),
    ]);
  }
}

export default new AuthRouter().getRouter();
