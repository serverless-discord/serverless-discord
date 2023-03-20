import { Command, CommandChatInputAsync } from "./command";
import { DiscordInteraction, DiscordInteractionApplicationCommand, DiscordInteractionResponse, DiscordInteractionResponseTypes, instanceofDiscordInteraction, instanceofDiscordInteractionApplicationCommand, instanceofDiscordInteractionPing } from "../discord/interactions";
import { CommandNotFoundError, InvalidInteractionTypeError, UnauthorizedError } from "./errors";
import { createAuthHandler, AuthHandler } from "./auth";
import { instanceOfDiscordAuthenticationRequestHeaders } from "../discord/auth";

/**
 * Initializes a new ServerlessDiscordRouter.
 * @param commands The commands to handle.
 * @param applicationPublicKey The public key of the Discord application.
 * @returns ServerlessDiscordRouter
 */
export function initRouter({ commands, applicationPublicKey }: { commands: Command[], applicationPublicKey: string }): ServerlessDiscordRouter {
    const authHandler = createAuthHandler({ applicationPublicKey });
    return new ServerlessDiscordRouter({ commands, authHandler });
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

    constructor({ 
        commands, 
        authHandler
    }: { 
        commands: Command[], 
        authHandler: AuthHandler,
    }) {
        this.commands = commands;
        this.authHandler = authHandler;
    } 

    async handle({
        interaction,
        requestHeaders
    } : {
        interaction: unknown,
        requestHeaders: unknown
    }) {
        if (!instanceOfDiscordAuthenticationRequestHeaders(requestHeaders)) {
            throw new UnauthorizedError();
        }
        if (!instanceofDiscordInteraction(interaction)) {
            throw new InvalidInteractionTypeError();
        }
        if (!this.authHandler.handleAuthorization({ body: interaction, headers: requestHeaders })) {
            throw new UnauthorizedError();
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
        if (instanceofDiscordInteractionPing(interaction)) {
            return this.handlePing();
        }
        if (instanceofDiscordInteractionApplicationCommand(interaction)) {
            return await this.handleApplicationCommand(interaction);
        }
        // TODO handle other interaction types
        throw new InvalidInteractionTypeError();
    }

    /**
     * Handle a ping interaction.
     * 
     * @returns pong response
     */
    private handlePing(): DiscordInteractionResponse {
        return { type: DiscordInteractionResponseTypes.PONG };
    }

    protected getCommand(name: string) {
        const command = this.commands.find(command => command.name === name);
        if (command === undefined) {
            throw new CommandNotFoundError();
        }
        return command;
    }

    /**
     * Handle an application command interaction by finding a matching command and handling it.
     * 
     * @param interaction Discord Application Command Interaction
     * @returns response from command
     */
    async handleApplicationCommand(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
        const command = this.getCommand(interaction.data.name);
        // Call the async handler if the command is async
        if (command instanceof CommandChatInputAsync) {
            command.handleInteractionAsync(interaction);
        }
        return await command.handleInteraction(interaction);
    }
}