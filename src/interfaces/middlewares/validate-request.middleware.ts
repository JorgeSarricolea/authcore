import AppException from "@/shared/utils/exception.util";
import { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodSchema } from "zod";

type ValidationType = "body" | "query" | "params" | "all";

export const validateRequest = <T extends ZodSchema>(
  schema: T,
  validationType: ValidationType = "body"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationMap: Record<ValidationType, () => Promise<z.infer<T>>> = {
        body: () => schema.parseAsync(req.body),
        query: () => schema.parseAsync(req.query),
        params: () => schema.parseAsync(req.params),
        all: () =>
          schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
          }),
      };

      await validationMap[validationType]();
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.reduce((acc, err) => {
          acc[err.path.join(".")] = err.message;
          return acc;
        }, {} as Record<string, unknown>);

        throw new AppException("Validation error", 400, details);
      }
      throw new AppException("An unexpected validation error occurred", 400);
    }
  };
};
