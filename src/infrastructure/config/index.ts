import { env } from "@/infrastructure/config/env.config";

export default {
  apiVersion: 1,
  corsConfig: {
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  },
};
