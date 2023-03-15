import { ServerlessDiscordAuthorizationHandler } from "../core/auth";
import { ServerlessDiscordCommand } from "../core/command";
import { ServerlessDiscordRouter } from "../core/router";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { DiscordInteraction, instanceOfDiscordAuthenticationRequestHeaders } from "../discord";

export function initLambdaRouter({ commands, applicationPublicKey }: { commands: ServerlessDiscordCommand[], applicationPublicKey: string }): ServerlessDiscordLambdaRouter {
    const authHandler = new ServerlessDiscordAuthorizationHandler({ applicationPublicKey });
    return new ServerlessDiscordLambdaRouter({ commands, authHandler });
}

export class ServerlessDiscordLambdaRouter extends ServerlessDiscordRouter {
    constructor({ 
        commands, 
        authHandler 
    }: { 
        commands: ServerlessDiscordCommand[], 
        authHandler: ServerlessDiscordAuthorizationHandler 
    }) {
        super({ commands, authHandler });
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
            return {
                statusCode: 400,
                body: "Bad Request",
            }
        }
        if (!instanceOfDiscordAuthenticationRequestHeaders(headers)) {
            return {
                statusCode: 401,
                body: "Unauthorized",
            }
        }
        const interaction = JSON.parse(event.body) as DiscordInteraction;
        const result = await this.handleInteraction(interaction, headers);
        return {
            statusCode: 200,
            body: JSON.stringify(result),
        }
    }
}