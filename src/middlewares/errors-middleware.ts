import { NextFunction, Request, Response } from "express";
import { HttpErrorResponse, RequestValidationError } from "ntbs/utils/errors";
import logger from "ntbs/utils/logger";

export function errorsMiddleware() {
  return async (err: any, req: Request, res: Response, _next: NextFunction) => {
    const requestLog = {
      method: req.method,
      url: req.originalUrl,
    };

    if (err instanceof HttpErrorResponse) {
      logger.debug("HttpErrorResponse", err, requestLog);
      res.status(err.statusCode).send(err.body);
      return;
    }

    if (err instanceof RequestValidationError) {
      logger.debug("RequestValidationError", err, requestLog);
      res
        .status(400)
        .send({ message: err.message, errors: err.validationErrors });
      return;
    }

    logger.error("Unhandled error", { requestLog });
    const status = Number(err.statusCode) || Number(err.status) || 500;
    res.sendStatus(status); // explain why only status, without error message
    return;
  };
}
