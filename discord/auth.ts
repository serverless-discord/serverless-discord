export interface DiscordAuthenticationRequestHeaders {
    "x-signature-ed25519": string;
    "x-signature-timestamp": string;
}

export function instanceOfDiscordAuthenticationRequestHeaders(object: any): object is DiscordAuthenticationRequestHeaders {
    return "x-signature-ed25519" in object && "x-signature-timestamp" in object;
}