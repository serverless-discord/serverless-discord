import { DiscordChannelTypes } from "../channel";
import { DiscordLocalesDictionary } from "../locales";
import { DiscordBitwisePermissionFlags } from "../permissions";

export type DiscordCommand = {
    id: string;
    type?: DiscordCommandTypes;
    application_id: string;
    guild_id?: string;
    name: string;
    name_localizations?: DiscordLocalesDictionary<string>;
    description: string;
    description_localizations?: DiscordLocalesDictionary<string>;
    options?: DiscordCommandOption[];
    default_member_permissions?: DiscordBitwisePermissionFlags;
    dm_permission?: boolean;
    default_permission?: boolean;
    nsfw?: boolean;
    version: string;
}

export enum DiscordCommandTypes {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
}

export type DiscordCommandOption = {
    type: DiscordCommandOptionTypes;
    name: string;
    name_localizations?: DiscordLocalesDictionary<string>;
    description: string;
    description_localizations?: DiscordLocalesDictionary<string>;
    required?: boolean;
    choices?: DiscordCommandOptionChoice[];
    options?: DiscordCommandOption[];
    channel_types?: DiscordChannelTypes[];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
}

export enum DiscordCommandOptionTypes {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11,
}

export type DiscordCommandOptionChoice = {
    name: string;
    name_localizations?: DiscordLocalesDictionary<string>;
    value: string | number;
}

export type GuildApplicationCommandPermissions = {
    id: string;
    application_id: string;
    guild_id: string;
    permissions: ApplicationCommandPermission[];
}

export type ApplicationCommandPermission = {
    id: string;
    type: ApplicationCommandPermissionType;
    permission: boolean;
}

export enum ApplicationCommandPermissionType {
    ROLE = 1,
    USER = 2,
    CHANNEL = 3,
}