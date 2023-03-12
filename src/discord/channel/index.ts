import { DiscordApplication } from "../application";
import { DiscordEmoji } from "../emoji";
import { DiscordGuildMember } from "../guild";
import { DiscordMessageInteraction } from "../interactions";
import { DiscordMessageComponent } from "../interactions/messageComponents";
import { DiscordRoleTags } from "../permissions";
import { DiscordSticker } from "../sticker";
import { DiscordUser } from "../../user";

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

export enum DiscordVideoQualityModes {
    AUTO = 1,
    FULL = 2,
}

export enum DiscordSortOrderTypes {
    LATEST_ACTIVITY = 0,
    CREATION_DATE = 1,
}

export enum DiscordForumLayoutTypes {
    NOT_SET = 0,
    LIST_VIEW = 1,
    GALLERY_VIEW = 2,
}

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

export type DiscordMessageActivity = {
    type: DiscordMessageActivityTypes;
    party_id?: string;
}

export enum DiscordMessageActivityTypes {
    JOIN = 1,
    SPECTATE = 2,
    LISTEN = 3,
    JOIN_REQUEST = 5,
}

export type DiscordMessageReference = {
    message_id?: string;
    channel_id?: string;
    guild_id?: string;
    fail_if_not_exists?: boolean;
}

export type DiscordFollowedChannel = {
    channel_id: string;
    webhook_id: string;
}

export type DiscordReaction = {
    count: number;
    me: boolean;
    emoji: DiscordEmoji;
}

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

export type DiscordThreadMetadata = {
    archived: boolean;
    auto_archive_duration: number;
    archive_timestamp: string;
    locked: boolean;
    invitable?: boolean;
    created_timestamp?: string;
}

export type DiscordThreadMember = {
    id?: string;
    user_id?: string;
    join_timestamp: string;
    flags: number;
    member?: DiscordGuildMember;
}

export type DiscordDefaultReactionEmoji = {
    emoji_id?: string;
    emoji_name?: string;
}

export type DiscordForumTag = {
    id: string;
    name: string;
    moderated: boolean;
    emoji_id?: string;
    emoji_name?: string;
}

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

export enum DiscordEmbedTypes {
    RICH = "rich",
    IMAGE = "image",
    VIDEO = "video",
    GIFV = "gifv",
    ARTICLE = "article",
    LINK = "link",
}

export type DiscordEmbedThumbnail = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

export type DiscordEmbedVideo = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

export type DiscordEmbedImage = {
    url?: string;
    proxy_url?: string;
    height?: number;
    width?: number;
}

export type DiscordEmbedProvider = {
    name?: string;
    url?: string;
}

export type DiscordEmbedAuthor = {
    name: string;
    url?: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

export type DiscordEmbedFooter = {
    text: string;
    icon_url?: string;
    proxy_icon_url?: string;
}

export type DiscordEmbedField = {
    name: string;
    value: string;
    inline?: boolean;
}

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

export type DiscordChannelMention = {
    id: string;
    guild_id: string;
    type: DiscordChannelTypes;
    name: string;
}

export type DiscordAllowedMentions = {
    parse: string[];
    roles: string[];
    users: string[];
    replied_user: boolean;
}

export type DiscordRoleSubscriptionData = {
    role_subscription_listing_id: string;
    tier_name: string;
    total_months_subscribed: number;
    is_renewal: boolean;
}