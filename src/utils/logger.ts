import winston, {
  createLogger,
  transports,
  format,
  Logger,
  config,
  LeveledLogMethod,
} from "winston";
import { Format } from "logform";

const env = process.env.ENVIRONMENT || "local";
const level = process.env.LOG_LEVEL || "info";

export function createDefaultLogger(): Logger & { slack: LeveledLogMethod } {
  const lg = createLogger({
    level,
    levels: { ...config.npm.levels, slack: 0 },
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          createEnvFormat(env),
          ...(env === "local"
            ? [format.align(), format.colorize(), format.simple()]
            : [format.json()])
        ),
      }),
    ],
  }) as Logger & { slack: LeveledLogMethod };
  winston.addColors({ ...config.npm.colors, slack: "cyan" });
  return lg;
}

const logger = createDefaultLogger();
export default logger;

function createEnvFormat(environment: string): Format {
  return {
    transform: logObj => {
      logObj.environment = environment;
      return logObj;
    },
  };
}
