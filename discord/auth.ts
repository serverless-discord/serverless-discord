/**
 * HTTP Headers that Discord sends with each request
 * 
 * @param x-signature-ed25519 The signature of the request
 * @param x-signature-timestamp The timestamp of the request
 */
export interface DiscordAuthenticationRequestHeaders {
    "x-signature-ed25519": string;
    "x-signature-timestamp": string;
}

/**
 * Returns true if the object is a DiscordAuthenticationRequestHeaders
 * 
 * @param object Any object
 * 
 * @returns true if the object is a DiscordAuthenticationRequestHeaders
 */
export function instanceOfDiscordAuthenticationRequestHeaders(object: any): object is DiscordAuthenticationRequestHeaders {
  return "x-signature-ed25519" in object && "x-signature-timestamp" in object;
}

export type DiscordAuthenticationVerificationFunction = (msg: Uint8Array, sig: Uint8Array, key: Uint8Array) => boolean;
