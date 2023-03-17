import { ServerlessDiscordCommand, ServerlessDiscordCommandAsync } from "./command";
import { DiscordInteraction, DiscordInteractionApplicationCommand, DiscordInteractionResponse, DiscordInteractionResponseTypes, DiscordInteractionTypes, instanceofDiscordInteractionApplicationCommand, instanceofDiscordInteractionMessageComponent, instanceofDiscordInteractionModalSubmit, instanceofDiscordInteractionPing } from "../discord/interactions";
import { CommandNotFoundError, InvalidInteractionTypeError, NotImplementedError, UnauthorizedError } from "./errors";
import { createServerlessDiscordAuthorizationHandler, ServerlessDiscordAuthorizationHandler } from "./auth";
import { DiscordAuthenticationRequestHeaders } from "../discord";

/**
 * Initializes a new ServerlessDiscordRouter.
 * @param commands The commands to handle.
 * @param applicationPublicKey The public key of the Discord application.
 * @returns ServerlessDiscordRouter
 */
export function initRouter({ commands, applicationPublicKey }: { commands: ServerlessDiscordCommand[], applicationPublicKey: string }): ServerlessDiscordRouter {
    const authHandler = createServerlessDiscordAuthorizationHandler({ applicationPublicKey });
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
    protected commands: ServerlessDiscordCommand[];
    protected authHandler: ServerlessDiscordAuthorizationHandler;

    constructor({ 
        commands, 
        authHandler
    }: { 
        commands: ServerlessDiscordCommand[], 
        authHandler: ServerlessDiscordAuthorizationHandler,
    }) {
        this.commands = commands;
        this.authHandler = authHandler;
    } 

    async handle({
        interaction,
        requestHeaders
    } : {
        interaction: DiscordInteraction,
        requestHeaders: DiscordAuthenticationRequestHeaders
    }) {
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
        if (instanceofDiscordInteractionMessageComponent(interaction)) {
            throw new NotImplementedError();
        }
        if (interaction.type === DiscordInteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE) {
            throw new NotImplementedError();
        }
        if (instanceofDiscordInteractionModalSubmit(interaction)) {
            throw new NotImplementedError();
        }
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
        if (command instanceof ServerlessDiscordCommandAsync) {
            command.handleInteractionAsync(interaction);
        }
        return await command.handleInteraction(interaction);
    }

    /**
     * Handle an interaction that was sent asynchronously. This is used for interactions that are sent after the initial response.
     * 
     * @param interaction Discord Application Command Interaction
     */
    async handleAsyncApplicationCommand({
        interaction,
    } : {
        interaction: DiscordInteractionApplicationCommand, 
    }): Promise<void> {
        const command = this.commands.find(command => command.name === interaction.data.name);
        if (command === undefined) {
            throw new CommandNotFoundError(interaction.data.name);
        }
        if (!(command instanceof ServerlessDiscordCommandAsync)) {
            throw new CommandNotFoundError(interaction.data.name);
        }
        command.handleInteractionAsync(interaction);
    }
}