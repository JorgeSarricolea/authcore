import { EnvSchema, EnvVars } from "@/interfaces/validators/schemas/env.schema";

export default class EnvConfig {
  private readonly config: EnvVars;

  constructor(rawEnv: NodeJS.ProcessEnv) {
    this.config = EnvSchema.validate(rawEnv);
  }

  get vars(): EnvVars {
    return this.config;
  }

  get isDevelopment(): boolean {
    return EnvSchema.isDevelopment(this.config);
  }

  get isProduction(): boolean {
    return EnvSchema.isProduction(this.config);
  }

  get port(): number {
    return this.config.PORT;
  }

  get appName(): string {
    return this.config.APP_NAME;
  }

  get apiUrl(): string {
    return `http://localhost:${this.port}`;
  }

  get allowedOrigins(): string[] {
    return this.config.ALLOWED_ORIGINS;
  }

  get secretCode(): string {
    return this.config.SECRET_CODE;
  }

  get smtpService(): string {
    return this.config.SMTP_SERVICE;
  }

  get smtpUser(): string {
    return this.config.SMTP_USER;
  }

  get smtpPassword(): string {
    return this.config.SMTP_PASSWORD;
  }

  getDefaultApiUrl(): string {
    return `http://localhost:${this.port}/api/v1/`;
  }
}

export const env = new EnvConfig(process.env);
