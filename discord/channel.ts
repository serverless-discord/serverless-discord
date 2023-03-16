import { DiscordApplication } from "./application";
import { DiscordEmoji } from "./emoji";
import { DiscordGuildMember } from "./guild";
import { DiscordMessageComponent, DiscordMessageInteraction } from "./interactions/interactions";
import { DiscordRoleTags } from "./permissions";
import { DiscordSticker } from "./sticker";
import { DiscordUser } from "./user";

/**
 * Represents a guild or DM channel within Discord. This can be any type of channel (text, voice, category, etc.). See DiscordChannelTypes for a list of all channel types.
 * 
 * @see https://discord.com/developers/docs/resources/channel#channel-object-channel-structure
 */
export type DiscordChannel = {
    id: string;
    type: DiscordChannelTypes;
    guild_id?: string;
    position?: number;
    permission_overwrites?: DiscordOverwrite[];
    name?: string;
    topic?: string;
    nsfw?: boolean;
    last_message_id?: string;
    bitrate?: number;
    user_limit?: number;
    rate_limit_per_user?: number;
    recipients?: DiscordUser[];
    icon?: string;
    owner_id?: string;
    application_id?: string;
    parent_id?: string;
    last_pin_timestamp?: string;
    rtc_region?: string;
    video_quality_mode?: DiscordVideoQualityModes;
    message_count?: number;
    member_count?: number;
    thread_metadata?: DiscordThreadMetadata;
    member?: DiscordThreadMember;
    default_auto_archive_duration?: number;
    permissions?: string;
    flags?: number;
    total_message_sent?: number;
    available_tags?: DiscordForumTag[];
    applied_tags?: string[];
    default_reaction_emoji?: DiscordDefaultReactionEmoji;
    default_thread_rate_limit_per_user?: number;
    default_sort_order?: DiscordSortOrderTypes;
    default_forum_layout?: DiscordForumLayoutTypes;
}

/**
 * The types of Discord channels.
 * 
 * @see https://discord.com/developers/docs/resources/channel#channel-object-channel-types
 */
export enum DiscordChannelTypes {
    GUILD_TEXT = 0,
    DM = 1,
    GUILD_VOICE = 2,
    GROUP_DM = 3,
    GUILD_CATEGORY = 4,
    GUILD_ANNOUNCEMENT = 5,
    ANNOUNCEMENT_THREAD = 10,
    PUBLIC_THREAD = 11,
    PRIVATE_THREAD = 12,
    GUILD_STAGE_VOICE = 13,
    GUILD_DIRECTORY = 14,
    GUILD_FORUM = 15,
}

/**
 * The possible types of streaming discord video quality
 * 
 * @see https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes
 */
export enum DiscordVideoQualityModes {
    AUTO = 1,
    FULL = 2,
}

/**
 * Sort order of forum posts
 * 
 * @see https://discord.com/developers/docs/resources/channel#channel-object-sort-order-types
 */
export enum DiscordSortOrderTypes {
    LATEST_ACTIVITY = 0,
    CREATION_DATE = 1,
}

/**
 * The types of Discord forum layouts 
 * 
 * @see https://discord.com/developers/docs/resources/channel#channel-object-forum-layout-types
 */
export enum DiscordForumLayoutTypes {
    NOT_SET = 0,
    LIST_VIEW = 1,
    GALLERY_VIEW = 2,
}

/**
 * Represents a message in a Discord channel. See DiscordMessageTypes for a list of all message types.
 * 
 * @see https://discord.com/developers/docs/resources/channel#message-object-message-structure
 */
export type DiscordMessage = {
    id: string;
    channel_id: string;
    author: DiscordUser;
    content: string;
    timestamp: string;
    edited_timestamp: string;
    tts: boolean;
    mention_everyone: boolean;
    mentions: DiscordUser[];
    mention_roles: DiscordRoleTags[];
    mention_channels?: DiscordChannelMention[];
    attachments: DiscordAttachment[];
    embeds: DiscordEmbed[];
    reactions?: DiscordReaction[];
    nonce?: string;
    pinned: boolean;
    webhook_id?: string;
    type: DiscordMessageTypes;
    activity?: DiscordMessageActivity;
    application?: DiscordApplication;
    application_id?: string;
    message_reference?: DiscordMessageReference;
    flags?: number;
    referenced_message?: DiscordMessage;
    interaction?: DiscordMessageInteraction;
    thread?: DiscordChannel;
    components?: DiscordMessageComponent[];
    sticker_items?: DiscordSticker[];
    stickers?: DiscordSticker[];
    position?: number;
    role_subscription_data?: DiscordRoleSubscriptionData;
}

/**
 * The type of Discord message (e.g. DEFAULT, RECIPIENT_ADD, etc.)
 * 
 * @see https://discord.com/developers/docs/resources/channel#message-object-message-types
 */
export enum DiscordMessageTypes {
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    USER_JOIN = 7,
    GUILD_BOOST = 8,
    GUILD_BOOST_TIER_1 = 9,
    GUILD_BOOST_TIER_2 = 10,
    GUILD_BOOST_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
    THREAD_CREATED = 18,
    REPLY = 19,
    CHAT_INPUT_COMMAND = 20,
    THREAD_STARTER_MESSAGE = 21,
    GUILD_INVITE_REMINDER = 22,
    CONTEXT_MENU_COMMAND = 23,
    AUTO_MODERATION_ACTION = 24,
    ROLE_SUBSCRIPTION_PURCHASE = 25,
    INTERACTION_PREMIUM_UPSELL = 26,
    STAGE_START = 27,
    STAGE_END = 28,
    STAGE_SPEAKER = 29,
    STAGE_TOPIC = 31,
    GUILD_APPLICATION_PREMIUM_SUBSCRIPTION = 32,
}

/**
 * Indicates the type of message activity.
 * 
 * @see https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure
 */
export type DiscordMessageActivity = {
    type: DiscordMessageActivityTypes;
    party_id?: string;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#message-object-message-activity-types
 */
export enum DiscordMessageActivityTypes {
    JOIN = 1,
    SPECTATE = 2,
    LISTEN = 3,
    JOIN_REQUEST = 5,
}

/**
 * @see https://discord.com/developers/docs/resources/channel#message-object-message-flags
 */
export enum DiscordMessageFlags {
    CROSSPOSTED = 1 << 0,
    IS_CROSSPOST = 1 << 1,
    SUPPRESS_EMBEDS = 1 << 2,
    SOURCE_MESSAGE_DELETED = 1 << 3,
    URGENT = 1 << 4,
    HAS_THREAD = 1 << 5,
    EPHEMERAL = 1 << 6,
    LOADING = 1 << 7,
    FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 1 << 8,
    SUPPRESS_NOTIFICATIONS = 1 << 12,
}

/**
 * @see https://discord.com/developers/docs/resources/channel#message-reference-object-message-reference-structure
 */
export type DiscordMessageReference = {
    message_id?: string;
    channel_id?: string;
    guild_id?: string;
    fail_if_not_exists?: boolean;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#followed-channel-object-followed-channel-structure
 */
export type DiscordFollowedChannel = {
    channel_id: string;
    webhook_id: string;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#reaction-object-reaction-structure
*/
export type DiscordReaction = {
    count: number;
    me: boolean;
    emoji: DiscordEmoji;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#overwrite-object-overwrite-structure
 */
export type DiscordOverwrite = {
    id: string;
    type: DiscordOverwriteTypes;
    allow: string;
    deny: string;
}

export enum DiscordOverwriteTypes {
    ROLE = 0,
    MEMBER = 1,
}

/**
 * @see https://discord.com/developers/docs/resources/channel#thread-metadata-object-thread-metadata-structure
 */
export type DiscordThreadMetadata = {
    archived: boolean;
    auto_archive_duration: number;
    archive_timestamp: string;
    locked: boolean;
    invitable?: boolean;
    created_timestamp?: string;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#thread-member-object-thread-member-structure
 */
export type DiscordThreadMember = {
    id?: string;
    user_id?: string;
    join_timestamp: string;
    flags: number;
    member?: DiscordGuildMember;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#default-reaction-object-default-reaction-structure
 */
export type DiscordDefaultReactionEmoji = {
    emoji_id?: string;
    emoji_name?: string;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#forum-tag-object-forum-tag-structure
 */
export type DiscordForumTag = {
    id: string;
    name: string;
    moderated: boolean;
    emoji_id?: string;
    emoji_name?: string;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#embed-object-embed-structure
 */
export type DiscordEmbed = {
    title?: string;
    type?: DiscordEmbedTypes;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: DiscordEmbedFooter;
    image?: DiscordEmbedImage;
    thumbnail?: DiscordEmbedThumbnail;
    video?: DiscordEmbedVideo;
    provider?: DiscordEmbedProvider;
    author?: DiscordEmbedAuthor;
    fields?: DiscordEmbedField[];
}

/**
 * @see https://discord.com/developers/docs/resources/channel#embed-object-embed-types
 */
export enum DiscordEmbedTypes {
    RICH = "rich",
    IMAGE = "image",
    VIDEO = "video",
    GIFV = "gifv",
    ARTICLE = "article",
    LINK = "link",
}

/**
 * @see https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure
 */
export type DiscordEmbedThumbnail = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure
 */
export type DiscordEmbedVideo = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#embed-object-embed-image-structure
 */
export type DiscordEmbedImage = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#embed-object-embed-provider-structure
 */
export type DiscordEmbedProvider = {
    name?: string;
    url?: string;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#embed-object-embed-author-structure
 */
export type DiscordEmbedAuthor = {
    name: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure
 */
export type DiscordEmbedFooter = {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure
 */
export type DiscordEmbedField = {
    name: string;
    value: string;
    inline?: boolean;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#attachment-object-attachment-structure
 */
export type DiscordAttachment = {
    id: string;
    filename: string;
    description?: string;
    content_type?: string;
    size: number;
    url: string;
    proxy_url: string;
    height?: number;
    width?: number;
    ephemeral?: boolean;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mention-types
 */
export type DiscordChannelMention = {
    id: string;
    guild_id: string;
    type: DiscordChannelTypes;
    name: string;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mentions-structure
 */
export type DiscordAllowedMentions = {
    parse: string[];
    roles: string[];
    users: string[];
    replied_user: boolean;
}

/**
 * @see https://discord.com/developers/docs/resources/channel#role-subscription-data-object-role-subscription-data-object-structure
 */
export type DiscordRoleSubscriptionData = {
    role_subscription_listing_id: string;
    tier_name: string;
    total_months_subscribed: number;
    is_renewal: boolean;
}