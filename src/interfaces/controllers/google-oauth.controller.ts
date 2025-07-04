import { Request, Response } from "express";
import GoogleOAuthService from "@/infrastructure/external-services/auth/google-oauth.service";
import UserRepository from "@/infrastructure/orm/repositories/user.prisma.repository";
import RoleRepository from "@/infrastructure/orm/repositories/role.prisma.repository";
import JwtService from "@/infrastructure/external-services/auth/jwt.service";
import CookieService from "@/infrastructure/external-services/auth/cookie.service";
import AppException from "@/shared/utils/exception.util";
import { GoogleAuthUseCase } from "@/application/use-cases/auth/google-auth.use-case";
import MailService from "@/infrastructure/external-services/mail/mail.service";

export default class GoogleOAuthController {
  private googleOAuthService: GoogleOAuthService;
  private googleAuthUseCase: GoogleAuthUseCase;
  private jwtService: JwtService;

  constructor() {
    this.googleOAuthService = new GoogleOAuthService();
    const userRepository = new UserRepository();
    const roleRepository = new RoleRepository();
    this.googleAuthUseCase = new GoogleAuthUseCase(
      userRepository,
      MailService,
      roleRepository
    );
    this.jwtService = new JwtService();
  }

  async initiateGoogleAuth(req: Request, res: Response): Promise<void> {
    try {
      const authUrl = this.googleOAuthService.getAuthUrl();
      // Ensure we're redirecting to Google's consent screen
      if (!authUrl.includes("accounts.google.com")) {
        throw new AppException("Invalid Google OAuth URL", 500);
      }
      res.redirect(authUrl);
    } catch (error) {
      res.status(error instanceof AppException ? error.status : 400).json({
        success: false,
        message:
          error instanceof AppException
            ? error.message
            : "Failed to initiate Google authentication",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async handleGoogleCallback(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.query;

      if (!code || typeof code !== "string") {
        throw new AppException("Invalid authorization code", 400);
      }

      // Get tokens from Google
      const { access_token } = await this.googleOAuthService.getTokens(code);

      // Get user info from Google
      const googleUser = await this.googleOAuthService.getUserInfo(
        access_token
      );

      // Find or create user using our new use case
      const user = await this.googleAuthUseCase.execute(googleUser);

      // Generate JWT tokens
      const tokenPayload = {
        id: user.id,
        email: user.email,
        roleId: user.roles?.[0]?.id,
        emailVerified: user.email_verified,
      };

      const accessToken = this.jwtService.generateAccessToken(tokenPayload);
      const refreshToken = this.jwtService.generateRefreshToken(tokenPayload);

      // Set cookies using CookieService
      CookieService.setAuthTokens(res, { accessToken, refreshToken });

      // Return success response
      res.status(200).json({
        success: true,
        message: "Authentication successful",
        data: {
          user: {
            email: user.email,
          },
        },
      });
    } catch (error) {
      res.status(error instanceof AppException ? error.status : 400).json({
        success: false,
        message:
          error instanceof AppException
            ? error.message
            : "Authentication failed",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
