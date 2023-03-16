import { DiscordMessage, DiscordChannel, DiscordAttachment, DiscordChannelTypes, DiscordAllowedMentions, DiscordEmbed } from "./channel";
import { DiscordCommandOptionChoice } from "./command";
import { DiscordEmoji } from "./emoji";
import { DiscordGuildMember } from "./guild";
import { DiscordRole } from "./permissions";
import { DiscordUser } from "./user";


/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure
 */
export abstract class DiscordInteraction {
    id: string;
    application_id: string;
    type: DiscordInteractionTypes;
    data?: DiscordApplicationCommandInteractionData | Partial<DiscordApplicationCommandInteractionData> | DiscordMessageComponentInteractionData | DiscordModalInteractionData;
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

    constructor({ id, application_id, type, data, guild_id, channel_id, member, user, token, version, message, app_permissions, locale, guild_locale }: DiscordInteraction) {
        this.id = id;
        this.application_id = application_id;
        this.type = type;
        this.data = data;
        this.guild_id = guild_id;
        this.channel_id = channel_id;
        this.member = member;
        this.user = user;
        this.token = token;
        this.version = version;
        this.message = message;
        this.app_permissions = app_permissions;
        this.locale = locale;
        this.guild_locale = guild_locale;
    }
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure
 */
export class DiscordInteractionPing extends DiscordInteraction {
    type: DiscordInteractionTypes.PING;

    constructor({
        id,
        application_id,
        guild_id,
        channel_id,
        member,
        user,
        token,
        version,
        message,
        app_permissions,
        locale,
        guild_locale,
    }: {
        id: string;
        application_id: string;
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
    }) {
        super({ id, application_id, type: DiscordInteractionTypes.PING, guild_id, channel_id, member, user, token, version, message, app_permissions, locale, guild_locale});
        this.type = DiscordInteractionTypes.PING;
    }
}

export function instanceofDiscordInteractionPing(object: any): object is DiscordInteractionPing {
    return object.type === DiscordInteractionTypes.PING;
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure
 */
export class DiscordInteractionApplicationCommand extends DiscordInteraction {
    type: DiscordInteractionTypes.APPLICATION_COMMAND;
    data: DiscordApplicationCommandInteractionData

    constructor({
        id,
        application_id,
        guild_id,
        channel_id,
        member,
        user,
        token,
        version,
        message,
        app_permissions,
        locale,
        guild_locale,
        data,
    }: {
        id: string;
        application_id: string;
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
        data: DiscordApplicationCommandInteractionData;
     }) {
        super({ id, application_id, type: DiscordInteractionTypes.APPLICATION_COMMAND, guild_id, channel_id, member, user, token, version, message, app_permissions, locale, guild_locale});
        this.type = DiscordInteractionTypes.APPLICATION_COMMAND;
        this.data = data;
    }
}

export function instanceofDiscordInteractionApplicationCommand(object: any): object is DiscordInteractionApplicationCommand {
    return object.type === DiscordInteractionTypes.APPLICATION_COMMAND;
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure
 */
export class DiscordInteractionMessageComponent extends DiscordInteraction {
    type: DiscordInteractionTypes.MESSAGE_COMPONENT;
    data: DiscordMessageComponentInteractionData;

    constructor({
        id,
        application_id,
        guild_id,
        channel_id,
        member,
        user,
        token,
        version,
        message,
        app_permissions,
        locale,
        guild_locale,
        data,
    }: {
        id: string;
        application_id: string;
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
        data: DiscordMessageComponentInteractionData;
    }) {
        super({ id, application_id, type: DiscordInteractionTypes.MESSAGE_COMPONENT, guild_id, channel_id, member, user, token, version, message, app_permissions, locale, guild_locale});
        this.type = DiscordInteractionTypes.MESSAGE_COMPONENT;
        this.data = data;
    }
}

export function instanceofDiscordInteractionMessageComponent(object: any): object is DiscordInteractionMessageComponent {
    return object.type === DiscordInteractionTypes.MESSAGE_COMPONENT;
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure
 */
export class DiscordInteractionApplicationCommandAutocomplete extends DiscordInteraction {
    type: DiscordInteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
    data: Partial<DiscordApplicationCommandInteractionData>;

    constructor({
        id,
        application_id,
        guild_id,
        channel_id,
        member,
        user,
        token,
        version,
        message,
        app_permissions,
        locale,
        guild_locale,
        data,
    }: {
        id: string;
        application_id: string;
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
        data: Partial<DiscordApplicationCommandInteractionData>;
    }) {
        super({ id, application_id, type: DiscordInteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE, guild_id, channel_id, member, user, token, version, message, app_permissions, locale, guild_locale});
        this.type = DiscordInteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
        this.data = data;
    }
}

export function instanceofDiscordInteractionApplicationCommandAutocomplete(object: any): object is DiscordInteractionApplicationCommandAutocomplete {
    return object.type === DiscordInteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE;
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure
 */
export class DiscordInteractionModalSubmit extends DiscordInteraction {
    type: DiscordInteractionTypes.MODAL_SUBMIT;
    data: DiscordModalInteractionData;

    constructor({
        id,
        application_id,
        guild_id,
        channel_id,
        member,
        user,
        token,
        version,
        message,
        app_permissions,
        locale,
        guild_locale,
        data,
    }: {
        id: string;
        application_id: string;
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
        data: DiscordModalInteractionData;
    }) {
        super({ id, application_id, type: DiscordInteractionTypes.MODAL_SUBMIT, guild_id, channel_id, member, user, token, version, message, app_permissions, locale, guild_locale});
        this.type = DiscordInteractionTypes.MODAL_SUBMIT;
        this.data = data;
    }
}

export function instanceofDiscordInteractionModalSubmit(object: any): object is DiscordInteractionModalSubmit {
    return object.type === DiscordInteractionTypes.MODAL_SUBMIT;
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
 */
export enum DiscordInteractionTypes {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    MODAL_SUBMIT = 5,
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-data-structure
 */
export type DiscordApplicationCommandInteractionData = {
    id: string;
    name: string;
    type: DiscordInteractionTypes;
    resolved?: DiscordInteractionDataResolved;
    options?: DiscordInteractionDataOption[];
    guild_id?: string;
    target_id?: string;
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-message-component-data-structure
 */
export type DiscordMessageComponentInteractionData = {
    custom_id: string;
    component_type: DiscordComponentTypes;
    values?: DiscordSelectMenuOption[];
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-modal-submit-data-structure
 */
export type DiscordModalInteractionData = {
    custom_id: string;
    components: DiscordMessageComponent[];
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-resolved-data-structure
 */
export type DiscordInteractionDataResolved = {
    users?: DiscordUser[];
    members?: DiscordGuildMember[];
    roles?: DiscordRole[];
    channels?: DiscordChannel[];
    messages?: DiscordMessage[];
    attachments?: DiscordAttachment[];
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-application-command-interaction-data-option-structure
 */
export type DiscordInteractionDataOption = {
    name: string;
    type: DiscordInteractionTypes;
    value?: string | number | boolean;
    options?: DiscordInteractionDataOption[];
    focused?: boolean;
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

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-callback-type
 */
export enum DiscordInteractionResponseTypes {
    PONG = 1,
    CHANNEL_MESSAGE_WITH_SOURCE = 4,
    DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE = 5,
    DEFERRED_UPDATE_MESSAGE = 6,
    UPDATE_MESSAGE = 7,
    APPLICATION_COMMAND_AUTOCOMPLETE_RESULT = 8,
    MODAL = 9,
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-interaction-response-structure
 */
export class DiscordInteractionResponse {
    type: DiscordInteractionResponseTypes;
    data?: DiscordInteractionResponseData | DiscordAutocompleteInteractionResponseData;

    constructor({ type, data }: { type: DiscordInteractionResponseTypes; data?: DiscordInteractionResponseData }) {
        this.type = type;
        this.data = data;
    }
}

export class DiscordInteractionResponsePong extends DiscordInteractionResponse {
    type: DiscordInteractionResponseTypes.PONG;

    constructor() {
        super({ type: DiscordInteractionResponseTypes.PONG });
        this.type = DiscordInteractionResponseTypes.PONG;
    }
}

export class DiscordInteractionResponseChannelMessageWithSource extends DiscordInteractionResponse {
    type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE;
    data: DiscordInteractionResponseData;

    constructor({ data }: { data: DiscordInteractionResponseData }) {
        super({ type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE, data });
        this.type = DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE;
        this.data = data;
    }
}

export class DiscordInteractionResponseDeferredChannelMessageWithSource extends DiscordInteractionResponse {
    type: DiscordInteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE;
    data: DiscordInteractionResponseData;

    constructor({ data }: { data: DiscordInteractionResponseData }) {
        super({ type: DiscordInteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE, data });
        this.type = DiscordInteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE;
        this.data = data;
    }
}

export class DiscordInteractionResponseDeferredUpdateMessage extends DiscordInteractionResponse {
    type: DiscordInteractionResponseTypes.DEFERRED_UPDATE_MESSAGE;
    data: DiscordInteractionResponseData;

    constructor({ data }: { data: DiscordInteractionResponseData }) {
        super({ type: DiscordInteractionResponseTypes.DEFERRED_UPDATE_MESSAGE, data });
        this.type = DiscordInteractionResponseTypes.DEFERRED_UPDATE_MESSAGE;
        this.data = data;
    }
}

export class DiscordInteractionResponseUpdateMessage extends DiscordInteractionResponse {
    type: DiscordInteractionResponseTypes.UPDATE_MESSAGE;
    data: DiscordInteractionResponseData;

    constructor({ data }: { data: DiscordInteractionResponseData }) {
        super({ type: DiscordInteractionResponseTypes.UPDATE_MESSAGE, data });
        this.type = DiscordInteractionResponseTypes.UPDATE_MESSAGE;
        this.data = data;
    }
}

export class DiscordInteractionResponseApplicationCommandAutocompleteResult extends DiscordInteractionResponse {
    type: DiscordInteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT;
    data: DiscordAutocompleteInteractionResponseData;

    constructor({ data }: { data: DiscordAutocompleteInteractionResponseData }) {
        super({ type: DiscordInteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT, data });
        this.type = DiscordInteractionResponseTypes.APPLICATION_COMMAND_AUTOCOMPLETE_RESULT;
        this.data = data;
    }
}

export class DiscordInteractionResponseModal extends DiscordInteractionResponse {
    type: DiscordInteractionResponseTypes.MODAL;
    data: DiscordInteractionResponseData;

    constructor({ data }: { data: DiscordInteractionResponseData }) {
        super({ type: DiscordInteractionResponseTypes.MODAL, data });
        this.type = DiscordInteractionResponseTypes.MODAL;
        this.data = data;
    }
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-messages
 */
export type DiscordInteractionResponseData = {
    tts?: boolean;
    content?: string;
    embeds?: DiscordEmbed[];
    allowed_mentions?: DiscordAllowedMentions;
    flags?: number;
    components?: DiscordMessageComponent[];
    attachments?: DiscordAttachment[];
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-response-object-autocomplete
 */
export type DiscordAutocompleteInteractionResponseData = {
    choices: DiscordCommandOptionChoice[];
}

/**
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#message-interaction-object-message-interaction-structure
 */
export type DiscordMessageInteraction = {
    id: string;
    type: DiscordInteractionTypes;
    name: string;
    user: DiscordUser;
    member?: DiscordGuildMember;
}