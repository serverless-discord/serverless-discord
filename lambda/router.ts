import { InvokeCommand, LambdaClient } from "@aws-sdk/client-lambda";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import pino from "pino";
import { AuthHandler, createAuthHandler } from "../core/auth";
import { Command, CommandChatInputAsync } from "../core/command";
import { UnauthorizedError, CommandNotFoundError } from "../core/errors";
import { initLogger, LogLevels } from "../core/logging";
import { ServerlessDiscordRouter } from "../core/router";
import { instanceOfDiscordAuthenticationRequestHeaders } from "../discord/auth";
import { DiscordInteraction, DiscordInteractionApplicationCommand, DiscordInteractionResponse } from "../discord/interactions";

export function initLambdaRouter({ 
  commands, 
  applicationPublicKey,
  logLevel = "info"
}: { 
  commands: Command[], 
  applicationPublicKey: string,
  logLevel?: LogLevels
}): ServerlessDiscordLambdaRouter {
    const authHandler = createAuthHandler({ applicationPublicKey });
    const awsClient = new LambdaClient({});
    const logHandler = initLogger({ logLevel });
    return new ServerlessDiscordLambdaRouter({ commands, authHandler, awsClient, logHandler });
}

export const BadRequestResponse: APIGatewayProxyResult = {
  statusCode: 400,
  body: "Bad Request",
}

export const UnauthorizedResponse: APIGatewayProxyResult = {
  statusCode: 401,
  body: "Unauthorized",
}

export const MethodNotAllowedResponse: APIGatewayProxyResult = {
  statusCode: 405,
  body: "Method Not Allowed",
}

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
  protected asyncLambdaArn: string | undefined;
  protected awsClient: LambdaClient;

  constructor({
    commands,
    authHandler,
    logHandler,
    asyncLambdaArn,
    awsClient,
  }: {
    commands: Command[],
    authHandler: AuthHandler,
    logHandler: pino.Logger,
    asyncLambdaArn?: string,
    awsClient: LambdaClient,
  }) {
    super({ commands, authHandler, logHandler });
    this.asyncLambdaArn = asyncLambdaArn;
    this.awsClient = awsClient;
  }

  /**
   * Handler for AWS Lambda behind API Gateway that handles Discord bot interactions
   * 
   * @param event APIGatewayEvent from AWS Lambda
   * @returns APIGatewayProxyResult
   */
  async handleLambda(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
      if (event.httpMethod !== "POST") {
          return MethodNotAllowedResponse; 
      }
      const headers = event.headers;
      if (headers["content-type"] !== "application/json" || event.body == null) {
          return BadRequestResponse; 
      }
      if (!instanceOfDiscordAuthenticationRequestHeaders(headers)) {
          return UnauthorizedResponse; 
      }
      const interaction = JSON.parse(event.body) as DiscordInteraction;
      try {
        const result = await super.handle({ interaction, requestHeaders: headers });
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        }
      } catch (e) {
        if (e instanceof UnauthorizedError) {
          return UnauthorizedResponse;
        }
        throw e;
      }
  }

  async handleApplicationCommand(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
    const command = super.getCommand(interaction.data.name)
    if (this.asyncLambdaArn != "" && command instanceof CommandChatInputAsync) {
      // Invoke the async lambda function
      const payload = Uint8Array.from(JSON.stringify(interaction), c => c.charCodeAt(0));
      const lambdaCommand = new InvokeCommand({
        FunctionName: this.asyncLambdaArn,
        Payload: payload,
      });

      // Don't wait for response from async lambda
      this.awsClient.send(lambdaCommand);
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
    const command = super.getCommand(event.data.name);
    if (!(command instanceof CommandChatInputAsync)) {
        throw new CommandNotFoundError(event.data.name);
    }
    command.handleInteractionAsync(event);
  }
}