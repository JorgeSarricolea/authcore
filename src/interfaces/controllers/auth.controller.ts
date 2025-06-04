import { RefreshTokenUseCase } from "@/application/use-cases/auth/refresh-token.use-case";
import { RequestResetPasswordUseCase } from "@/application/use-cases/auth/request-reset-password.use-case";
import { ResetPasswordUseCase } from "@/application/use-cases/auth/reset-password.use-case";
import { ValidateAccessUseCase } from "@/application/use-cases/auth/validate-access.use-case";
import { LoginUseCase } from "@/application/use-cases/user/login.use-case";
import { SendVerificationCodeUseCase } from "@/application/use-cases/user/send-verification-code.use-case";
import { SignUpUseCase } from "@/application/use-cases/user/signup.use-case";
import { VerifyEmailUseCase } from "@/application/use-cases/user/verify-email.use-case";
import { BaseController } from "@/core/base.controller";
import AuthFactory from "@/core/factories/auth.factory";
import CookieService from "@/infrastructure/external-services/auth/cookie.service";
import { UserDTO } from "@/interfaces/dtos/user.dto";
import AppException from "@/shared/utils/exception.util";
import { Request, Response } from "express";

export default class AuthController extends BaseController {
  private readonly signUpUseCase: SignUpUseCase;
  private readonly loginUseCase: LoginUseCase;
  private readonly sendVerificationCodeUseCase: SendVerificationCodeUseCase;
  private readonly verifyEmailUseCase: VerifyEmailUseCase;
  private readonly validateAccessUseCase: ValidateAccessUseCase;
  private readonly requestResetPasswordUseCase: RequestResetPasswordUseCase;
  private readonly resetPasswordUseCase: ResetPasswordUseCase;
  private readonly refreshTokenUseCase: RefreshTokenUseCase;

  constructor() {
    super();
    this.signUpUseCase = AuthFactory.createSignUpUseCase();
    this.loginUseCase = AuthFactory.createLoginUseCase();
    this.sendVerificationCodeUseCase =
      AuthFactory.createSendVerificationCodeUseCase();
    this.verifyEmailUseCase = AuthFactory.createVerifyEmailUseCase();
    this.validateAccessUseCase = AuthFactory.createValidateAccessUseCase();
    this.requestResetPasswordUseCase =
      AuthFactory.createRequestResetPasswordUseCase();
    this.resetPasswordUseCase = AuthFactory.createResetPasswordUseCase();
    this.refreshTokenUseCase = AuthFactory.createRefreshTokenUseCase();
  }

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.signUpUseCase.execute(req.body);
      const responseDto = new UserDTO(user);

      this.sendResponse(
        res,
        responseDto,
        "User registered successfully. Please check your email to verify your account.",
        201
      );
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { user, tokens } = await this.loginUseCase.execute({
        email,
        password,
      });

      // Set tokens in cookies
      CookieService.setAuthTokens(res, tokens);

      const responseDto = new UserDTO(user);

      this.sendResponse(res, responseDto, "User logged in successfully", 200);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      CookieService.clearAuthTokens(res);

      this.sendResponse(res, null, "User logged out successfully", 200);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async sendVerificationCode(req: Request, res: Response): Promise<void> {
    try {
      await this.sendVerificationCodeUseCase.execute(req.body);

      // Generic success message to avoid revealing if the email exists
      this.sendResponse(
        res,
        null,
        "If the email is registered, a verification code has been sent.",
        200
      );
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      await this.verifyEmailUseCase.execute(req.body);

      this.sendResponse(res, null, "Email verified successfully.", 200);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async validateAccess(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new Error("User ID not found in request");
      }

      await this.validateAccessUseCase.execute({ userId });

      this.sendResponse(
        res,
        { valid: true },
        "Access validated successfully",
        200
      );
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async requestResetPassword(req: Request, res: Response): Promise<void> {
    try {
      await this.requestResetPasswordUseCase.execute(req.body);

      this.sendResponse(
        res,
        null,
        "If the email is registered, a password reset code has been sent.",
        200
      );
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      await this.resetPasswordUseCase.execute(req.body);

      this.sendResponse(
        res,
        null,
        "Password has been reset successfully. You can now log in with your new password.",
        200
      );
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const refresh_token = req.cookies.refresh_token;

      if (!refresh_token) {
        throw new AppException("No refresh token provided", 401);
      }

      const tokens = await this.refreshTokenUseCase.execute({ refresh_token });

      // Set the new tokens in cookies
      CookieService.setAuthTokens(res, tokens);

      res.setHeader("Access-Control-Allow-Credentials", "true");
      this.sendResponse(res, null, "Token refreshed successfully", 200);
    } catch (error) {
      this.handleError(res, error);
    }
  }
}
