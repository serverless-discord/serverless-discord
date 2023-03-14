import { DiscordIntegration } from "../guild";
import { DiscordLocales } from "../locales";

export type DiscordUser = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    bot?: boolean;
    system?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: DiscordLocales;
    verified?: boolean;
    email?: string;
    flags?: DiscordUserFlags;
    premium_type?: DiscordPremiumTypes;
    public_flags?: DiscordUserFlags;
};

export enum DiscordUserFlags {
    STAFF = 1 << 0,
    PARTNER = 1 << 1,
    HYPESQUAD = 1 << 2,
    BUG_HUNTER_LEVEL_1 = 1 << 3,
    HYPESQUAD_ONLINE_HOUSE_1 = 1 << 6,
    HYPESQUAD_ONLINE_HOUSE_2 = 1 << 7,
    HYPESQUAD_ONLINE_HOUSE_3 = 1 << 8,
    PREMIUM_EARLY_SUPPORTER = 1 << 9,
    TEAM_PSEUDO_USER = 1 << 10,
    BUG_HUNTER_LEVEL_2 = 1 << 14,
    VERIFIED_BOT = 1 << 16,
    VERIFIED_DEVELOPER = 1 << 17,
    CERTIFIED_MODERATOR = 1 << 18,
    BOT_HTTP_INTERACTIONS = 1 << 19,
    ACTIVE_DEVELOPER = 1 << 22,
}

export enum DiscordPremiumTypes {
    NONE = 0,
    NITRO_CLASSIC = 1,
    NITRO = 2,
    NITRO_BASIC = 3,
}

export type DiscordUserConnection = {
    id: string;
    name: string;
    type: string;
    revoked?: boolean;
    integrations?: DiscordIntegration[];
    verified: boolean;
    friend_sync: boolean;
    show_activity: boolean;
    two_way_link: boolean;
    visibility: DiscordUserConnectionVisibility;
}

export enum DiscordUserConnectionVisibility {
    NONE = 0,
    EVERYONE = 1,
}

export type ApplicationRoleConnection = {
    platform_name?: string;
    platform_username?: string;
    metadata: any;
}