import { ServerlessDiscordCommand } from "./command";
import { DiscordInteraction, DiscordInteractionApplicationCommand, DiscordInteractionMessageComponent, DiscordInteractionModalSubmit, DiscordInteractionPing, DiscordInteractionResponse, DiscordInteractionResponseTypes, DiscordInteractionTypes, instanceofDiscordInteractionApplicationCommand, instanceofDiscordInteractionApplicationCommandAutocomplete, instanceofDiscordInteractionMessageComponent, instanceofDiscordInteractionModalSubmit, instanceofDiscordInteractionPing } from "../discord/interactions";
import { CommandNotFoundError, InvalidInteractionTypeError, NotImplementedError, UnauthorizedError } from "./errors";
import { ServerlessDiscordAuthorizationHandler } from "./auth";
import { DiscordAuthenticationRequestHeaders } from "../discord";

export function initRouter({ commands, applicationPublicKey }: { commands: ServerlessDiscordCommand[], applicationPublicKey: string }): ServerlessDiscordRouter {
    const authHandler = new ServerlessDiscordAuthorizationHandler({ applicationPublicKey });
    return new ServerlessDiscordRouter({ commands, authHandler });
}

export interface ServerlessDiscordRouterRequestHeaders {
    "x-signature-ed25519": string;
    "x-signature-timestamp": string;
}

export class ServerlessDiscordRouter {
    commands: ServerlessDiscordCommand[];
    authHandler: ServerlessDiscordAuthorizationHandler;

    constructor({ 
        commands, 
        authHandler 
    }: { 
        commands: ServerlessDiscordCommand[], 
        authHandler: ServerlessDiscordAuthorizationHandler 
    }) {
        this.commands = commands;
        this.authHandler = authHandler;
    } 

    async handleInteraction(interaction: DiscordInteraction, requestHeaders: DiscordAuthenticationRequestHeaders): Promise<DiscordInteractionResponse> {
        if (!this.authHandler.handleAuthorization(interaction, requestHeaders)) {
            throw new UnauthorizedError();
        }
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

    private handlePing(): DiscordInteractionResponse {
        return { type: DiscordInteractionResponseTypes.PONG };
    }

    private async handleApplicationCommand(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
        const command = this.commands.find(command => command.name === interaction.data.name);
        if (command === undefined) {
            throw new CommandNotFoundError();
        }
        return await command.handleInteraction(interaction);
    }
}