import { Request, Response } from "express";
import logger from "ntbs/utils/logger";
import { AppServices } from "ntbs/app-services";

export function getHealthController(services: AppServices) {
  return async (_req: Request, res: Response) => {
    logger.info("Health controller", { env: services.appConfig.environment });

    const errors: HealthError[] = [];
    try {
      await services.storages.knex?.raw(`SELECT 1;`);
    } catch (err) {
      logger.error("Database health error", { err });
      errors.push({ source: "db", error: err.message });
    }

    try {
      await services.youtubeClient.healthCheck();
    } catch (err) {
      logger.error("Youtube client health error", { err });
      errors.push({ source: "yt", error: err.message });
    }

    res.status(200).send({
      isOk: errors.length === 0,
      environment: services.appConfig.environment,
      errors,
    });
  };
}

interface HealthError {
  source: "db" | "yt" | "other";
  error: string;
}
