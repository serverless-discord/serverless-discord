import { Command, CommandChatInputAsync } from "./command";
import { DiscordInteraction, DiscordInteractionApplicationCommand, DiscordInteractionResponse, DiscordInteractionResponseTypes, instanceofDiscordInteraction, instanceofDiscordInteractionApplicationCommand, instanceofDiscordInteractionPing } from "../discord/interactions";
import { AsyncFeatureDisabledError, CommandNotFoundError, DiscordApiClientNotSetError, InvalidInteractionTypeError, UnauthorizedError } from "./errors";
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
  const apiClient = botToken ? initApiClient({ token: botToken }) : undefined;
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
  protected authHandler?: AuthHandler;
  protected logHandler: pino.Logger;
  protected applicationId: string;
  protected apiClient?: DiscordApiClient;

  constructor({ 
    commands, 
    authHandler,
    logHandler,
    applicationId,
    apiClient,
  }: { 
    commands: Command[], 
    authHandler?: AuthHandler,
    logHandler: pino.Logger,
    applicationId: string
    apiClient?: DiscordApiClient
  }) {
    // TODO: make sure none of the commands have the same name
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
    if (this.authHandler && !this.authHandler.handleAuthorization({ body: interaction, headers: requestHeaders })) {
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
      if (!this.apiClient) {
        const error = new AsyncFeatureDisabledError();
        this.logHandler.error(error);
        throw error;
      }
      this.logHandler.debug("Calling Async Handler", { command });
      command.handleInteractionAsyncWrapper({ apiClient: this.apiClient, interaction });
    }
    this.logHandler.debug("Calling Handler", { command });
    return await command.handleInteraction(interaction);
  }
}