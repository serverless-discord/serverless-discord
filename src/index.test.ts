import { ServerlessDiscordCommandChatInput, ServerlessDiscordRouter } from ".";
import { DiscordInteractionApplicationCommand, DiscordInteractionPing, DiscordInteractionResponse } from "./discord/interactions";

describe("ServerlessDiscordRouter", () => {
    it("should handle ping", () => {
        const router = new ServerlessDiscordRouter({
            commands: [],
        });
        const interaction = new DiscordInteractionPing({ 
            id: "123",
            type: 1,
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
                    globalCommand: true,
                    guildCommand: true,
                    type: 1,
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
            type: 1,
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
});
        