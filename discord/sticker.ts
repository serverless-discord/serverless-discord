import { DiscordUser } from "./user";

/**
 * @see https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-structure
 */
export type DiscordSticker = {
    id: string;
    pack_id?: string;
    name: string;
    description: string;
    tags?: string;
    asset?: string;
    type: DiscordStickerTypes;
    format_type: DiscordStickerFormatTypes;
    available?: boolean;
    guild_id?: string;
    user?: DiscordUser;
    sort_value?: number;
}

/**
 * @see https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-types
 */
export enum DiscordStickerTypes {
    STANDARD = 1,
    GUILD = 2,
}

/**
 * @see https://discord.com/developers/docs/resources/sticker#sticker-object-sticker-format-types
 */
export enum DiscordStickerFormatTypes {
    PNG = 1,
    APNG = 2,
    LOTTIE = 3,
    GIF = 4,
}

/**
 * @see https://discord.com/developers/docs/resources/sticker#sticker-item-object-sticker-item-structure
 */
export type DiscordStickerItem = {
    id: string;
    name: string;
    format_type: DiscordStickerFormatTypes;
}

/**
 * @see https://discord.com/developers/docs/resources/sticker#sticker-pack-object-sticker-pack-structure
 */
export type DiscordStickerPack = {
    id: string;
    stickers: DiscordSticker[];
    name: string;
    sku_id: string;
    cover_sticker_id?: string;
    description: string;
    banner_asset_id?: string;
}