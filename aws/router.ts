import { ServerlessDiscordAuthorizationHandler } from "../core/auth";
import { ServerlessDiscordCommand } from "../core/command";
import { ServerlessDiscordRouter } from "../core/router";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { DiscordInteraction, instanceOfDiscordAuthenticationRequestHeaders } from "../discord";
import { UnauthorizedError } from "../core/errors";

export function initLambdaRouter({ commands, applicationPublicKey }: { commands: ServerlessDiscordCommand[], applicationPublicKey: string }): ServerlessDiscordLambdaRouter {
    const authHandler = new ServerlessDiscordAuthorizationHandler({ applicationPublicKey });
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

export class ServerlessDiscordLambdaRouter {
  private router: ServerlessDiscordRouter;

  constructor({
    router,
  }: {
    router: ServerlessDiscordRouter,
  }) {
    this.router = router;
  }

  async handleLambdaInteraction(event: APIGatewayEvent): Promise<APIGatewayProxyResult> {
      if (event.httpMethod !== "POST") {
          return {
              statusCode: 405,
              body: "Method Not Allowed",
          }
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
          return UnauthorizedResponse
        }
        throw e;
      }
  }
}