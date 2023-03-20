import { DiscordTeam } from './teams';
import { DiscordUser } from './user';

/**
 * DiscordApplicationInstallParams is the install parameters for a Discord application.
 * 
 * @param id the id of the app
 * @param name the name of the app
 * @param icon the icon hash of the app
 * @param description the description of the app
 * @param rpc_origins the rpc origins of the app
 * @param bot_public whether the bot is public or not
 * @param bot_require_code_grant whether the bot requires code grant or not
 * @param terms_of_service_url the terms of service url of the app
 * @param privacy_policy_url the privacy policy url of the app
 * @param owner the owner of the app
 * @param summary the summary of the app
 * @param verify_key the verify key of the app
 * @param team the team of the app
 * @param guild_id the guild id of the app
 * @param primary_sku_id the primary sku id of the app
 * @param slug the slug of the app
 * @param cover_image the cover image hash of the app
 * @param flags the flags of the app
 * @param install_params the install parameters of the app
 * @param custom_install_url the custom install url of the app
 * @param role_connections_verification_url the role connections verification url of the app
 * 
 * @see https://discord.com/developers/docs/resources/application#application-object 
 */
export interface DiscordApplication {
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

export class DiscordApplication implements DiscordApplication {
    
    constructor({
        id,
        name,
        description,
        summary,
        verify_key,
        flags,
    }: {
        id: string,
        name: string,
        description: string,
        summary: string,
        verify_key: string,
        flags: number,
    }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.summary = summary;
        this.verify_key = verify_key;
        this.flags = flags;
    }
}


/**
 * DiscordApplicationFlags is the flags for a Discord application.
 * 
 * @see https://discord.com/developers/docs/resources/application#application-object-application-flags 
 */
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

/**
 * The install parameters for a Discord application.
 * 
 * @see https://discord.com/developers/docs/resources/application#application-object-application-flags
 */
export type DiscordApplicationInstallParams = {
    scopes: string[];
    permissions: string;
}