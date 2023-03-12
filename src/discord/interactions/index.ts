import { DiscordMessage, DiscordChannel, DiscordAttachment, DiscordChannelTypes } from "../channel";
import { DiscordEmoji } from "../emoji";
import { DiscordGuildMember } from "../guild";
import { DiscordRole } from "../permissions";
import { DiscordUser } from "../user";

export type DiscordInteraction = {
    id: string;
    application_id: string;
    type: DiscordInteractionTypes;
    data?: DiscordInteractionData;
    guild_id?: string;
    channel_id?: string;
    member?: DiscordGuildMember;
    user?: DiscordUser;
    token: string;
    version: number;
    message?: DiscordMessage;
    app_permissions?: string;
    locale?: string;
    guild_locale?: string;
}

export enum DiscordInteractionTypes {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    MODAL_SUBMIT = 5,
}

export type DiscordInteractionData = {
    id: string;
    name: string;
    type: DiscordInteractionTypes;
    resolved?: DiscordInteractionDataResolved;
    options?: DiscordInteractionDataOption[];
    guild_id?: string;
    target_id?: string;
}

export type DiscordInteractionDataResolved = {
    users?: DiscordUser[];
    members?: DiscordGuildMember[];
    roles?: DiscordRole[];
    channels?: DiscordChannel[];
    messages?: DiscordMessage[];
    attachments?: DiscordAttachment[];
}

export type DiscordInteractionDataOption = {
    name: string;
    type: DiscordInteractionTypes;
    value?: string | number | boolean;
    options?: DiscordInteractionDataOption[];
    focused?: boolean;
}

export type DiscordMessageInteraction = {
    id: string;
    type: DiscordInteractionTypes;
    name: string;
    user: DiscordUser;
    member?: DiscordGuildMember;
}

export type DiscordMessageComponent = DiscordButton | DiscordSelectMenu | DiscordTextInput | DiscordActionRow;

export type DiscordActionRow = {
    type: DiscordComponentTypes.ACTION_ROW;
    components: DiscordMessageComponent[];
}

export enum DiscordComponentTypes {
    ACTION_ROW = 1,
    BUTTON = 2,
    STRING_SELECT = 3,
    TEXT_INPUT = 4,
    USER_SELECT = 5,
    ROLE_SELECT = 6,
    MENTIONABLE_SELECT = 7,
    CHANNEL_SELECT = 8,
}

export type DiscordButton = {
    type: DiscordComponentTypes.BUTTON;
    style: DiscordButtonStyles;
    label?: string;
    emoji?: DiscordEmoji;
    custom_id?: string;
    url?: string;
    disabled?: boolean;
}

export enum DiscordButtonStyles {
    PRIMARY = 1,
    SECONDARY = 2,
    SUCCESS = 3,
    DANGER = 4,
    LINK = 5,
}

export type DiscordSelectMenu = {
    type: DiscordComponentTypes.STRING_SELECT | DiscordComponentTypes.USER_SELECT | DiscordComponentTypes.ROLE_SELECT | DiscordComponentTypes.MENTIONABLE_SELECT | DiscordComponentTypes.CHANNEL_SELECT;
    custom_id: string;
    options?: DiscordSelectMenuOption[];
    channel_types?: DiscordChannelTypes[];
    placeholder?: string;
    min_values?: number;
    max_values?: number;
    disabled?: boolean;
}

export type DiscordSelectMenuOption = {
    label: string;
    value: string;
    description?: string;
    emoji?: DiscordEmoji;
    default?: boolean;
}

export type DiscordTextInput = {
    type: DiscordComponentTypes.TEXT_INPUT;
    custom_id: string;
    style: DiscordTextInputStyles;
    label: string;
    min_length?: number;
    max_length?: number;
    required?: boolean;
    value?: string;
    placeholder?: string;
}

export enum DiscordTextInputStyles {
    SHORT = 1,
    PARAGRAPH = 2,
}