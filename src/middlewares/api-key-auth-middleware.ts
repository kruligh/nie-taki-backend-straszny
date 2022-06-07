import { NextFunction, Request, Response } from "express";

import logger from "ntbs/utils/logger";
import * as core from "express-serve-static-core";

export function setupApiKeyAuthMiddleware({ apiKey }: { apiKey: string }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const requestApiKey = req.headers["api-key"];

    // todo: getting apiKey from database
    if (requestApiKey !== apiKey) {
      logger.warn("Invalid API key", { key: requestApiKey }); // is it safe?????????
      return res.status(401).send({ message: "Invalid API key" });
    }

    (req as ApiKeyAuthRequest).viewer = {
      // todo: connect apiKey with user and inject userId
      userId: "dumb-but-you-could-select-it-from-db",
    };
    return next();
  };
}

// todo: move to utils
export type ApiKeyAuthRequest<
  P extends core.Params = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  viewer: ApiKeyAuthViewer;
};

interface ApiKeyAuthViewer {
  userId: string;
}
