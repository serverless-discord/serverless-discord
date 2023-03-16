import { ServerlessDiscordRouter, ServerlessDiscordRouterRequestHeaders } from "./router";
import { ServerlessDiscordCommandChatInput } from "./command";
import { DiscordInteraction, DiscordInteractionApplicationCommand, DiscordInteractionMessageComponent, DiscordInteractionModalSubmit, DiscordInteractionPing, DiscordInteractionResponse, DiscordInteractionTypes } from "../discord/interactions";
import { CommandNotFoundError, NotImplementedError, UnauthorizedError } from "./errors";
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
        const response = await router.handleInteraction(interaction, defaultMockHeaders);
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
        const response = await router.handleInteraction(interaction, defaultMockHeaders);
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
        expect(router.handleInteraction(interaction, defaultMockHeaders)).rejects.toThrowError(CommandNotFoundError);
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
        expect(router.handleInteraction(messageInteraction, defaultMockHeaders)).rejects.toThrowError(NotImplementedError);
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
        expect(router.handleInteraction(modalInteraction, defaultMockHeaders)).rejects.toThrowError(NotImplementedError);
    });
    it("should throw error if authorization fails", async () => {
        const router = new ServerlessDiscordRouter({
            commands: [],
            authHandler: authHandlerMock
        });

        const interaction = new DiscordInteractionPing({
            id: "123",
            application_id: "123",
            token: "123",
            version: 1,
        });
        authHandlerMock.handleAuthorization.mockReturnValue(false);
        expect(router.handleInteraction(interaction, defaultMockHeaders)).rejects.toThrowError(UnauthorizedError);
    });
});
        