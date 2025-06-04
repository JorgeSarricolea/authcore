import { z } from "zod";

export class EnvSchema {
  private static readonly schema = z.object({
    // App
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .default("8000"),
    COMPOSE_PROJECT_NAME: z.string().default("authcore_server"),
    APP_NAME: z.string().default("AuthCore"),
    ALLOWED_ORIGINS: z
      .string()
      .transform((val) => val.split(",").map((s) => s.trim()))
      .default("http://localhost:3000"),

    // Mail
    SMTP_HOST: z.string().default("smtp.gmail.com"),
    SMTP_PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .default("587"),
    SMTP_SECURE: z
      .string()
      .transform((val) => val === "true")
      .default("false"),
    SMTP_SERVICE: z.string().default("gmail"),
    SMTP_USER: z.string(),
    SMTP_PASSWORD: z.string(),
    SECRET_CODE: z.string(),

    // Databases
    MYSQL_USER: z.string(),
    MYSQL_PASSWORD: z.string(),
    MYSQL_ROOT_PASS: z.string(),
    MYSQL_DB: z.string(),
    MYSQL_PORT: z
      .string()
      .transform((val) => parseInt(val, 10))
      .default("3306"),
    DATABASE_URL: z.string(),

    // JWT
    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
  });

  private static readonly developmentSchema = this.schema.extend({
    BASE_URL: z.string().url().default("http://localhost:8000"),
    API_URL: z.string().url().default("http://localhost:8000/api"),
  });

  private static readonly productionSchema = this.schema.extend({
    BASE_URL: z.string().url(),
    API_URL: z.string().url(),
  });

  static validate(env: NodeJS.ProcessEnv): EnvVars {
    const nodeEnv = env.NODE_ENV || "development";

    if (nodeEnv === "production") {
      return this.productionSchema.parse(env);
    }

    return this.developmentSchema.parse(env);
  }

  static isDevelopment(env: EnvVars): boolean {
    return env.NODE_ENV === "development";
  }

  static isProduction(env: EnvVars): boolean {
    return env.NODE_ENV === "production";
  }
}

export type EnvVars = z.infer<(typeof EnvSchema)["schema"]>;
