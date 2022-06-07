import { NextFunction, Request, Response } from "express";

import logger from "ntbs/utils/logger";

export function cognitoAuthMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    throw new Error("Not implemented");
    try {
      // const {userId} = cognitoClient.validate(req.headers.authorization || "");
      // const userRoles = await dbClient.getUserRoles({ userId });
      // const viewer = toViewer(userId, userRoles);
      // (req as AuthRequest).viewer = viewer;
      // logger.debug("Viewer dev log", { viewer });
    } catch (err) {
      logger.error("Invalid or missing authorization header", {
        request: { method: req.method, url: req.originalUrl },
        err,
      });

      return res.sendStatus(401);
    }

    return next();
  };
}
