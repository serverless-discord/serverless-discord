import { DiscordCommandTypes, DiscordInteractionApplicationCommand, DiscordInteractionResponse, DiscordInteractionResponseDeferredChannelMessageWithSource, DiscordInteractionResponseTypes } from "../discord";
import { ServerlessDiscordCommand, ServerlessDiscordCommandChatInput, ServerlessDiscordCommandChatInputAsync, ServerlessDiscordCommandMessage, ServerlessDiscordCommandUser } from "./command";

describe("ServerlessDiscordCommand", () => {
    class TestCommand extends ServerlessDiscordCommand {
        handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
            return Promise.resolve({
                type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Hello World!"
                }
            });
        }
    }

    it("should be able to create a ServerlessDiscordCommand", () => {
        const command = new TestCommand({
            globalCommand: true,
            guildCommand: true,
            name: "test",
            type: DiscordCommandTypes.USER,
        });
        expect(command).toBeDefined();
        expect(command.globalCommand).toBe(true);
        expect(command.guildCommand).toBe(true);
        expect(command.name).toBe("test");
        expect(command.type).toBe(DiscordCommandTypes.USER);

        const command2 = new TestCommand({
            name: "test2",
            type: DiscordCommandTypes.CHAT_INPUT,
        });
        expect(command2.globalCommand).toBe(false);
        expect(command2.guildCommand).toBe(false);
    });
});

describe("ServerlessDiscordCommandAsync", () => {
    class TestCommandAsync extends ServerlessDiscordCommandChatInputAsync {

        handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponseDeferredChannelMessageWithSource> {
            return Promise.resolve({
                type: DiscordInteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "..."
                }
            });
        }

        handleInteractionAsync(interaction: DiscordInteractionApplicationCommand): Promise<void> {
            return Promise.resolve();
        }
    }

    it("should be able to create a ServerlessDiscordCommandAsync", () => {
        let command = new TestCommandAsync({
            globalCommand: true,
            guildCommand: true,
            name: "test",
            options: [],
        });
        expect(command).toBeDefined();
        expect(command.globalCommand).toBe(true);
        expect(command.guildCommand).toBe(true);
        expect(command.name).toBe("test");
        expect(command.type).toBe(DiscordCommandTypes.CHAT_INPUT);

        command = new TestCommandAsync({
            name: "test2",
            options: [],
        });

        expect(command.globalCommand).toBe(false);
        expect(command.guildCommand).toBe(false);
        expect(command.name).toBe("test2");
        expect(command.type).toBe(DiscordCommandTypes.CHAT_INPUT);
    });

    it("should be able to handle an interaction", async () => {
        const command = new TestCommandAsync({
            globalCommand: true,
            guildCommand: true,
            name: "test",
            options: [],
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
            }
        });
        const response = await command.handleInteraction(interaction);
        expect(response).toEqual({
            type: DiscordInteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "..."
            }
        });
    });
});

describe("ServerlessDiscordCommandChatInput", () => {
    class TestCommandChatInput extends ServerlessDiscordCommandChatInput {
        handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
            return Promise.resolve({
                type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Hello World!"
                }
            });
        }
    }

    it("should be able to handle an interaction", async () => {
        const command = new TestCommandChatInput({
            globalCommand: true,
            guildCommand: true,
            name: "test",
            options: [],
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
            }
        });
        const result = await command.handleInteraction(interaction);
        expect(result).toEqual({
            type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "Hello World!"
            }
        })
    });
});

describe("ServerlessDiscordCommandUser", () => {
    class TestCommandUser extends ServerlessDiscordCommandUser {
        handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
            return Promise.resolve({
                type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Hello World!"
                }
            });
        }
    }

    it("should be able to handle an interaction", async () => {
        const command = new TestCommandUser({
            globalCommand: true,
            guildCommand: true,
            name: "test",
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
            }
        });
        const result = await command.handleInteraction(interaction);
        expect(result).toEqual({
            type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "Hello World!"
            }
        });
    });
});

describe("ServerlessDiscordCommandMessage", () => {
    class TestCommandMessage extends ServerlessDiscordCommandMessage {
        handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
            return Promise.resolve({
                type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "Hello World!"
                }
            });
        }
    }

    it("should be able to handle an interaction", async () => {
        const command = new TestCommandMessage({
            globalCommand: true,
            guildCommand: true,
            name: "test",
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
            }
        });
        const result = await command.handleInteraction(interaction);
        expect(result).toEqual({
            type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "Hello World!"
            }
        });
    });
});