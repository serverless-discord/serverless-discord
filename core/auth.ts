import * as nacl from "tweetnacl";
import { ServerlessDiscordRouterRequestHeaders } from "./router";
import { DiscordInteraction } from "../discord";

/**
 * Handles the authorization of Discord interactions.
 * 
 * @param applicationPublicKey The public key of the Discord application
 */
export class ServerlessDiscordAuthorizationHandler {
    private applicationPublicKey: string;

    /**
     * Initializes a new ServerlessDiscordAuthorizationHandler
     * 
     * @param applicationPublicKey The public key of the Discord application
     */
    constructor ({ applicationPublicKey }: { applicationPublicKey: string }) {
        this.applicationPublicKey = applicationPublicKey;
    }

    /**
     * Returns true if the request is authorized by passing the signature check.
     * 
     * @param body Body of the request
     * @param headers Headers of the request
     * @returns true if the request is authorized
     */
    handleAuthorization(body: DiscordInteraction, headers: ServerlessDiscordRouterRequestHeaders): boolean {
        return nacl.sign.detached.verify(
            Buffer.from(headers["x-signature-timestamp"] + JSON.stringify(body)),
            Buffer.from(headers["x-signature-ed25519"], "hex"),
            Buffer.from(this.applicationPublicKey, "hex")
        );
    }
}