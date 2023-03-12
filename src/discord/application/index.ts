import { DiscordTeam } from '../teams';
import { DiscordUser } from '../../user';

export type DiscordApplication = {
    id: string;
    name: string;
    icon?: string;
    description: string;
    rpc_origins?: string[];
    bot_public?: boolean;
    bot_require_code_grant?: boolean;
    terms_of_service_url?: string;
    privacy_policy_url?: string;
    owner?: DiscordUser;
    summary: string;
    verify_key: string;
    team?: DiscordTeam;
    guild_id?: string;
    primary_sku_id?: string;
    slug?: string;
    cover_image?: string;
    flags: number;
    install_params?: DiscordApplicationInstallParams;
    custom_install_url?: string;
    role_connections_verification_url?: string;
}

export enum DiscordApplicationFlags {
    GATEWAY_PRESENCE = 1 << 12,
    GATEWAY_PRESENCE_LIMITED = 1 << 13,
    GATEWAY_GUILD_MEMBERS = 1 << 14,
    GATEWAY_GUILD_MEMBERS_LIMITED = 1 << 15,
    VERIFICATION_PENDING_GUILD_LIMIT = 1 << 16,
    EMBEDDED = 1 << 17,
    GATEWAY_MESSAGE_CONTENT = 1 << 18,
    GATEWAY_MESSAGE_CONTENT_LIMITED = 1 << 19,
    APPLICATION_COMMAND_BADGES = 1 << 23,
}

export type DiscordApplicationInstallParams = {
    scopes: string[];
    permissions: string;
}