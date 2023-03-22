import pino from "pino";

export type LogLevels = "error" | "warn" | "info" | "debug";

export const initLogger = ({ logLevel = "info" }: { logLevel?: LogLevels }) => {
  return pino({ level: logLevel });
};