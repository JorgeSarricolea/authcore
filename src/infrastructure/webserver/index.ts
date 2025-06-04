import { env } from "@/infrastructure/config/env.config";
import logger from "@/infrastructure/logger";
import app from "@/infrastructure/webserver/express/server";
import "dotenv/config";

app.listen(env.port, () => {
  logger.info(`🚀 Server deployed on ${env.apiUrl}`);
});
