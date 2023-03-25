import { DiscordCommandTypes } from "../discord/command";
import { DiscordInteractionApplicationCommand, DiscordInteractionResponse, DiscordInteractionResponseTypes, DiscordInteractionResponseDeferredChannelMessageWithSource } from "../discord/interactions";
import { Command, CommandChatInput, CommandChatInputAsync, CommandMessage, CommandUser } from "./command";

describe("ServerlessDiscordCommand", () => {
  class TestCommand extends Command {
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
      guilds: ["123"],
      name: "test",
      type: DiscordCommandTypes.USER,
      description: "test",
    });
    expect(command).toBeDefined();
    expect(command.guilds).toEqual(["123"]);
    expect(command.name).toBe("test");
    expect(command.type).toBe(DiscordCommandTypes.USER);

    const command2 = new TestCommand({
      name: "test2",
      type: DiscordCommandTypes.USER,
      description: "test",
    });
    expect(command2.guilds).toEqual([]);
  });

  it("should be able to turn into JSON", () => {
    const command = new TestCommand({
      name: "test",
      type: DiscordCommandTypes.USER,
      description: "test",
    });
    expect(command.toJSON()).toEqual({
      name: "test",
      type: DiscordCommandTypes.USER,
      description: "test",
    });
  });
});

describe("ServerlessDiscordCommandAsync", () => {
  class TestCommandAsync extends CommandChatInputAsync {

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
      guilds: ["123"],
      name: "test",
      options: [],
      description: "test",
    });
    expect(command).toBeDefined();
    expect(command.guilds).toEqual(["123"]);
    expect(command.name).toBe("test");
    expect(command.type).toBe(DiscordCommandTypes.CHAT_INPUT);

    command = new TestCommandAsync({
      name: "test2",
      options: [],
      description: "test",
    });

    expect(command.guilds).toEqual([]);
  });

  it("should be able to handle an interaction", async () => {
    const command = new TestCommandAsync({
      name: "test",
      options: [],
      description: "test",
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

  it("should be able to turn into JSON", () => {
    const command = new TestCommandAsync({
      name: "test",
      options: [],
      description: "test",
    });
    expect(command.toJSON()).toEqual({
      name: "test",
      type: DiscordCommandTypes.CHAT_INPUT,
      description: "test",
      options: [],
    });
  });
});

describe("ServerlessDiscordCommandChatInput", () => {
  class TestCommandChatInput extends CommandChatInput {
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
      name: "test",
      options: [],
      description: "test",
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

  it("should be able to turn into JSON", () => {
    const command = new TestCommandChatInput({
      name: "test",
      options: [],
      description: "test",
    });
    expect(command.toJSON()).toEqual({
      name: "test",
      type: DiscordCommandTypes.CHAT_INPUT,
      description: "test",
      options: [],
    });
  });
});

describe("ServerlessDiscordCommandUser", () => {
  class TestCommandUser extends CommandUser {
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
      name: "test",
      description: "test",
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

  it("should be able to turn into JSON", () => {
    const command = new TestCommandUser({
      name: "test",
      description: "test",
    });
    expect(command.toJSON()).toEqual({
      name: "test",
      type: DiscordCommandTypes.USER,
      description: "test",
    });
  });
});

describe("ServerlessDiscordCommandMessage", () => {
  class TestCommandMessage extends CommandMessage {
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
      name: "test",
      description: "test",
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

  it("should be able to turn into JSON", () => {
    const command = new TestCommandMessage({
      name: "test",
      description: "test",
    });
    expect(command.toJSON()).toEqual({
      name: "test",
      type: DiscordCommandTypes.MESSAGE,
      description: "test",
    });
  });
});