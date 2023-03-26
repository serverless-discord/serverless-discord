import { initRouter, ServerlessDiscordRouter, ServerlessDiscordRouterRequestHeaders } from "./router";
import { CommandChatInput, CommandChatInputAsync } from "./command";
import { DiscordInteractionApplicationCommand, DiscordInteractionMessageComponent, DiscordInteractionModalSubmit, DiscordInteractionPing, DiscordInteractionResponse, DiscordInteractionResponseDeferredChannelMessageWithSource } from "../discord/interactions";
import { CommandNotFoundError, DiscordApiClientNotSetError, InvalidInteractionTypeError, UnauthorizedError } from "./errors";
import { MockProxy, mock, DeepMockProxy, mockDeep } from "jest-mock-extended";
import { AuthHandler } from "./auth";
import pino from "pino";
import { DiscordApiClient } from "../discord/api";
import { DiscordCommandApi } from "../discord/api/commands";

class TestCommand extends CommandChatInput {
  constructor({ guilds = [], name = "test"} : { guilds?: string[]; name?: string; }) {
    super({
      name,
      options: [],
      description: "test",
      guilds,
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
    };
  }
}

describe("initRouter", () => {
  it("should init router", () => {
    const router = initRouter({
      commands: [],
      applicationPublicKey: "123",
      applicationId: "123",
      botToken: "123",
    });
    expect(router).toBeInstanceOf(ServerlessDiscordRouter);
  });
});

describe("ServerlessDiscordRouter.handle", () => {
  const defaultMockHeaders: ServerlessDiscordRouterRequestHeaders = {
    "x-signature-ed25519": "123",
    "x-signature-timestamp": "123",
  };
  let authHandlerMock: MockProxy<AuthHandler>;
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: MockProxy<DiscordApiClient>;

  beforeEach(() => {
    authHandlerMock = mock<AuthHandler>();
    logHandlerMock = mockDeep<pino.Logger>();
    logHandlerMock.child.mockReturnValue(logHandlerMock);
    apiClientMock = mock<DiscordApiClient>();
  });

  it("should handle authenticated", async () => {
    authHandlerMock.handleAuthorization.mockReturnValue(true);
    const router = new ServerlessDiscordRouter({
      commands: [],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
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
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    const interaction: MockProxy<DiscordInteractionPing> = mock<DiscordInteractionPing>();
    router.handleInteraction = jest.fn().mockResolvedValue({ type: 1 });
    await expect(router.handle({ interaction, requestHeaders: defaultMockHeaders })).rejects.toThrow(UnauthorizedError);
  });

  it("should handle invalid interaction type", async () => {
    authHandlerMock.handleAuthorization.mockReturnValue(true);
    const router = new ServerlessDiscordRouter({
      commands: [],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    router.handleInteraction = jest.fn().mockResolvedValue({ type: 1 });
    await expect(router.handle({ interaction: {}, requestHeaders: defaultMockHeaders })).rejects.toThrow(InvalidInteractionTypeError);
  });

  it("should handle invalid request headers", async () => {
    authHandlerMock.handleAuthorization.mockReturnValue(true);
    const router = new ServerlessDiscordRouter({
      commands: [],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    const interaction: MockProxy<DiscordInteractionPing> = mock<DiscordInteractionPing>();
    router.handleInteraction = jest.fn().mockResolvedValue({ type: 1 });
    await expect(router.handle({ interaction: interaction, requestHeaders: {} })).rejects.toThrow(UnauthorizedError);
  });
});

describe("ServerlessDiscordRouter.handleInteraction", () => {
  let authHandlerMock: MockProxy<AuthHandler>;
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: MockProxy<DiscordApiClient>;

  beforeEach(() => {
    authHandlerMock = mock<AuthHandler>();
    authHandlerMock.handleAuthorization.mockReturnValue(true);
    logHandlerMock = mockDeep<pino.Logger>();
    logHandlerMock.child.mockReturnValue(logHandlerMock);
    apiClientMock = mock<DiscordApiClient>();
  });

  it("should handle ping", async () => {
    const router = new ServerlessDiscordRouter({
      commands: [],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
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
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    const response = await router.handleInteraction(interaction);
    expect(testCommandMock.handleInteraction).toBeCalledWith(interaction);
    expect(response).toEqual(interactionResponse);
  });
  it("should throw error if command not found", async () => {
    const router = new ServerlessDiscordRouter({
      commands: [],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
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
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
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
  class TestCommandAsync extends CommandChatInputAsync {
    constructor() {
      super({
        name: "test",
        options: [],
        description: "test",
      });
    }

    async handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponseDeferredChannelMessageWithSource> {
      return Promise.resolve(new DiscordInteractionResponseDeferredChannelMessageWithSource({ data: { content: "test" } }));
    }

    async handleInteractionAsync(interaction: DiscordInteractionApplicationCommand): Promise<void> {
      return;
    }
  }

  let authHandler: MockProxy<AuthHandler>;
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: DeepMockProxy<DiscordApiClient>;

  beforeEach(() => {
    authHandler = mock<AuthHandler>();
    authHandler.handleAuthorization.mockReturnValue(true);
    logHandlerMock = mockDeep<pino.Logger>();
    logHandlerMock.child.mockReturnValue(logHandlerMock);
    apiClientMock = mockDeep<DiscordApiClient>();
  });

  it("should handle async application command", async () => {
    const command = new TestCommandAsync();
    command.handleInteraction = jest.fn();
    command.handleInteractionAsync = jest.fn();
    expect(command instanceof CommandChatInput).toBe(true);
    const router = new ServerlessDiscordRouter({
      commands: [command],
      authHandler,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
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

describe("ServerlessDiscordRouter.registerAllCommands", () => {
  let authHandlerMock: MockProxy<AuthHandler>;
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: MockProxy<DiscordApiClient>;

  beforeEach(() => {
    authHandlerMock = mock<AuthHandler>();
    authHandlerMock.handleAuthorization.mockReturnValue(true);
    logHandlerMock = mockDeep<pino.Logger>();
    logHandlerMock.child.mockReturnValue(logHandlerMock);
    apiClientMock = mock<DiscordApiClient>();
  });

  it("should register global and guild command", async () => {
    const command: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [] });
    const guildCommand: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [], guilds: ["123"] });
    const router = new ServerlessDiscordRouter({
      commands: [command, guildCommand],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    router.registerGuildCommands = jest.fn();
    router.registerGlobalCommands = jest.fn();
    await router.registerAllCommands();
    expect(router.registerGuildCommands).toBeCalledTimes(1);
    expect(router.registerGlobalCommands).toBeCalledTimes(1);
  });
});

describe("ServerlessDiscordRouter.registerGuildCommands", () => {
  let authHandlerMock: MockProxy<AuthHandler>;
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: MockProxy<DiscordApiClient>;

  beforeEach(() => {
    authHandlerMock = mock<AuthHandler>();
    authHandlerMock.handleAuthorization.mockReturnValue(true);
    logHandlerMock = mockDeep<pino.Logger>();
    logHandlerMock.child.mockReturnValue(logHandlerMock);
    apiClientMock = mock<DiscordApiClient>();
  });

  it("should register guild commands", async () => {
    const command: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [], guilds: ["123"] });
    const command2: MockProxy<TestCommand> = mock<TestCommand>({ name: "test2", options: [], guilds: ["123"] });
    const command3: MockProxy<TestCommand> = mock<TestCommand>({ name: "test3", options: [], guilds: ["1234"] });
    const router = new ServerlessDiscordRouter({
      commands: [command, command2, command3],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    router.registerGuildCommandBatch = jest.fn();
    await router.registerGuildCommands();
    expect(router.registerGuildCommandBatch).toBeCalledWith({
      guildId: "123",
      commands: [command, command2],
    });
    expect(router.registerGuildCommandBatch).toBeCalledWith({
      guildId: "1234",
      commands: [command3],
    });
  });

  it("should not register guild commands", async () => {
    const router = new ServerlessDiscordRouter({
      commands: [],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    router.registerGuildCommandBatch = jest.fn();
    await router.registerGuildCommands();
    expect(router.registerGuildCommandBatch).not.toBeCalled();
  });
});

describe("ServerlessDiscordRouter.registerGuildCommandBatch", () => {
  let authHandlerMock: MockProxy<AuthHandler>;
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: DeepMockProxy<DiscordApiClient>;

  beforeEach(() => {
    authHandlerMock = mock<AuthHandler>();
    authHandlerMock.handleAuthorization.mockReturnValue(true);
    logHandlerMock = mockDeep<pino.Logger>();
    logHandlerMock.child.mockReturnValue(logHandlerMock);
    apiClientMock = mockDeep<DiscordApiClient>();
  });

  it("should register guild command batch", async () => {
    const command: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [], guilds: ["123"] });
    const commandToJSONResult = {
      name: "test",
      description: "test",
    };
    command.toJSON.mockReturnValue(commandToJSONResult);
    const command2: MockProxy<TestCommand> = mock<TestCommand>({ name: "test2", options: [], guilds: ["123"] });
    const command2ToJSONResult = {
      name: "test2",
      description: "test",
    };
    command2.toJSON.mockReturnValue(command2ToJSONResult);
    apiClientMock.commands = mock<DiscordCommandApi>();
    const router = new ServerlessDiscordRouter({
      commands: [command, command2],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    await router.registerGuildCommandBatch({ guildId: "123", commands: [command, command2] });
    expect(apiClientMock.commands.bulkCreateGuildApplicationCommand).toBeCalledWith({
      applicationId: "123",
      guildId: "123",
      commands: [commandToJSONResult, command2ToJSONResult],
    });
  });

  it("should throw error if apiClient is not set", async () => {
    const command: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [], guilds: ["123"] });
    const command2: MockProxy<TestCommand> = mock<TestCommand>({ name: "test2", options: [], guilds: ["123"] });
    const router = new ServerlessDiscordRouter({
      commands: [command, command2],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
    });
    await expect(router.registerGuildCommandBatch({ guildId: "123", commands: [command, command2] })).rejects.toThrow(
      DiscordApiClientNotSetError
    );
  });
});

describe("ServerlessDiscordRouter.registerGlobalCommands", () => {
  let authHandlerMock: MockProxy<AuthHandler>;
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: MockProxy<DiscordApiClient>;

  beforeEach(() => {
    authHandlerMock = mock<AuthHandler>();
    authHandlerMock.handleAuthorization.mockReturnValue(true);
    logHandlerMock = mockDeep<pino.Logger>();
    logHandlerMock.child.mockReturnValue(logHandlerMock);
    apiClientMock = mockDeep<DiscordApiClient>();
  });

  it("should register global commands", async () => {
    const command: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [], guilds: [] });
    const command2: MockProxy<TestCommand> = mock<TestCommand>({ name: "test2", options: [], guilds: [] });
    const router = new ServerlessDiscordRouter({
      commands: [command, command2],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    router.registerGlobalCommand = jest.fn();
    await router.registerGlobalCommands();
    expect(router.registerGlobalCommand).toHaveBeenCalledTimes(2);
  });

  it("should not register global commands", async () => {
    const router = new ServerlessDiscordRouter({
      commands: [],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    router.registerGlobalCommand = jest.fn();
    await router.registerGlobalCommands();
    expect(router.registerGlobalCommand).not.toBeCalled();
  }); 
});
    
describe("ServerlessDiscordRouter.registerGlobalCommand", () => {
  let authHandlerMock: MockProxy<AuthHandler>;
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: MockProxy<DiscordApiClient>;

  beforeEach(() => {
    authHandlerMock = mock<AuthHandler>();
    authHandlerMock.handleAuthorization.mockReturnValue(true);
    logHandlerMock = mockDeep<pino.Logger>();
    logHandlerMock.child.mockReturnValue(logHandlerMock);
    apiClientMock = mockDeep<DiscordApiClient>();
  });

  it("should register global command", async () => {
    const command: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [], guilds: [] });
    const commandToJson = {
      name: "test",
      description: "test"
    };
    command.toJSON.mockReturnValue(commandToJson);
    const router = new ServerlessDiscordRouter({
      commands: [command],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });

    await router.registerGlobalCommand({ command });
    expect(apiClientMock.commands.createGlobalApplicationCommand).toBeCalledWith({
      applicationId: "123",
      command: commandToJson,
    });
  });

  it("should throw error if apiClient not defined", async () => {
    const command: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [], guilds: [] });
    const router = new ServerlessDiscordRouter({
      commands: [command],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
      applicationId: "123",
    });
    await expect(router.registerGlobalCommand({ command })).rejects.toThrowError(DiscordApiClientNotSetError);
  });
});