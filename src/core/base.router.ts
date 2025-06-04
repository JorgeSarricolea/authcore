import { asyncHandler } from "@/interfaces/middlewares/async-handler.middleware";
import { validateRequest } from "@/interfaces/middlewares/validate-request.middleware";
import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import { ZodSchema } from "zod";
import { BaseController } from "@/core/base.controller";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export abstract class BaseRouter<T extends BaseController> {
  protected router: Router;
  protected baseRoute: string;
  protected controller: T;

  constructor(baseRoute: string, controller: T) {
    this.router = Router();
    this.baseRoute = baseRoute;
    this.controller = controller;
    this.initializeRoutes();
  }

  protected abstract initializeRoutes(): void;

  protected get(
    path: string,
    handler: AsyncFunction,
    validationSchema?: ZodSchema,
    middlewares: RequestHandler[] = []
  ): void {
    this.registerRoute("get", path, handler, validationSchema, middlewares);
  }

  protected post(
    path: string,
    handler: AsyncFunction,
    validationSchema?: ZodSchema,
    middlewares: RequestHandler[] = []
  ): void {
    this.registerRoute("post", path, handler, validationSchema, middlewares);
  }

  protected put(
    path: string,
    handler: AsyncFunction,
    validationSchema?: ZodSchema,
    middlewares: RequestHandler[] = []
  ): void {
    this.registerRoute("put", path, handler, validationSchema, middlewares);
  }

  protected patch(
    path: string,
    handler: AsyncFunction,
    validationSchema?: ZodSchema,
    middlewares: RequestHandler[] = []
  ): void {
    this.registerRoute("patch", path, handler, validationSchema, middlewares);
  }

  protected delete(
    path: string,
    handler: AsyncFunction,
    validationSchema?: ZodSchema,
    middlewares: RequestHandler[] = []
  ): void {
    this.registerRoute("delete", path, handler, validationSchema, middlewares);
  }

  private registerRoute(
    method: "get" | "post" | "put" | "patch" | "delete",
    path: string,
    handler: AsyncFunction,
    validationSchema?: ZodSchema,
    middlewares: RequestHandler[] = []
  ): void {
    const fullPath = `${this.baseRoute}${path}`;
    const handlers: RequestHandler[] = [];

    // Add custom middlewares
    if (middlewares.length > 0) {
      handlers.push(...middlewares);
    }

    // Add validation middleware if schema is provided
    if (validationSchema) {
      handlers.push(validateRequest(validationSchema));
    }

    // Add async handler for controller method
    handlers.push(asyncHandler(handler.bind(this.controller)));

    this.router[method](fullPath, ...handlers);
  }

  public getRouter(): Router {
    return this.router;
  }
}
