import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import * as core from "express-serve-static-core";

import logger from "ntbs/utils/logger";
import { AppConfig } from "ntbs/config";
import { errorsMiddleware } from "ntbs/middlewares/errors-middleware";
import { requestLoggingMiddleware } from "ntbs/middlewares/request-logging-middleware";
import { ApiKeyAuthRequestHandler, wrapError } from "ntbs/utils/express";
import { setupApiKeyAuthMiddleware } from "ntbs/middlewares/api-key-auth-middleware";
import { getHealthController } from "ntbs/controllers/health";
import { getSongsController } from "ntbs/controllers/songs/get-songs";
import { AppServices } from "ntbs/app-services";
import { createSongController } from "ntbs/controllers/songs/create-song";
import { getSongController } from "ntbs/controllers/songs/get-song";

export async function buildRouter(appServices: AppServices) {
  logger.debug("Building app router");

  const app = express();
  const methods = buildMethodHelpers(app, appServices.appConfig);

  // ---
  // common middlewares
  // ---
  app.use(express.json());
  app.use(helmet());
  app.use(
    cors({
      origin: [/http:\/\/localhost\:\d+/, /lol\.com$/],
      optionsSuccessStatus: 200,
    })
  );
  app.use(requestLoggingMiddleware(appServices.appConfig));

  // ---
  // routes
  // ---

  methods.publicGet("/health", getHealthController(appServices));
  methods.publicGet("/songs/:songId", getSongController(appServices));
  methods.publicGet("/songs", getSongsController(appServices));

  methods.authPost("/songs", createSongController(appServices));
  // ---
  // end middlewares
  // ---
  app.use(errorsMiddleware());
  return app;
}

function buildMethodHelpers(app: express.Express, appConfig: AppConfig) {
  const publicGet = (path: string, handler: RequestHandler) =>
    app.get(path, wrapError(handler));
  const publicPost = (path: string, handler: RequestHandler) =>
    app.post(path, wrapError(handler));

  const adminAuthMiddleware = setupApiKeyAuthMiddleware({
    apiKey: appConfig.adminApiKey,
  });

  const authGet = (path: string, handler: ApiKeyAuthRequestHandler) =>
    app.get(path, adminAuthMiddleware, wrapError(handler));

  const authPost = (path: string, handler: ApiKeyAuthRequestHandler) =>
    app.post(path, adminAuthMiddleware, wrapError(handler));

  return {
    publicGet,
    publicPost,
    authGet,
    authPost,
  };
}
export type RequestHandler<
  P extends core.Params = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query
> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next?: NextFunction
) => any;
