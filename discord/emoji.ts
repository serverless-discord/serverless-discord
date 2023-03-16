import { DiscordUser } from "./user";

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