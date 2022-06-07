import { NextFunction, Request, RequestHandler, Response } from "express";
import * as core from "express-serve-static-core";
import { ApiKeyAuthRequest } from "ntbs/middlewares/api-key-auth-middleware"; // fixme - dont import from outside of utils - circular imports danger

export function wrapError<T extends RequestHandler | ApiKeyAuthRequestHandler>(
  fn: T
) {
  return (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve()
      .then(() => fn(req as any, res, next))
      .catch(next);
}

export type ApiKeyAuthRequestHandler<
  P extends core.Params = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query
> = (
  req: ApiKeyAuthRequest<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next?: NextFunction
) => any;
