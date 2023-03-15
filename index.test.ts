import { ServerlessDiscordRouter, ServerlessDiscordRouterRequestHeaders } from ".";
import { ServerlessDiscordCommandChatInput } from "./command";
import { DiscordInteractionApplicationCommand, DiscordInteractionMessageComponent, DiscordInteractionPing, DiscordInteractionResponse } from "./discord/interactions";
import { CommandNotFoundError, NotImplementedError } from "./errors";
import { MockProxy, mock } from "jest-mock-extended";
import { ServerlessDiscordAuthorizationHandler } from "./auth";

describe("ServerlessDiscordRouter.handleInteraction", () => {
    const defaultMockHeaders: ServerlessDiscordRouterRequestHeaders = {
        "x-signature-ed25519": "123",
        "x-signature-timestamp": "123",
    }
    let authHandlerMock: MockProxy<ServerlessDiscordAuthorizationHandler>;

    beforeEach(() => {
        authHandlerMock = mock<ServerlessDiscordAuthorizationHandler>();
    });

    it("should handle ping", async () => {
        authHandlerMock.handleAuthorization.mockReturnValue(true);
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
        const testCommand = new TestCommand();
        authHandlerMock.handleAuthorization.mockReturnValue(true);
        const router = new ServerlessDiscordRouter({
            commands: [testCommand],
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
        const response = await router.handleInteraction(interaction, defaultMockHeaders);
        expect(response).toEqual({
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
            }
        });
    });
    it("should throw error if command not found", async () => {
        authHandlerMock.handleAuthorization.mockReturnValue(true);
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
        authHandlerMock.handleAuthorization.mockReturnValue(true);
        const router = new ServerlessDiscordRouter({
            commands: [],
            authHandler: authHandlerMock
        });

        const interaction = new DiscordInteractionMessageComponent({
            id: "123",
            application_id: "123",
            token: "123",
            version: 1,
            data: {
                custom_id: "123",
                component_type: 1,
            }
        });
        expect(router.handleInteraction(interaction, defaultMockHeaders)).rejects.toThrowError(NotImplementedError);
    });
});
        