import { ServerlessDiscordRouter } from ".";
import { ServerlessDiscordCommandChatInput } from "./command";
import { DiscordInteractionApplicationCommand, DiscordInteractionMessageComponent, DiscordInteractionPing, DiscordInteractionResponse } from "./discord/interactions";
import { CommandNotFoundError, NotImplementedError } from "./errors";

describe("ServerlessDiscordRouter.handleInteraction", () => {
    it("should handle ping", () => {
        const router = new ServerlessDiscordRouter({
            commands: [],
        });
        const interaction = new DiscordInteractionPing({ 
            id: "123",
            application_id: "123",
            token: "123",
            version: 1,
        });
        const response = router.handleInteraction(interaction);
        expect(response).toEqual({ type: 1 });
    });
    it("should handle application command", () => {
        class TestCommand extends ServerlessDiscordCommandChatInput {
            constructor() {
                super({
                    name: "test",
                    options: [],
                });
            }
            handleInteraction(interaction: DiscordInteractionApplicationCommand): DiscordInteractionResponse {
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
        const router = new ServerlessDiscordRouter({
            commands: [testCommand],
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
        const response = router.handleInteraction(interaction);
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
    it("should throw error if command not found", () => {
        const router = new ServerlessDiscordRouter({
            commands: [],
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
        expect(() => router.handleInteraction(interaction)).toThrow(CommandNotFoundError);
    });
    it("should throw error if interaction type is not supported", () => {
        const router = new ServerlessDiscordRouter({
            commands: [],
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
        expect(() => router.handleInteraction(interaction)).toThrow(NotImplementedError);
    });
    it("should handle raw ping", () => {
        const router = new ServerlessDiscordRouter({ commands: [] });
        const rawInteraction = {
            id: "123",
            type: 1,
            application_id: "123",
        };
        const response = router.handleRawInteraction(rawInteraction);
        expect(response).toEqual({ type: 1 });
    });
    it("should handle raw application command", () => {
        class TestCommand extends ServerlessDiscordCommandChatInput {
            constructor() {
                super({
                    name: "test",
                    options: [],
                });
            }
            handleInteraction(interaction: DiscordInteractionApplicationCommand): DiscordInteractionResponse {
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
        const router = new ServerlessDiscordRouter({ commands: [new TestCommand()] });
        const rawInteraction = {
            id: "123",
            type: 2,
            application_id: "123",
            token: "123",
            version: 1,
            data: {
                id: "123",
                name: "test",
                options: [],
                type: 1,
            },
        };
        const response = router.handleRawInteraction(rawInteraction);
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
});
        