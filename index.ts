import { ServerlessDiscordCommand } from "./command";
import { DiscordInteraction, DiscordInteractionApplicationCommand, DiscordInteractionMessageComponent, DiscordInteractionModalSubmit, DiscordInteractionPing, DiscordInteractionResponse, DiscordInteractionResponseTypes, DiscordInteractionTypes } from "./discord/interactions";
import { CommandNotFoundError, InvalidInteractionTypeError, NotImplementedError } from "./errors";

export class ServerlessDiscordRouter {
    commands: ServerlessDiscordCommand[];

    constructor({ commands }: { commands: ServerlessDiscordCommand[] }) {
        this.commands = commands;
    } 

    async handleRawInteraction(interactionRaw: any): Promise<DiscordInteractionResponse> {
        // Validate interaction type
        if (interactionRaw.type === undefined) {
            throw new InvalidInteractionTypeError();
        }
        if (interactionRaw.type === DiscordInteractionTypes.PING) {
            try {
                const interaction = new DiscordInteractionPing(interactionRaw);
                return this.handleInteraction(interaction);
            } catch (error) {
                throw new InvalidInteractionTypeError();
            }
        }
        if (interactionRaw.type === DiscordInteractionTypes.APPLICATION_COMMAND) {
            try {
                const interaction = new DiscordInteractionApplicationCommand(interactionRaw);
                return this.handleInteraction(interaction);
            } catch (error) {
                throw new InvalidInteractionTypeError();
            }
        }
        if (interactionRaw.type === DiscordInteractionTypes.MESSAGE_COMPONENT) {
            try {
                const interaction = new DiscordInteractionMessageComponent(interactionRaw);
                return this.handleInteraction(interaction);
            } catch (error) {
                throw new InvalidInteractionTypeError();
            }
        }
        if (interactionRaw.type === DiscordInteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE) {
            try {
                const interaction = new DiscordInteractionApplicationCommand(interactionRaw);
                return this.handleInteraction(interaction);
            } catch (error) {
                throw new InvalidInteractionTypeError();
            }
        }
        if (interactionRaw.type === DiscordInteractionTypes.MODAL_SUBMIT) {
            try {
                const interaction = new DiscordInteractionModalSubmit(interactionRaw);
                return this.handleInteraction(interaction);
            } catch (error) {
                throw new InvalidInteractionTypeError();
            }
        }
        throw new InvalidInteractionTypeError();
    }

    async handleInteraction(interaction: DiscordInteraction): Promise<DiscordInteractionResponse> {
        if (interaction instanceof DiscordInteractionPing) {
            return this.handlePing();
        }
        if (interaction instanceof DiscordInteractionApplicationCommand) {
            return await this.handleApplicationCommand(interaction);
        }
        if (interaction instanceof DiscordInteractionMessageComponent) {
            throw new NotImplementedError();
        }
        if (interaction.type === DiscordInteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE) {
            throw new NotImplementedError();
        }
        if (interaction instanceof DiscordInteractionModalSubmit) {
            throw new NotImplementedError();
        }
        throw new InvalidInteractionTypeError();
    }

    handlePing(): DiscordInteractionResponse {
        return { type: DiscordInteractionResponseTypes.PONG };
    }

    async handleApplicationCommand(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
        const command = this.commands.find(command => command.name === interaction.data.name);
        if (command === undefined) {
            throw new CommandNotFoundError();
        }
        return await command.handleInteraction(interaction);
    }
}

export * from "./command";
export * from "./errors";
export * from "./discord";