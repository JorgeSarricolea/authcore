import AppException from "@/shared/utils/exception.util";
import jwt from "jsonwebtoken";
import { env } from "@/infrastructure/config/env.config";
import { Request } from "express";

interface JwtPayload {
  id: string;
  [key: string]: any;
}

interface Cookies {
  access_token?: string;
}

export default class JwtService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;

  constructor() {
    this.jwtSecret = env.vars.JWT_SECRET;
    this.jwtRefreshSecret = env.vars.JWT_REFRESH_SECRET;
  }

  generateAccessToken(payload: JwtPayload) {
    try {
      return jwt.sign(payload, this.jwtSecret, { expiresIn: "15m" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppException(
          `Error generating access token: ${error.message}`,
          500
        );
      }
      throw new AppException("Error generating access token", 500);
    }
  }

  generateRefreshToken(payload: JwtPayload) {
    try {
      return jwt.sign(payload, this.jwtRefreshSecret, {
        expiresIn: "7d",
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppException(
          `Error generating refresh token: ${error.message}`,
          500
        );
      }
      throw new AppException("Error generating refresh token", 500);
    }
  }

  verifyAccessToken(token: string): JwtPayload {
    try {
      if (!token) {
        throw new AppException("Unauthorized: Access token not found", 401);
      }
      return jwt.verify(token, this.jwtSecret) as JwtPayload;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppException(`Invalid access token: ${error.message}`, 401);
      }
      throw new AppException("Invalid access token", 401);
    }
  }

  verifyRefreshToken(token: string): JwtPayload {
    try {
      if (!token) {
        throw new AppException("Unauthorized: Refresh token not found", 401);
      }
      return jwt.verify(token, this.jwtRefreshSecret) as JwtPayload;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new AppException(`Invalid refresh token: ${error.message}`, 401);
      }
      throw new AppException("Invalid refresh token", 401);
    }
  }

  getUserIdFromToken(token: string): string {
    const decoded = this.verifyAccessToken(token);
    const userId = decoded.id;
    if (!userId) {
      throw new AppException("Invalid token: userId is missing", 401);
    }
    return userId;
  }

  extractAndValidateToken(cookies: Cookies): JwtPayload {
    const token = cookies?.access_token;
    if (!token) throw new AppException("Unauthorized: Token not found", 401);
    return this.verifyAccessToken(token);
  }

  extractTokenFromRequest(req: Request): string {
    let token = null;

    // First try to get token from cookies
    if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    // If not in cookies, try from authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      throw new AppException("Unauthorized: No token provided", 401);
    }

    return token;
  }
}
