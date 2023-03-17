import { ServerlessDiscordRouterRequestHeaders } from "./router";
import { DiscordAuthenticationVerificationFunction, DiscordInteraction } from "../discord";
import nacl from "tweetnacl";

export const createServerlessDiscordAuthorizationHandler = ({ 
    applicationPublicKey, 
}: { 
    applicationPublicKey: string, 
}) => {
    return new ServerlessDiscordAuthorizationHandler({ applicationPublicKey, verifyFunc: nacl.sign.detached.verify });
};

/**
 * Handles the authorization of Discord interactions.
 * 
 * @param applicationPublicKey The public key of the Discord application
 */
export class ServerlessDiscordAuthorizationHandler {
    private applicationPublicKey: string;
    private verifyFunc: DiscordAuthenticationVerificationFunction

    /**
     * Initializes a new ServerlessDiscordAuthorizationHandler
     * 
     * @param applicationPublicKey The public key of the Discord application
     */
    constructor ({ 
        applicationPublicKey, 
        verifyFunc 
    }: { 
        applicationPublicKey: string, 
        verifyFunc: DiscordAuthenticationVerificationFunction 
    }) {
        this.applicationPublicKey = applicationPublicKey;
        this.verifyFunc = verifyFunc;
    }

    /**
     * Returns true if the request is authorized by passing the signature check.
     * 
     * @param body Body of the request
     * @param headers Headers of the request
     * @returns true if the request is authorized
     */
    handleAuthorization(body: DiscordInteraction, headers: ServerlessDiscordRouterRequestHeaders): boolean {
        return this.verifyFunc(
            Buffer.from(headers["x-signature-timestamp"] + JSON.stringify(body)),
            Buffer.from(headers["x-signature-ed25519"], "hex"),
            Buffer.from(this.applicationPublicKey, "hex")
        );
    }
}