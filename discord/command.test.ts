import { DiscordCommand, DiscordCommandChatInput, DiscordCommandMessage, DiscordCommandTypes, DiscordCommandUser } from "./command";
import { DiscordBitwisePermissionFlags } from "./permissions";

describe("DiscordCommand", () => {
    class TestCommand extends DiscordCommand {
        constructor(args: DiscordCommand) {
            super(args);
        }
    }
    it("should be able to create a DiscordCommand", () => {
        const command = new TestCommand({
            id: "123",
            type: DiscordCommandTypes.CHAT_INPUT,
            application_id: "123",
            guild_id: "123",
            name: "test",
            description: "test",
            options: [],
            default_member_permissions: DiscordBitwisePermissionFlags.ADMINISTRATOR,
            dm_permission: true,
            default_permission: true,
            nsfw: true,
            version: "123",
        });
        expect(command).toBeDefined();
        expect(command.id).toBe("123");
        expect(command.type).toBe(DiscordCommandTypes.CHAT_INPUT);
        expect(command.application_id).toBe("123");
        expect(command.guild_id).toBe("123");
        expect(command.name).toBe("test");
        expect(command.description).toBe("test");
        expect(command.options).toEqual([]);
        expect(command.default_member_permissions).toBe(DiscordBitwisePermissionFlags.ADMINISTRATOR);
        expect(command.dm_permission).toBe(true);
        expect(command.default_permission).toBe(true);
        expect(command.nsfw).toBe(true);
        expect(command.version).toBe("123");
    });
});

describe("DiscordCommandChatInput", () => {
    it("should be able to create a DiscordCommandChatInput", () => {
        const command = new DiscordCommandChatInput({
            id: "123",
            application_id: "123",
            name: "test",
            description: "test",
            version: "123",
            options: [],
        });
        expect(command).toBeDefined();
    });
});

describe("DiscordCommandUser", () => {
    it("should be able to create a DiscordCommandUser", () => {
        const command = new DiscordCommandUser({
            id: "123",
            application_id: "123",
            name: "test",
            description: "test",
            version: "123",
        });
        expect(command).toBeDefined();
    });
});

describe("DiscordCommandMessage", () => {
    it("should be able to create a DiscordCommandMessage", () => {
        const command = new DiscordCommandMessage({
            id: "123",
            application_id: "123",
            name: "test",
            description: "test",
            version: "123",
        });
        expect(command).toBeDefined();
    });
});