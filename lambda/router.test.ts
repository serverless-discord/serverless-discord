import { MockProxy, mock } from "jest-mock-extended";
import { APIGatewayEvent } from "aws-lambda";
import { ServerlessDiscordLambdaRouter, UnauthorizedResponse, BadRequestResponse, MethodNotAllowedResponse } from "./router";
import { ServerlessDiscordRouter, CommandNotFoundError, UnauthorizedError, ServerlessDiscordAuthorizationHandler, ServerlessDiscordCommandChatInput } from "../core";
import { DiscordInteractionPing, DiscordInteractionApplicationCommand, DiscordInteractionResponse } from "../discord";

class TestCommand extends ServerlessDiscordCommandChatInput {
    constructor() {
        super({
            name: "test",
            options: [],
        });
    }
    async handleInteraction(): Promise<DiscordInteractionResponse> {
        return {
            type: 1,
            data: {
                tts: false,
                content: "test",
                embeds: [],
                allowed_mentions: {
                    parse: [],
                    roles: [],
                    users: [],
                    replied_user: false,
                },
                components: [],
            },
        }
    }
}

describe("ServerlessDiscordLambdaRouter.handleLambda", () => {
    let lambdaEventMock: MockProxy<APIGatewayEvent>;
    let authHandlerMock: MockProxy<ServerlessDiscordAuthorizationHandler>;

    beforeEach(() => {
        lambdaEventMock = mock<APIGatewayEvent>();
        lambdaEventMock.headers = {
            "content-type": "application/json",
            "x-signature-ed25519": "123", 
            "x-signature-timestamp": "123", 
        }
        lambdaEventMock.httpMethod = "POST";
        authHandlerMock = mock<ServerlessDiscordAuthorizationHandler>();
        authHandlerMock.handleAuthorization.mockReturnValue(true);
    });

    it("should handle ping", async () => {
        const interaction = new DiscordInteractionPing({
            id: "123",
            application_id: "123",
            token: "123",
            version: 1,
        });
        lambdaEventMock.body = JSON.stringify(interaction);
        const router = new ServerlessDiscordLambdaRouter({
            commands: [],
            authHandler: authHandlerMock,
        });
        const result = await router.handleLambda(lambdaEventMock);
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify({ type: 1 }),
        });
    });

    it("should handle application command", async () => {
        const interaction = new DiscordInteractionApplicationCommand({
            id: "123",
            application_id: "123",
            token: "123",
            version: 1,
            data: {
                id: "123",
                name: "test",
                options: [],
                type: 1,
            },
        });
        lambdaEventMock.body = JSON.stringify(interaction);
        const resolvedValue = {
            type: 1,
            data: {
                content: "test",
            },
        }
        const testCommandMock: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [] });
        const interactionResponse = {
            type: 1,
            data: {
                content: "test",
            }
        };
        testCommandMock.handleInteraction.mockResolvedValue(interactionResponse);
        const router = new ServerlessDiscordLambdaRouter({
            commands: [testCommandMock],
            authHandler: authHandlerMock,
        });
        const result = await router.handleLambda(lambdaEventMock);
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify(resolvedValue),
        });
        expect(testCommandMock.handleInteraction).toBeCalledWith(interaction);
    });

    it("should handle application command with no matching command", async () => {
      const interaction = new DiscordInteractionApplicationCommand({
        id: "123",
        application_id: "123",
        token: "123",
        version: 1,
        data: {
            id: "123",
            name: "test",
            options: [],
            type: 1,
        },
      });
      lambdaEventMock.body = JSON.stringify(interaction);
      const router = new ServerlessDiscordLambdaRouter({
        commands: [],
        authHandler: authHandlerMock,
      });
      const result = router.handleLambda(lambdaEventMock);
      expect(result).rejects.toThrow(CommandNotFoundError);
    });

    it("should handle invalid authentication", async () => {
      const interaction = new DiscordInteractionPing({
        id: "123",
        application_id: "123",
        version: 1,
        token: "123",
      });
      lambdaEventMock.body = JSON.stringify(interaction);
      authHandlerMock.handleAuthorization.mockReturnValue(false);
      const router = new ServerlessDiscordLambdaRouter({
        commands: [],
        authHandler: authHandlerMock,
      });
      const result = await router.handleLambda(lambdaEventMock);
      expect(result).toEqual(UnauthorizedResponse);
    });

    it("should handle invalid content type", async () => {
      lambdaEventMock.headers["content-type"] = "text/plain";
      const router = new ServerlessDiscordLambdaRouter({
        commands: [],
        authHandler: authHandlerMock,
      });
      const result = await router.handleLambda(lambdaEventMock);
      expect(result).toEqual(BadRequestResponse);
    });

    it("should handle invalid request method", async () => {
      lambdaEventMock.httpMethod = "GET";
      const router = new ServerlessDiscordLambdaRouter({
        commands: [],
        authHandler: authHandlerMock,
      });
      const result = await router.handleLambda(lambdaEventMock);
      expect(result).toEqual(MethodNotAllowedResponse);
    });
});