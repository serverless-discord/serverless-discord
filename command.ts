import { DiscordCommandTypes, DiscordCommandOption } from "./discord/command";
import { DiscordInteractionApplicationCommand, DiscordInteractionResponse } from "./discord/interactions";

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
        globalCommand?: boolean;
        guildCommand?: boolean;
        type: DiscordCommandTypes;
        name: string;
        }) {
        this.globalCommand = globalCommand ? globalCommand : false;
        this.guildCommand = guildCommand ? guildCommand : false;
        this.type = type;
        this.name = name;
    }

    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse>
}

export abstract class ServerlessDiscordCommandChatInput extends ServerlessDiscordCommand {
    readonly options: DiscordCommandOption[];

    constructor({
        globalCommand,
        guildCommand,
        name,
        options,
    }: {
        globalCommand?: boolean;
        guildCommand?: boolean;
        name: string;
        options: DiscordCommandOption[];
    }) {
        super({ globalCommand, guildCommand, type: DiscordCommandTypes.CHAT_INPUT, name });
        this.options = options;
    }

    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse>
}

export abstract class ServerlessDiscordCommandUser extends ServerlessDiscordCommand {
    constructor({
        globalCommand,
        guildCommand,
        name,
    }: {
        globalCommand?: boolean;
        guildCommand?: boolean;
        name: string;
    }) {
        super({
            globalCommand,
            guildCommand,
            type: DiscordCommandTypes.USER,
            name,
        });
    }

    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse>
}

export abstract class ServerlessDiscordCommandMessage extends ServerlessDiscordCommand {
    constructor({ 
        globalCommand,
        guildCommand,
        name,
    }: {
        globalCommand?: boolean;
        guildCommand?: boolean;
        name: string;
    }) {
        super({
            globalCommand,
            guildCommand,
            type: DiscordCommandTypes.MESSAGE,
            name,
        });
    }
    
    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse>
}