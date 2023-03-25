import { initLogger } from "./logging";

describe("initLogger", () => {
  it("should return a pino logger", () => {
    const logger = initLogger({});
    expect(logger).toBeDefined();
  });

  it("should return a pino logger with the correct log level", () => {
    const logger = initLogger({ logLevel: "debug" });
    expect(logger.level).toEqual("debug");
  });

  it("should return a pino logger with the default log level", () => {
    const logger = initLogger({});
    expect(logger.level).toEqual("info");
  });
});