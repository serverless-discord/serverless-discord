import { initRouter, ServerlessDiscordRouter, ServerlessDiscordRouterRequestHeaders } from "./router";
import { ServerlessDiscordCommandChatInput, ServerlessDiscordCommandChatInputAsync } from "./command";
import { DiscordInteractionApplicationCommand, DiscordInteractionMessageComponent, DiscordInteractionModalSubmit, DiscordInteractionPing, DiscordInteractionResponse } from "../discord/interactions";
import { CommandNotFoundError, InvalidInteractionTypeError, NotImplementedError, UnauthorizedError } from "./errors";
import { MockProxy, mock } from "jest-mock-extended";
import { ServerlessDiscordAuthorizationHandler } from "./auth";

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

describe("initRouter", () => {
    it("should init router", () => {
        const router = initRouter({
            commands: [],
            applicationPublicKey: "123",
        });
        expect(router).toBeInstanceOf(ServerlessDiscordRouter);
    });
});

describe("ServerlessDiscordRouter.handle", () => {
    const defaultMockHeaders: ServerlessDiscordRouterRequestHeaders = {
        "x-signature-ed25519": "123",
        "x-signature-timestamp": "123",
    }
    let authHandlerMock: MockProxy<ServerlessDiscordAuthorizationHandler>;

    beforeEach(() => {
        authHandlerMock = mock<ServerlessDiscordAuthorizationHandler>();
    });

    it("should handle authenticated", async () => {
        authHandlerMock.handleAuthorization.mockReturnValue(true);
        const router = new ServerlessDiscordRouter({
            commands: [],
            authHandler: authHandlerMock,
        });
        const interaction: MockProxy<DiscordInteractionPing> = mock<DiscordInteractionPing>();
        router.handleInteraction = jest.fn().mockResolvedValue({ type: 1 });
        const result = await router.handle({ interaction, requestHeaders: defaultMockHeaders });
        expect(result).toEqual({ type: 1 });
    });

    it("should handle unauthorized", async () => {
        authHandlerMock.handleAuthorization.mockReturnValue(false);
        const router = new ServerlessDiscordRouter({
            commands: [],
            authHandler: authHandlerMock,
        });
        const interaction: MockProxy<DiscordInteractionPing> = mock<DiscordInteractionPing>();
        router.handleInteraction = jest.fn().mockResolvedValue({ type: 1 });
        await expect(router.handle({ interaction, requestHeaders: defaultMockHeaders })).rejects.toThrow(UnauthorizedError);
    });
});

describe("ServerlessDiscordRouter.handleInteraction", () => {
    const defaultMockHeaders: ServerlessDiscordRouterRequestHeaders = {
        "x-signature-ed25519": "123",
        "x-signature-timestamp": "123",
    }
    let authHandlerMock: MockProxy<ServerlessDiscordAuthorizationHandler>;

    beforeEach(() => {
        authHandlerMock = mock<ServerlessDiscordAuthorizationHandler>();
        authHandlerMock.handleAuthorization.mockReturnValue(true);
    });

    it("should handle ping", async () => {
        const router = new ServerlessDiscordRouter({
            commands: [],
            authHandler: authHandlerMock,
        });
        const interaction = new DiscordInteractionPing({ 
            id: "123",
            application_id: "123",
            token: "123",
            version: 1,
        });
        const response = await router.handleInteraction(interaction);
        expect(response).toEqual({ type: 1 });
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
        const testCommandMock: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [] });
        const interactionResponse = {
            type: 1,
            data: {
                content: "test",
            }
        };
        testCommandMock.handleInteraction.mockResolvedValue(interactionResponse);
        const router = new ServerlessDiscordRouter({
            commands: [testCommandMock],
            authHandler: authHandlerMock,
        });
        const response = await router.handleInteraction(interaction);
        expect(testCommandMock.handleInteraction).toBeCalledWith(interaction);
        expect(response).toEqual(interactionResponse);
    });
    it("should throw error if command not found", async () => {
        const router = new ServerlessDiscordRouter({
            commands: [],
            authHandler: authHandlerMock
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
        // Test that the CommandNotFoundError is thrown
        expect(router.handleInteraction(interaction)).rejects.toThrowError(CommandNotFoundError);
    });
    it("should throw error if interaction type is not supported", async () => {
        const router = new ServerlessDiscordRouter({
            commands: [],
            authHandler: authHandlerMock
        });

        const messageInteraction = new DiscordInteractionMessageComponent({
            id: "123",
            application_id: "123",
            token: "123",
            version: 1,
            data: {
                custom_id: "123",
                component_type: 1,
            }
        });
        expect(router.handleInteraction(messageInteraction)).rejects.toThrowError(InvalidInteractionTypeError);
        const modalInteraction = new DiscordInteractionModalSubmit({
            id: "123",
            application_id: "123",
            token: "123",
            version: 1,
            data: {
                custom_id: "123",
                components: [],
            }
        });
        expect(router.handleInteraction(modalInteraction)).rejects.toThrowError(InvalidInteractionTypeError);
    });
});

describe("ServerlessDiscordRouter.handleApplicationCommand", () => {
    class TestCommandAsync extends ServerlessDiscordCommandChatInputAsync {
        constructor() {
            super({
                name: "test",
                options: [],
            });
        }

        async handleInteractionAsync(interaction: DiscordInteractionApplicationCommand): Promise<void> {
            return;
        }
    }

    let authHandler: MockProxy<ServerlessDiscordAuthorizationHandler>;

    beforeEach(() => {
        authHandler = mock<ServerlessDiscordAuthorizationHandler>();
        authHandler.handleAuthorization.mockReturnValue(true);
    });

    it("should handle async application command", async () => {
        const command = new TestCommandAsync();
        command.handleInteraction = jest.fn();
        command.handleInteractionAsync = jest.fn();
        expect(command instanceof ServerlessDiscordCommandChatInput).toBe(true);
        const router = new ServerlessDiscordRouter({
            commands: [command],
            authHandler
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
        const response = await router.handleApplicationCommand(interaction);
        expect(command.handleInteraction).toBeCalledWith(interaction);
        expect(command.handleInteractionAsync).toBeCalledWith(interaction);
    });
});