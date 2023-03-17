import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { ServerlessDiscordCommand, ServerlessDiscordAuthorizationHandler, ServerlessDiscordRouter, UnauthorizedError, createServerlessDiscordAuthorizationHandler } from "../core";
import { instanceOfDiscordAuthenticationRequestHeaders, DiscordInteraction, DiscordInteractionApplicationCommand } from "../discord";

export function initLambdaRouter({ commands, applicationPublicKey }: { commands: ServerlessDiscordCommand[], applicationPublicKey: string }): ServerlessDiscordLambdaRouter {
    const authHandler = createServerlessDiscordAuthorizationHandler({ applicationPublicKey });
    const router = new ServerlessDiscordRouter({ commands, authHandler });
    return new ServerlessDiscordLambdaRouter({ router });
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
export class ServerlessDiscordLambdaRouter {
  private router: ServerlessDiscordRouter;

  constructor({
    router,
  }: {
    router: ServerlessDiscordRouter,
  }) {
    this.router = router;
  }

  /**
   * Handler for AWS Lambda behind API Gateway that handles Discord bot interactions
   * 
   * @param event APIGatewayEvent from AWS Lambda
   * @returns APIGatewayProxyResult
   */
  async handleLambdaInteraction(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
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
        const result = await this.router.handleInteraction(interaction, headers);
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

  /**
   * Handler for AWS Lambda that handles async application commands. This should be invoked asynchronously by handleDiscordWebhook as a
   * seperate Lambda function.
   * 
   * @param event Interaction from handleDiscordWebhook
   */
  async handleAsyncApplicationCommand(event: DiscordInteractionApplicationCommand) {
    this.router.handleAsyncApplicationCommand({ interaction: event });
  }
}