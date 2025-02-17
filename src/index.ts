import { env } from "bun";
import app from "./server";
import { logger } from "./configs/logger";
import connectMongo from "./configs/mongo";

const server = app.listen(env.PORT, () => {
  logger.info(`Server listening on  http://localhost:${env.PORT}`);
  connectMongo();
});

function onCloseSignal() {
  logger.info("Server shutting down");
  server.close(() => {
    logger.info("Server shut down");
    process.exit(0);
  });

  setTimeout(() => {
    logger.error("Server shut down forcefully");
    process.exit(1);
  }, 5000);
}

process.on("SIGINT", onCloseSignal);
process.on("SIGTERM", onCloseSignal);
