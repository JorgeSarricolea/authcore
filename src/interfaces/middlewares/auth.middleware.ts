import JwtService from "@/infrastructure/external-services/auth/jwt.service";
import AppException from "@/shared/utils/exception.util";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Skip authentication for refresh token endpoint
    if (req.path.includes("/auth/refresh-token")) {
      return next();
    }

    const jwtService = new JwtService();
    const token = jwtService.extractTokenFromRequest(req);
    const decoded = jwtService.verifyAccessToken(token);

    req.user = {
      id: decoded.id as string,
      email: decoded.email as string,
      roleId: decoded.roleId as string,
      email_verified: decoded.emailVerified as boolean,
    };

    next();
  } catch (error) {
    if (error instanceof AppException) {
      next(error);
    } else {
      next(new AppException("Authentication failed", 401));
    }
  }
};
