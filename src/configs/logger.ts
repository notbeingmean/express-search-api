import type { NextFunction, Request, Response } from "express";
import pino from "pino";
import { pinoHttp } from "pino-http";

const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
});

async function log(req: Request, res: Response, next: NextFunction) {
  logger.info({
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
  });

  next();
}

export { logger, log };
