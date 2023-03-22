import { initLogger } from "./logging";

describe("initLogger", () => {
  it("should return a pino logger", () => {
    const logger = initLogger({});
    expect(logger).toBeDefined();
  });
});