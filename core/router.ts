import { Command, CommandChatInputAsync } from "./command";
import { DiscordInteraction, DiscordInteractionApplicationCommand, DiscordInteractionResponse, DiscordInteractionResponseTypes, instanceofDiscordInteraction, instanceofDiscordInteractionApplicationCommand, instanceofDiscordInteractionPing } from "../discord/interactions";
import { CommandNotFoundError, DiscordApiClientNotSetError, InvalidInteractionTypeError, UnauthorizedError } from "./errors";
import { createAuthHandler, AuthHandler } from "./auth";
import { instanceOfDiscordAuthenticationRequestHeaders } from "../discord/auth";
import { initLogger, LogLevels } from "./logging";
import pino from "pino";
import { DiscordApiClient, initApiClient } from "../discord/api";

/**
 * Initializes a new ServerlessDiscordRouter.
 * @param commands The commands to handle.
 * @param applicationPublicKey The public key of the Discord application.
 * @returns ServerlessDiscordRouter
 */
export function initRouter({ 
  commands, 
  applicationPublicKey, 
  applicationId,
  botToken,
  logLevel
}: { 
    commands: Command[], 
    applicationPublicKey: string 
    applicationId: string,
    botToken?: string,
    logLevel?: LogLevels
}): ServerlessDiscordRouter {
  const authHandler = createAuthHandler({ applicationPublicKey });
  const logHandler = initLogger({ logLevel });
  let apiClient: DiscordApiClient | undefined;
  if (botToken) {
    apiClient = initApiClient({ token: botToken });
  }
  return new ServerlessDiscordRouter({ commands, authHandler, logHandler, applicationId, apiClient });
}

export interface ServerlessDiscordRouterRequestHeaders {
    "x-signature-ed25519": string;
    "x-signature-timestamp": string;
}

/**
 * Handles Discord interactions.
 * 
 * @param commands The commands to handle.
 * @param authHandler The authorization handler.
 * 
 * @returns ServerlessDiscordRouter
 */
export class ServerlessDiscordRouter {
  protected commands: Command[];
  protected authHandler: AuthHandler;
  protected logHandler: pino.Logger;
  protected applicationId: string;
  protected apiClient: DiscordApiClient | undefined;

  constructor({ 
    commands, 
    authHandler,
    logHandler,
    applicationId,
    apiClient
  }: { 
        commands: Command[], 
        authHandler: AuthHandler,
        logHandler: pino.Logger,
        applicationId: string
        apiClient?: DiscordApiClient
    }) {
    this.commands = commands;
    this.authHandler = authHandler;
    this.logHandler = logHandler.child({ class: "ServerlessDiscordRouter" });
    this.applicationId = applicationId;
    this.apiClient = apiClient;
  } 

  async handle({
    interaction,
    requestHeaders
  } : {
        interaction: unknown,
        requestHeaders: unknown
    }) {
    this.logHandler.debug("Handling Raw Interaction", { interaction, requestHeaders });
    if (!instanceOfDiscordAuthenticationRequestHeaders(requestHeaders)) {
      const error = new UnauthorizedError();
      this.logHandler.error(error);
      throw error;
    }
    if (!instanceofDiscordInteraction(interaction)) {
      const error = new InvalidInteractionTypeError();
      this.logHandler.error(error);
      throw error;
    }
    if (!this.authHandler.handleAuthorization({ body: interaction, headers: requestHeaders })) {
      const error = new UnauthorizedError();
      this.logHandler.error(error);
      throw error;
    }
    return await this.handleInteraction(interaction);
  }

  /**
     * Handle an incoming Discord interaction.
     * 
     * @param interaction An incoming Discord interaction from the web
     * @param requestHeaders Headers of the incoming request
     * @returns 
     */
  async handleInteraction(interaction: DiscordInteraction): Promise<DiscordInteractionResponse> {
    this.logHandler.debug("Handling Interaction", { interaction });
    if (instanceofDiscordInteractionPing(interaction)) {
      return this.handlePing();
    }
    if (instanceofDiscordInteractionApplicationCommand(interaction)) {
      return await this.handleApplicationCommand(interaction);
    }
    // TODO handle other interaction types
    const error = new InvalidInteractionTypeError();
    this.logHandler.error(error);
    throw error;
  }

  /**
     * Handle a ping interaction.
     * 
     * @returns pong response
     */
  private handlePing(): DiscordInteractionResponse {
    this.logHandler.debug("Handling Ping");
    return { type: DiscordInteractionResponseTypes.PONG };
  }

  protected getCommand(name: string) {
    const command = this.commands.find(command => command.name === name);
    if (command === undefined) {
      const error = new CommandNotFoundError();
      this.logHandler.error(error);
      throw error;
    }
    this.logHandler.debug("Found Command", { command });
    return command;
  }

  /**
     * Handle an application command interaction by finding a matching command and handling it.
     * 
     * @param interaction Discord Application Command Interaction
     * @returns response from command
     */
  async handleApplicationCommand(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
    this.logHandler.debug("Handling Application Command", { interaction });
    const command = this.getCommand(interaction.data.name);
    // Call the async handler if the command is async
    if (command instanceof CommandChatInputAsync) {
      this.logHandler.debug("Calling Async Handler", { command });
      command.handleInteractionAsync(interaction);
    }
    this.logHandler.debug("Calling Handler", { command });
    return await command.handleInteraction(interaction);
  }

  /**
   * Registers both guild command and global commands with Discord.
   */
  async registerAllCommands() {
    this.logHandler.debug("Registering all commands", { commands: this.commands });
    await this.registerGuildCommands();
    await this.registerGlobalCommands();
    this.logHandler.debug("Registered all commands", { commands: this.commands });
  }

  async registerGuildCommands() {
    // Register guild commands
    const guildCommands = this.commands.filter(command => command.guilds.length > 0);
    if (guildCommands.length === 0) {
      this.logHandler.info("No guild commands to register");
      return;
    }
    this.logHandler.debug("Registering Guild Commands", { guildCommands });
    // Group all commands by guild
    const guildCommandMap = new Map<string, Command[]>(); // guildId -> commands
    guildCommands.forEach(command => {
      command.guilds.forEach(guildId => {
        if (!guildCommandMap.has(guildId)) {
          guildCommandMap.set(guildId, []);
        }
        guildCommandMap.get(guildId)?.push(command);
      });
    });
    this.logHandler.debug("Registering Guild Command Batches", { guildCommandMap });
    await Promise.all(
      Array.from(guildCommandMap.entries()).map(([guildId, commands]) => this.registerGuildCommandBatch({ commands, guildId }))
    );
    this.logHandler.debug("Registered Guild Commands", { guildCommands });
  }

  async registerGuildCommandBatch({ commands, guildId } : { commands: Command[]; guildId: string }) {
    this.logHandler.debug("Registering Guild Command Batch", { commands, guildId });
    if (!this.apiClient) {
      const error = new DiscordApiClientNotSetError();
      this.logHandler.error(error);
      throw error;
    }
    const result = await this.apiClient.commands.bulkCreateGuildApplicationCommand({
      applicationId: this.applicationId,
      guildId,
      commands: commands.map(command => command.toJSON()),
    });
    this.logHandler.debug("Registered Guild Command Batch", { commands, guildId, result });
  }

  async registerGlobalCommands() {
    this.logHandler.debug("Registering Global Commands");
    const globalCommands = this.commands.filter(command => command.guilds.length === 0);
    if (globalCommands.length === 0) {
      return;
    }
    await Promise.all(globalCommands.map(command => this.registerGlobalCommand({ command })));
    this.logHandler.debug("Registered Global Commands", { globalCommands });
  }

  async registerGlobalCommand({ command } : { command: Command }) {
    this.logHandler.debug("Registering Global Command", { command });
    if (!this.apiClient) {
      const error = new DiscordApiClientNotSetError();
      this.logHandler.error(error);
      throw error;
    }
    const result = await this.apiClient.commands.createGlobalApplicationCommand({
      applicationId: this.applicationId,
      command: command.toJSON(),
    });
    this.logHandler.debug("Registered Global Command", { command, result });
  }
}