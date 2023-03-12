import { DiscordMessage, DiscordChannel, DiscordAttachment } from "../channel";
import { DiscordGuildMember } from "../guild";
import { DiscordRole } from "../permissions";
import { DiscordUser } from "../../user";

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