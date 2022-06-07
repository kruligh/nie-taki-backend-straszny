import { NextFunction, Request, Response } from "express";
import useragent from "useragent";

import logger from "ntbs/utils/logger";
import { AppConfig, Environment } from "ntbs/config";

export function requestLoggingMiddleware(appConfig: AppConfig) {
  return (req: Request, res: Response, next: NextFunction) => {
    logger.info(`REQUEST [${req.method}] ${req.originalUrl}`, {
      ...getRequestLogDetails(req, appConfig.environment),
    });

    res.on("finish", () => {
      logger.info(
        `RESPONSE [${req.method}] ${req.originalUrl} ${res.statusCode}`, // explain statusCode
        {
          ...getRequestLogDetails(req, appConfig.environment),
        }
      );
    });
    next();
  };
}

function getRequestLogDetails(req: Request, environment: Environment) {
  let logDetails = {};
  if (environment !== Environment.local) {
    const agent = useragent.parse(req.headers["user-agent"]);
    logDetails = { agent: agent.toString() };
  }
  return logDetails;
}
