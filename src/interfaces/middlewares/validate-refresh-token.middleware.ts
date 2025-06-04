import AppException from "@/shared/utils/exception.util";
import { NextFunction, Request, Response } from "express";

export const validateRefreshToken = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const refresh_token = req.cookies.refresh_token;

  if (!refresh_token) {
    throw new AppException("No refresh token provided", 401);
  }

  if (refresh_token.length < 10) {
    throw new AppException("Invalid refresh token format", 401);
  }

  next();
};
