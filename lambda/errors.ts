export class SQSNotSetupError extends Error {
  constructor() {
    super("SQS is not setup. Please define the queueUrl parameter.");
  }
}