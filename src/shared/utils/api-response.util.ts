import { Response } from "express";
import AppException from "./exception.util";

export interface ApiError {
  status: number;
  message: string;
  description?: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiResponseData<T> {
  success: boolean;
  message: string;
  data: T | null;
  status: number;
  description?: string;
  code?: string;
  details?: Record<string, unknown>;
}

export default class ApiResponseUtil {
  /**
   * Sends a successful response
   * @param res - Express response object
   * @param data - Response data
   * @param message - Success message
   * @param status - HTTP status code
   */
  static success<T>(
    res: Response,
    data: T | null,
    message = "Success",
    status = 200
  ): void {
    const response: ApiResponseData<T> = {
      success: true,
      message,
      data,
      status,
    };
    res.status(status).json(response);
  }

  /**
   * Sends an error response
   * @param res - Express response object
   * @param error - Error object or AppException
   */
  static error(res: Response, error: unknown): void {
    const appError =
      error instanceof AppException
        ? error
        : new AppException(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
          error instanceof Error ? 500 : 500
        );

    const response: ApiResponseData<null> = {
      success: false,
      status: appError.status,
      message: appError.message,
      description: appError.description,
      details: appError.details,
      data: null,
    };
    res.status(appError.status).json(response);
  }
}
