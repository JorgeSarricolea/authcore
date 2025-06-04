import { Response } from "express";
import ApiResponseUtil from "../shared/utils/api-response.util";

export abstract class BaseController {
  protected sendResponse<T>(
    res: Response,
    data: T | null,
    message?: string,
    status = 200
  ): void {
    ApiResponseUtil.success(res, data, message, status);
  }

  protected handleError(res: Response, error: unknown): void {
    ApiResponseUtil.error(res, error);
  }
}
