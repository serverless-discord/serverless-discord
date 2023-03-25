import pino from "pino";

export type LogLevels = "error" | "warn" | "info" | "debug";

export const initLogger = ({ logLevel = "info" }: { logLevel?: LogLevels }): pino.Logger => {
  const logger = pino({ level: logLevel });
  logger.debug("Initialized logger at level: %s", logLevel);
  return logger;
};