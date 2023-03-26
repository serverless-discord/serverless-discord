import { DiscordCommandTypes, DiscordCommandOption, DiscordCreateApplicationCommandParams } from "../discord/command";
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
 * @param guildCommand Whether the command is guild specific or not
 * @param type The type of the command
 * @param name The name of the command
 */
export abstract class Command {
  readonly guilds: string[];
  readonly type: DiscordCommandTypes;
  readonly name: string;
  readonly description: string;

  constructor({
    guilds,
    type,
    name,
    description,
  }: {
        guilds?: string[];
        type: DiscordCommandTypes;
        name: string;
        description: string;
        }) {
    this.guilds = guilds || [];
    this.type = type;
    this.name = name;
    this.description = description;
  }

    /**
     * Handle a Discord interaction. This method is called when a Discord interaction is received.
     * 
     * @param interaction The interaction that was received
     */
    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse>

    toJSON(): DiscordCreateApplicationCommandParams {
      return {
        name: this.name,
        type: this.type,
        description: this.description,
      };
    }
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
export abstract class CommandChatInput extends Command {
  readonly options: DiscordCommandOption[];

  constructor({
    guilds,
    name,
    options,
    description
  }: {
    guilds?: string[];
        name: string;
        options: DiscordCommandOption[];
        description: string;
    }) {
    super({ guilds, type: DiscordCommandTypes.CHAT_INPUT, name, description });
    this.options = options;
  }

    /**
     * Handle a Discord interaction. This method is called when a Discord interaction is received.
     * 
     * @param interaction The interaction that was received
     */
    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse>

    toJSON(): DiscordCreateApplicationCommandParams {
      return {
        name: this.name,
        type: this.type,
        description: this.description,
        options: this.options,
      };
    }
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
export abstract class CommandUser extends Command {
  constructor({
    guilds,
    name,
    description
  }: {
    guilds?: string[];
        name: string;
        description: string;
    }) {
    super({
      guilds,
      type: DiscordCommandTypes.USER,
      name,
      description
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
export abstract class CommandMessage extends Command {
  constructor({ 
    guilds,
    name,
    description
  }: {
    guilds?: string[];
        name: string;
        description: string;
    }) {
    super({
      guilds,
      type: DiscordCommandTypes.MESSAGE,
      name,
      description
    });
  }
    
    abstract handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse>
}


export abstract class CommandChatInputAsync extends CommandChatInput {
  constructor({
    guilds,
    name,
    options,
    description
  }: {
    guilds?: string[];
        name: string;
        options: DiscordCommandOption[];
        description: string;
    }) {
    super({ guilds, name, options, description });
  }

  handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponseDeferredChannelMessageWithSource> {
    return Promise.resolve(new DiscordInteractionResponseDeferredChannelMessageWithSource({ data: { content: "..." } }));
  }

  abstract handleInteractionAsync(interaction: DiscordInteractionApplicationCommand): Promise<void>

  toJSON(): DiscordCreateApplicationCommandParams {
    return {
      name: this.name,
      type: this.type,
      description: this.description,
      options: this.options,
    };
  }
}