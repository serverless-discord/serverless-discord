import { DiscordCommandOption, DiscordCommandTypes } from "./discord/command";
import { DiscordInteraction, DiscordInteractionApplicationCommand, DiscordInteractionApplicationCommandAutocomplete, DiscordInteractionMessageComponent, DiscordInteractionModalSubmit, DiscordInteractionPing, DiscordInteractionResponse, DiscordInteractionResponseTypes } from "./discord/interactions";
import { CommandNotFoundError, InvalidInteractionTypeError, NotImplementedError } from "./errors";

export abstract class ServerlessDiscordCommand {
    readonly globalCommand: boolean;
    readonly guildCommand: boolean;
    readonly type: DiscordCommandTypes;
    readonly name: string;

    constructor({
        globalCommand,
        guildCommand,
        type,
        name,
        }: {
        globalCommand: boolean;
        guildCommand: boolean;
        type: DiscordCommandTypes;
        name: string;
        }) {
        this.globalCommand = globalCommand;
        this.guildCommand = guildCommand;
        this.type = type;
        this.name = name;
    }

    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): DiscordInteractionResponse
}

export abstract class ServerlessDiscordCommandChatInput extends ServerlessDiscordCommand {
    readonly options: DiscordCommandOption[];

    constructor({
        globalCommand,
        guildCommand,
        type,
        name,
        options,
    }: {
        globalCommand: boolean;
        guildCommand: boolean;
        type: DiscordCommandTypes;
        name: string;
        options: DiscordCommandOption[];
    }) {
        super({ globalCommand, guildCommand, type, name });
        this.options = options;
    }

    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): DiscordInteractionResponse
}

export abstract class ServerlessDiscordCommandUser extends ServerlessDiscordCommand {
    constructor({
        globalCommand,
        guildCommand,
        type,
        name,
    }: {
        globalCommand: boolean;
        guildCommand: boolean;
        type: DiscordCommandTypes;
        name: string;
    }) {
        super({
            globalCommand,
            guildCommand,
            type,
            name,
        });
    }

    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): DiscordInteractionResponse
}

export abstract class ServerlessDiscordCommandMessage extends ServerlessDiscordCommand {
    constructor({ 
        globalCommand,
        guildCommand,
        type,
        name,
    }: {
        globalCommand: boolean;
        guildCommand: boolean;
        type: DiscordCommandTypes;
        name: string;
    }) {
        super({
            globalCommand,
            guildCommand,
            type,
            name,
        });
    }
    
    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): DiscordInteractionResponse
}

export class ServerlessDiscordRouter {
    commands: ServerlessDiscordCommand[];

    constructor({ commands }: { commands: ServerlessDiscordCommand[] }) {
        this.commands = commands;
    } 

    handleInteraction(interaction: DiscordInteraction): DiscordInteractionResponse {
        if (interaction instanceof DiscordInteractionPing) {
            return this.handlePing();
        }
        if (interaction instanceof DiscordInteractionApplicationCommand) {
            return this.handleApplicationCommand(interaction);
        }
        if (interaction instanceof DiscordInteractionMessageComponent) {
            throw new NotImplementedError();
        }
        if (interaction instanceof DiscordInteractionApplicationCommandAutocomplete) {
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

    handleApplicationCommand(interaction: DiscordInteractionApplicationCommand): DiscordInteractionResponse {
        const command = this.commands.find(command => command.name === interaction.data.name);
        if (command === undefined) {
            throw new CommandNotFoundError();
        }
        return command.handleInteraction(interaction);
    }
}