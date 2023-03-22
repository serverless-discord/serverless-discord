import { initRouter, ServerlessDiscordRouter, ServerlessDiscordRouterRequestHeaders } from "./router";
import { CommandChatInput, CommandChatInputAsync } from "./command";
import { DiscordInteractionApplicationCommand, DiscordInteractionMessageComponent, DiscordInteractionModalSubmit, DiscordInteractionPing, DiscordInteractionResponse, DiscordInteractionResponseDeferredChannelMessageWithSource } from "../discord/interactions";
import { CommandNotFoundError, InvalidInteractionTypeError, UnauthorizedError } from "./errors";
import { MockProxy, mock } from "jest-mock-extended";
import { AuthHandler } from "./auth";
import pino from "pino";

class TestCommand extends CommandChatInput {
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
    };
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
  };
  let authHandlerMock: MockProxy<AuthHandler>;
  let logHandlerMock: MockProxy<pino.Logger>;

  beforeEach(() => {
    authHandlerMock = mock<AuthHandler>();
    logHandlerMock = mock<pino.Logger>();
  });

  it("should handle authenticated", async () => {
    authHandlerMock.handleAuthorization.mockReturnValue(true);
    const router = new ServerlessDiscordRouter({
      commands: [],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
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
    });
    const interaction: MockProxy<DiscordInteractionPing> = mock<DiscordInteractionPing>();
    router.handleInteraction = jest.fn().mockResolvedValue({ type: 1 });
    await expect(router.handle({ interaction: interaction, requestHeaders: {} })).rejects.toThrow(UnauthorizedError);
  });
});

describe("ServerlessDiscordRouter.handleInteraction", () => {
  const defaultMockHeaders: ServerlessDiscordRouterRequestHeaders = {
    "x-signature-ed25519": "123",
    "x-signature-timestamp": "123",
  };
  let authHandlerMock: MockProxy<AuthHandler>;
  let logHandlerMock: MockProxy<pino.Logger>;

  beforeEach(() => {
    authHandlerMock = mock<AuthHandler>();
    authHandlerMock.handleAuthorization.mockReturnValue(true);
    logHandlerMock = mock<pino.Logger>();
  });

  it("should handle ping", async () => {
    const router = new ServerlessDiscordRouter({
      commands: [],
      authHandler: authHandlerMock,
      logHandler: logHandlerMock,
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
  let logHandler: MockProxy<pino.Logger>;

  beforeEach(() => {
    authHandler = mock<AuthHandler>();
    authHandler.handleAuthorization.mockReturnValue(true);
    logHandler = mock<pino.Logger>();
  });

  it("should handle async application command", async () => {
    const command = new TestCommandAsync();
    command.handleInteraction = jest.fn();
    command.handleInteractionAsync = jest.fn();
    expect(command instanceof CommandChatInput).toBe(true);
    const router = new ServerlessDiscordRouter({
      commands: [command],
      authHandler,
      logHandler,
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