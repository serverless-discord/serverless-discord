import * as nacl from "tweetnacl";
import { ServerlessDiscordRouterRequestHeaders } from ".";
import { DiscordInteraction } from "./discord";

export class ServerlessDiscordAuthorizationHandler {
    private applicationPublicKey: string;

    constructor ({ applicationPublicKey }: { applicationPublicKey: string }) {
        this.applicationPublicKey = applicationPublicKey;
    }

    handleAuthorization(body: DiscordInteraction, headers: ServerlessDiscordRouterRequestHeaders): boolean {
        return nacl.sign.detached.verify(
            Buffer.from(headers["x-signature-timestamp"] + JSON.stringify(body)),
            Buffer.from(headers["x-signature-ed25519"], "hex"),
            Buffer.from(this.applicationPublicKey, "hex")
        );
    }
}