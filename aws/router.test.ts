import { MockProxy, mock } from "jest-mock-extended";
import { ServerlessDiscordAuthorizationHandler } from "../core/auth";
import { ServerlessDiscordLambdaRouter } from "./router";
import { APIGatewayEvent } from "aws-lambda";
import { DiscordInteractionPing } from "../discord";

describe("ServerlessDiscordRouter.handleInteraction", () => {
    let authHandlerMock: MockProxy<ServerlessDiscordAuthorizationHandler>;
    let lambdaEventMock: MockProxy<APIGatewayEvent>;

    beforeEach(() => {
        authHandlerMock = mock<ServerlessDiscordAuthorizationHandler>();
        lambdaEventMock = mock<APIGatewayEvent>();
    });

    it("should handle ping", async () => {
        lambdaEventMock.headers = {
            "content-type": "application/json",
            "x-signature-ed25519": "123", 
            "x-signature-timestamp": "123", 
        }
        lambdaEventMock.httpMethod = "POST";
        const interaction = new DiscordInteractionPing({
            id: "123",
            application_id: "123",
            token: "123",
            version: 1,
        });
        lambdaEventMock.body = JSON.stringify(interaction);
        authHandlerMock.handleAuthorization.mockReturnValue(true);
        const router = new ServerlessDiscordLambdaRouter({
            commands: [],
            authHandler: authHandlerMock,
        });
        const result = await router.handleLambdaInteraction(lambdaEventMock);
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify({ type: 1 }),
        });
    });
});