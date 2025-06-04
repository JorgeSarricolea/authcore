import AppException from '@/shared/utils/exception.util';
import { NextFunction, Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roleId: string;
    email_verified: boolean;
  };
}

export const verifyEmailMiddleware = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    throw new AppException('User not authenticated', 401);
  }

  if (!req.user.email_verified) {
    throw new AppException('Email not verified', 403);
  }

  next();
};
