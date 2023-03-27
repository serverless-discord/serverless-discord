import { APIGatewayEvent, APIGatewayProxyResult, SQSEvent } from "aws-lambda";
import pino from "pino";
import { AuthHandler, createAuthHandler } from "../core/auth";
import { Command, CommandChatInputAsync } from "../core/command";
import { UnauthorizedError, CommandNotFoundError } from "../core/errors";
import { initLogger, LogLevels } from "../core/logging";
import { ServerlessDiscordRouter } from "../core/router";
import { DiscordApiClient, initApiClient } from "../discord/api";
import { instanceOfDiscordAuthenticationRequestHeaders } from "../discord/auth";
import { DiscordInteraction, DiscordInteractionApplicationCommand, DiscordInteractionResponse } from "../discord/interactions";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { SQSNotSetupError } from "./errors";

export function initLambdaRouter({ 
  commands, 
  applicationPublicKey,
  applicationId,
  logLevel = "info",
  botToken,
  queueUrl,
}: { 
  commands: Command[], 
  applicationPublicKey: string,
  applicationId: string,
  botToken: string,
  logLevel?: LogLevels,
  queueUrl?: string
}): ServerlessDiscordLambdaRouter {
  const logHandler = initLogger({ logLevel });
  logHandler.debug("Initializing Lambda router");
  const authHandler = createAuthHandler({ applicationPublicKey });
  const apiClient = initApiClient({ token: botToken });
  const sqsClient = new SQSClient({ region: process.env.AWS_REGION });
  return new ServerlessDiscordLambdaRouter({ commands, authHandler, logHandler, applicationId, apiClient, sqsClient, queueUrl });
}

export const BadRequestResponse: APIGatewayProxyResult = {
  statusCode: 400,
  body: "Bad Request",
};

export const UnauthorizedResponse: APIGatewayProxyResult = {
  statusCode: 401,
  body: "Unauthorized",
};

export const MethodNotAllowedResponse: APIGatewayProxyResult = {
  statusCode: 405,
  body: "Method Not Allowed",
};

export type AsyncLambdaCommandEvent = {
  commandName: string,
  commandArgs: string[],
}

/**
 * Serverless Discord Router for AWS Lambda
 * 
 * This class is responsible for handling the AWS Lambda event and converting it into a DiscordInteraction. This
 * is then passed to the ServerlessDiscordRouter to handle the interaction.
 * 
 * This class also handles async application commands. These are commands that are not expected to return a response
 * immediately. The async handler should be run as a seperate Lambda function. This function will be called with the
 * interaction data as the event.
 */
export class ServerlessDiscordLambdaRouter extends ServerlessDiscordRouter {
  protected sqsClient?: SQSClient;
  protected queueUrl?: string;

  constructor({
    commands,
    authHandler,
    logHandler,
    applicationId,
    apiClient,
    sqsClient,
    queueUrl
  }: {
    commands: Command[],
    authHandler: AuthHandler,
    logHandler: pino.Logger,
    applicationId: string,
    apiClient: DiscordApiClient,
    sqsClient?: SQSClient,
    queueUrl?: string,
  }) {
    super({ commands, authHandler, logHandler, applicationId, apiClient });
    this.sqsClient = sqsClient;
    this.queueUrl = queueUrl;
    this.logHandler = logHandler.child({ class: "ServerlessDiscordLambdaRouter" });
  }

  /**
   * Handler for AWS Lambda behind API Gateway that handles Discord bot interactions
   * 
   * @param event APIGatewayEvent from AWS Lambda
   * @returns APIGatewayProxyResult
   */
  async handleLambda(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
    this.logHandler.debug("Handling Lambda event", event);
    if (event.httpMethod !== "POST") {
      this.logHandler.info(`Method not allowed: ${event.httpMethod}`);
      return MethodNotAllowedResponse; 
    }
    const headers = event.headers;
    if (headers["content-type"] !== "application/json") {
      this.logHandler.info(`Bad request\nExpected: application/json\nGot: content-type: ${headers["content-type"]}`);
      return BadRequestResponse; 
    }
    if (event.body == null) {
      this.logHandler.info("Bad request, no body");
      return BadRequestResponse;
    }
    if (!instanceOfDiscordAuthenticationRequestHeaders(headers)) {
      this.logHandler.info("Unauthorized request, missing headers");
      return UnauthorizedResponse; 
    }
    const interaction = JSON.parse(event.body) as DiscordInteraction;
    try {
      const result = await super.handle({ interaction, requestHeaders: headers });
      const response = {
        statusCode: 200,
        body: JSON.stringify(result),
      };
      this.logHandler.debug("Returning response", response);
      return response;
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        this.logHandler.error("Unauthorized request", e);
        return UnauthorizedResponse;
      }
      this.logHandler.error("Error handling interaction", e);
      throw e;
    }
  }

  /**
   * Adds an interaction to an SQS queue to be processed by an async lambda function
   */
  private async addInteractionToQueue(interaction: DiscordInteractionApplicationCommand): Promise<void> {
    if (this.sqsClient == null || this.queueUrl == null) {
      const err = new SQSNotSetupError();
      this.logHandler.error(err);
      throw err;
    }
    // Invoke the async lambda function by adding to an SQS queue
    const sqsCommand = new SendMessageCommand({
      MessageBody: JSON.stringify(interaction),
      QueueUrl: this.queueUrl,
    });
    this.logHandler.debug("Adding interaction to queue", sqsCommand);
    const data = await this.sqsClient.send(sqsCommand);
    this.logHandler.debug("Added interaction to queue", data);
  }

  /**
   * Handler for AWS Lambda that handles Discord bot interactions 
   */
  async handleApplicationCommand(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
    this.logHandler.debug("Handling lambda application command", interaction);
    const command = super.getCommand(interaction.data.name);
    if (command instanceof CommandChatInputAsync) {
      await this.addInteractionToQueue(interaction);
    }
    return await command.handleInteraction(interaction);
  }

  /**
   * Handler for AWS Lambda that handles async application commands. This should be invoked asynchronously by handleDiscordWebhook as a
   * seperate Lambda function.
   * 
   * @param event Interaction from handleDiscordWebhook
   */
  async handleLambdaAsyncApplicationCommand(event: DiscordInteractionApplicationCommand) {
    this.logHandler.debug("Handling lambda async application command", event);
    const command = super.getCommand(event.data.name);
    if (!(command instanceof CommandChatInputAsync)) {
      const error = new CommandNotFoundError(event.data.name);
      this.logHandler.error("Command not found", error);
      throw error;
    }
    await command.handleInteractionAsyncWrapper({ apiClient: this.apiClient, interaction: event });
  }

  /**
   * Handles an SQS event that contains Discord interactions 
   */
  async handleSqsEvent(event: SQSEvent) {
    this.logHandler.debug("Handling SQS event", event);
    for (const record of event.Records) {
      const interaction = JSON.parse(record.body) as DiscordInteractionApplicationCommand;
      await this.handleLambdaAsyncApplicationCommand(interaction);
    }
  }
}