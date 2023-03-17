import { MockProxy, mock } from "jest-mock-extended";
import { APIGatewayEvent } from "aws-lambda";
import { ServerlessDiscordLambdaRouter, UnauthorizedResponse, BadRequestResponse, MethodNotAllowedResponse, initLambdaRouter } from "./router";
import { ServerlessDiscordRouter, CommandNotFoundError, UnauthorizedError, ServerlessDiscordAuthorizationHandler, ServerlessDiscordCommandChatInput, ServerlessDiscordCommandChatInputAsync } from "../core";
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

class TestCommandAsync extends ServerlessDiscordCommandChatInputAsync {
    constructor() {
        super({
            name: "test",
            options: [],
        });
    }
    async handleInteractionAsync(): Promise<void> {
        return;
    }
}

describe("initLambdaRouter", () => {
    it("should init router", () => {
        const router = initLambdaRouter({
            commands: [],
            applicationPublicKey: "123",
        });
        expect(router).toBeInstanceOf(ServerlessDiscordLambdaRouter);
    });
});

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

    it("should handle invalid headers", async () => {
        const event: MockProxy<APIGatewayEvent> = mock<APIGatewayEvent>({ 
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(new DiscordInteractionPing({
                id: "123",
                application_id: "123",
                version: 1,
                token: "123",
            })),
            httpMethod: "POST",
        });
        const router = new ServerlessDiscordLambdaRouter({
            commands: [],
            authHandler: authHandlerMock,
        });
        const result = await router.handleLambda(event);
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

describe("ServerlessDiscordLambdaRouter.handleLambdaAsyncApplicationCommand", () => {
    let authHandlerMock: MockProxy<ServerlessDiscordAuthorizationHandler>;

    beforeEach(() => {
        authHandlerMock = mock<ServerlessDiscordAuthorizationHandler>();
        authHandlerMock.handleAuthorization.mockReturnValue(true);
    });

    it("should handle application command", async () => {
        const command = new TestCommandAsync();
        command.handleInteractionAsync = jest.fn();
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
        const router = new ServerlessDiscordLambdaRouter({
            commands: [command],
            authHandler: authHandlerMock,
        });
        router.handleLambdaAsyncApplicationCommand(interaction);
        expect(command.handleInteractionAsync).toBeCalledWith(interaction);
    });

    it("should throw error if no matching command", async () => {
        const testCommandMock: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [] });
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
        const router = new ServerlessDiscordLambdaRouter({
            commands: [testCommandMock],
            authHandler: authHandlerMock,
        });
        const result = router.handleLambdaAsyncApplicationCommand(interaction);
        expect(result).rejects.toThrow(CommandNotFoundError);
    });
});

describe("ServerlessDiscordLambdaRouter.handleApplicationCommand", () => {
    let authHandlerMock: MockProxy<ServerlessDiscordAuthorizationHandler>;

    beforeEach(() => {
        authHandlerMock = mock<ServerlessDiscordAuthorizationHandler>();
        authHandlerMock.handleAuthorization.mockReturnValue(true);
    });

    it("should handle async application command", async () => {
        const command = new TestCommandAsync();
        const router = new ServerlessDiscordLambdaRouter({
            commands: [command],
            authHandler: authHandlerMock,
        });
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
        const result = await router.handleApplicationCommand(interaction);
        expect(result).toEqual({
            type: 5,
            data: {
                content: "...",
            },
        });
    });
});