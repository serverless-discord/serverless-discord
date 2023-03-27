import { SQSNotSetupError } from "./errors";

describe("SQSNotSetupError", () => {
  it("should be able to create a SQSNotSetupError", () => {
    const error = new SQSNotSetupError();
    expect(error).toBeDefined();
    expect(error.message).toBe("SQS is not setup. Please define the queueUrl parameter.");
  });
});