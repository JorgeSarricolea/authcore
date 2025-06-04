import { env } from "@/infrastructure/config/env.config";

export default {
  apiVersion: 1,
  corsConfig: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
  swaggerConfig: {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "AuthCore API",
        version: "1.0.0",
        description: "API documentation for AuthCore",
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
          description: "Development server",
        },
      ],
    },
    apis: ["./src/interfaces/routes/*.ts"],
  },
  swaggerMiddleware: {
    path: "/api-docs",
  },
};
