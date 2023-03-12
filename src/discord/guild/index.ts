import { DiscordChannel } from "../channel";
import { DiscordEmoji } from "../emoji";
import { DiscordRole } from "../permissions";
import { DiscordSticker } from "../sticker";
import { DiscordUser } from "../../user";

export type DiscordGuild = {
    id: string;
    name: string;
    icon?: string;
    icon_hash?: string;
    splash?: string;
    discovery_splash?: string;
    owner?: boolean;
    owner_id: string;
    permissions?: string;
    region: string;
    afk_channel_id?: string;
    afk_timeout: number;
    widget_enabled?: boolean;
    widget_channel_id?: number;
    verification_level: DiscordVerificationLevel;
    default_message_notifications: DiscordDefaultMessageNotificationLevel;
    explicit_content_filter: DiscordExplicitContentFilterLevel;
    roles: DiscordRole[];
    emojis: DiscordEmoji[];
    features: string[];
    mfa_level: DiscordMFALevel; 
    application_id?: string;
    system_channel_id?: string;
    system_channel_flags: DiscordSystemChannelFlags;
    rules_channel_id?: string;
    max_presences?: number;
    max_members: number;
    vanity_url_code?: string;
    description?: string;
    banner?: string;
    premium_tier: DiscordPremiumTier;
    premium_subscription_count?: number;
    preferred_locale: string;
    public_updates_channel_id?: string;
    max_video_channel_users?: number;
    approximate_member_count?: number;
    approximate_presence_count?: number;
    welcome_screen?: DiscordWelcomeScreen;
    nsfw_level: DiscordNSFWLevel;
    stickers?: DiscordSticker[];
    premium_progress_bar_enabled: boolean;
}

export enum DiscordDefaultMessageNotificationLevel {
    ALL_MESSAGES = 0,
    ONLY_MENTIONS = 1,
}

export enum DiscordExplicitContentFilterLevel {
    DISABLED = 0,
    MEMBERS_WITHOUT_ROLES = 1,
    ALL_MEMBERS = 2,
}

export enum DiscordMFALevel {
    NONE = 0,
    ELEVATED = 1,
}

export enum DiscordVerificationLevel {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    VERY_HIGH = 4,
}

export enum DiscordNSFWLevel {
    DEFAULT = 0,
    EXPLICIT = 1,
    SAFE = 2,
    AGE_RESTRICTED = 3,
}

export enum DiscordPremiumTier {
    NONE = 0,
    TIER_1 = 1,
    TIER_2 = 2,
    TIER_3 = 3,
}

export enum DiscordSystemChannelFlags {
    SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
    SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
    SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
    SUPPRESS_JOIN_NOTIFICATION_REPLIES = 1 << 3,
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS = 1 << 4,
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS_REPLIES = 1 << 5,
}

export type DiscordGuildPreview = {
    id: string;
    name: string;
    icon?: string;
    splash?: string;
    discovery_splash?: string;
    emojis: DiscordEmoji[];
    features: string[];
    approximate_member_count: number;
    approximate_presence_count: number;
    description?: string;
    stickers: DiscordSticker[];
}

export type DiscordGuildWidgetSettings = {
    enabled: boolean;
    channel_id?: string;
}

export type DiscordGuildWidget = {
    id: string;
    name: string;
    instant_invite?: string;
    channels: DiscordChannel[];
    members: DiscordUser[];
    presence_count: number;
}

export type DiscordGuildMember = {
    user?: DiscordUser;
    nick?: string;
    avatar?: string;
    roles: string[];
    joined_at: string;
    premium_since?: string;
    deaf: boolean;
    mute: boolean;
    flags: number;
    pending?: boolean;
    permissions?: string;
    communications_disabled_until?: string;
}

export enum DiscordGuildMemberFlags {
    DID_REJOIN = 1 << 0,
    COMPLETED_ONBOARDING = 1 << 1,
    BYPASSES_VERIFICATION = 1 << 2,
    STARTED_ONBOARDING = 1 << 3,
}

export type DiscordIntegration = {
    id: string;
    name: string;
    type: string;
    enabled: boolean;
    syncing?: boolean;
    role_id?: string;
    enable_emoticons?: boolean;
    expire_behavior: DiscordIntegrationExpireBehavior;
    expire_grace_period: number;
    user?: DiscordUser;
    account: DiscordIntegrationAccount;
    synced_at: string;
    subscriber_count?: number;
    revoked?: boolean;
    application?: DiscordIntegrationApplication;
    scopes: string[];
}

export enum DiscordIntegrationExpireBehavior {
    REMOVE_ROLE = 0,
    KICK = 1,
}

export type DiscordIntegrationAccount = {
    id: string;
    name: string;
}

export type DiscordIntegrationApplication = {
    id: string;
    name: string;
    icon?: string;
    description: string;
    bot?: DiscordUser;
}

export type DiscordBan = {
    reason?: string;
    user: DiscordUser;
}

export type DiscordWelcomeScreen = {
    description: string;
    welcome_channels: DiscordWelcomeScreenChannel[];
}

export type DiscordWelcomeScreenChannel = {
    channel_id: string;
    description: string;
    emoji_id?: string;
    emoji_name?: string;
}