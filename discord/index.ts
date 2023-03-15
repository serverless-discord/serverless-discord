export const DISCORD_API_VERSION = 9;
export const DISCORD_API_BASE_URL = `https://discord.com/api/v${DISCORD_API_VERSION}`;
export interface DiscordAuthenticationRequestHeaders {
    "x-signature-ed25519": string;
    "x-signature-timestamp": string;
}
export * from "./application";
export * from "./channel";
export * from "./command";
export * from "./emoji";
export * from "./guild";
export * from "./interactions";
export * from "./locales";
export * from "./permissions";
export * from "./sticker";
export * from "./user";