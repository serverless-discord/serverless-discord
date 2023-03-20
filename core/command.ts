import { DiscordCommandTypes, DiscordCommandOption } from "../discord/command";
import { DiscordInteractionApplicationCommand, DiscordInteractionResponse, DiscordInteractionResponseDeferredChannelMessageWithSource } from "../discord/interactions";

/**
 * A ServerlessDiscordCommand is a command that can be executed by a Discord user.
 * 
 * A ServerlessDiscordCommand can be of type:
 * - CHAT_INPUT: A slash command
 * - USER: A user command
 * - MESSAGE: A message command
 * 
 * A ServerlessDiscordCommand can be global or guild specific.
 * 
 * @param globalCommand Whether the command is global or not
 * @param guildCommand Whether the command is guild specific or not
 * @param type The type of the command
 * @param name The name of the command
 */
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

    /**
     * Handle a Discord interaction. This method is called when a Discord interaction is received.
     * 
     * @param interaction The interaction that was received
     */
    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse>
}

/**
 * A ServerlessDiscordCommandChatInput is a slash command that can be executed by a Discord user.
 * 
 * A ServerlessDiscordCommandChatInput can be global or guild specific.
 * 
 * @param globalCommand Whether the command is global or not
 * @param guildCommand Whether the command is guild specific or not
 * @param name The name of the command
 * @param options The options of the command
 */
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

    /**
     * Handle a Discord interaction. This method is called when a Discord interaction is received.
     * 
     * @param interaction The interaction that was received
     */
    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse>
}

/**
 * A ServerlessDiscordCommandUser is a user command that can be executed on a Discord user through the right click menu.
 * 
 * A ServerlessDiscordCommandUser can be global or guild specific.
 * 
 * @param globalCommand Whether the command is global or not
 * @param guildCommand Whether the command is guild specific or not
 * @param name The name of the command
 */
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

/**
 * A ServerlessDiscordCommandMessage is a message command that can be executed on a Discord message through the right click menu.
 * 
 * A ServerlessDiscordCommandMessage can be global or guild specific.
 * 
 * @param globalCommand Whether the command is global or not
 * @param guildCommand Whether the command is guild specific or not
 * @param name The name of the command
 */
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


export abstract class ServerlessDiscordCommandChatInputAsync extends ServerlessDiscordCommandChatInput {
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
        super({ globalCommand, guildCommand, name, options });
    }

    handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponseDeferredChannelMessageWithSource> {
        return Promise.resolve(new DiscordInteractionResponseDeferredChannelMessageWithSource({ data: { content: "..." } }));
    }

    abstract handleInteractionAsync(interaction: DiscordInteractionApplicationCommand): Promise<void>
}