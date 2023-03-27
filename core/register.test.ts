import { MockProxy, DeepMockProxy, mock, mockDeep } from "jest-mock-extended";
import pino from "pino";
import { DiscordApiClient } from "../discord/api";
import { DiscordCommandApi } from "../discord/api/commands";
import { DiscordInteractionResponse } from "../discord/interactions";
import { CommandChatInput } from "./command";
import { DiscordApiClientNotSetError } from "./errors";
import { CommandRegistrar, initRegistrar } from "./register";

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

describe("CommandRegistrar.registerAllCommands", () => {
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: MockProxy<DiscordApiClient>;

  beforeEach(() => {
    logHandlerMock = mockDeep<pino.Logger>();
    logHandlerMock.child.mockReturnValue(logHandlerMock);
    apiClientMock = mock<DiscordApiClient>();
  });

  it("should register global and guild command", async () => {
    const command: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [] });
    const guildCommand: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [], guilds: ["123"] });
    const registrar = new CommandRegistrar({
      commands: [command, guildCommand],
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    registrar.registerGuildCommands = jest.fn();
    registrar.registerGlobalCommands = jest.fn();
    await registrar.registerAllCommands();
    expect(registrar.registerGuildCommands).toBeCalledTimes(1);
    expect(registrar.registerGlobalCommands).toBeCalledTimes(1);
  });
});

describe("CommandRegistrar.registerGuildCommands", () => {
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: MockProxy<DiscordApiClient>;

  beforeEach(() => {
    logHandlerMock = mockDeep<pino.Logger>();
    logHandlerMock.child.mockReturnValue(logHandlerMock);
    apiClientMock = mock<DiscordApiClient>();
  });

  it("should register guild commands", async () => {
    const command: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [], guilds: ["123"] });
    const command2: MockProxy<TestCommand> = mock<TestCommand>({ name: "test2", options: [], guilds: ["123"] });
    const command3: MockProxy<TestCommand> = mock<TestCommand>({ name: "test3", options: [], guilds: ["1234"] });
    const registrar = new CommandRegistrar({
      commands: [command, command2, command3],
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    registrar.registerGuildCommandBatch = jest.fn();
    await registrar.registerGuildCommands();
    expect(registrar.registerGuildCommandBatch).toBeCalledWith({
      guildId: "123",
      commands: [command, command2],
    });
    expect(registrar.registerGuildCommandBatch).toBeCalledWith({
      guildId: "1234",
      commands: [command3],
    });
  });

  it("should not register guild commands", async () => {
    const registrar = new CommandRegistrar({
      commands: [],
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    registrar.registerGuildCommandBatch = jest.fn();
    await registrar.registerGuildCommands();
    expect(registrar.registerGuildCommandBatch).not.toBeCalled();
  });
});

describe("CommandRegistrar.registerGuildCommandBatch", () => {
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: DeepMockProxy<DiscordApiClient>;

  beforeEach(() => {
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
    const registrar = new CommandRegistrar({
      commands: [command, command2],
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    await registrar.registerGuildCommandBatch({ guildId: "123", commands: [command, command2] });
    expect(apiClientMock.commands.bulkCreateGuildApplicationCommand).toBeCalledWith({
      applicationId: "123",
      guildId: "123",
      commands: [commandToJSONResult, command2ToJSONResult],
    });
  });
});

describe("CommandRegistrar.registerGlobalCommands", () => {
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: MockProxy<DiscordApiClient>;

  beforeEach(() => {
    logHandlerMock = mockDeep<pino.Logger>();
    logHandlerMock.child.mockReturnValue(logHandlerMock);
    apiClientMock = mockDeep<DiscordApiClient>();
  });

  it("should register global commands", async () => {
    const command: MockProxy<TestCommand> = mock<TestCommand>({ name: "test", options: [], guilds: [] });
    const command2: MockProxy<TestCommand> = mock<TestCommand>({ name: "test2", options: [], guilds: [] });
    const registrar = new CommandRegistrar({
      commands: [command, command2],
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    registrar.registerGlobalCommand = jest.fn();
    await registrar.registerGlobalCommands();
    expect(registrar.registerGlobalCommand).toHaveBeenCalledTimes(2);
  });

  it("should not register global commands", async () => {
    const registrar = new CommandRegistrar({
      commands: [],
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });
    registrar.registerGlobalCommand = jest.fn();
    await registrar.registerGlobalCommands();
    expect(registrar.registerGlobalCommand).not.toBeCalled();
  }); 
});
    
describe("CommandRegistrar.registerGlobalCommand", () => {
  let logHandlerMock: DeepMockProxy<pino.Logger>;
  let apiClientMock: MockProxy<DiscordApiClient>;

  beforeEach(() => {
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
    const registrar = new CommandRegistrar({
      commands: [command],
      logHandler: logHandlerMock,
      applicationId: "123",
      apiClient: apiClientMock,
    });

    await registrar.registerGlobalCommand({ command });
    expect(apiClientMock.commands.createGlobalApplicationCommand).toBeCalledWith({
      applicationId: "123",
      command: commandToJson,
    });
  });
});

describe("initRegistrar", () => {
  it("should init registrar", () => {
    const registrar = initRegistrar({
      commands: [],
      applicationId: "123",
      botToken: "123",
    });
    expect(registrar).toBeInstanceOf(CommandRegistrar);
  });
});