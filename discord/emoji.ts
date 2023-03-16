import { DiscordUser } from "./user";

/**
 * @see https://discord.com/developers/docs/resources/emoji#emoji-object
 */
export type DiscordEmoji = {
    id: string;
    name: string;
    roles?: number[];
    user?: DiscordUser;
    require_colons?: boolean;
    managed?: boolean;
    animated?: boolean;
    available?: boolean;
}