import { ServerlessDiscordRouterRequestHeaders } from "./router";
import nacl from "tweetnacl";
import { DiscordAuthenticationVerificationFunction } from "../discord/auth";
import { DiscordInteraction } from "../discord/interactions";
import pino from "pino";
import { initLogger } from "./logging";

export const createAuthHandler = ({ 
  applicationPublicKey, 
}: { 
    applicationPublicKey: string, 
}) => {
  const logHandler = initLogger({ logLevel: "info" }).child({ class: "AuthHandler" });
  return new AuthHandler({ applicationPublicKey, verifyFunc: nacl.sign.detached.verify, logHandler });
};

/**
 * Handles the authorization of Discord interactions.
 * 
 * @param applicationPublicKey The public key of the Discord application
 */
export class AuthHandler {
  private applicationPublicKey: string;
  private verifyFunc: DiscordAuthenticationVerificationFunction;
  private logHandler: pino.Logger;

  /**
     * Initializes a new ServerlessDiscordAuthorizationHandler
     * 
     * @param applicationPublicKey The public key of the Discord application
     */
  constructor ({ 
    applicationPublicKey, 
    verifyFunc,
    logHandler
  }: { 
        applicationPublicKey: string, 
        verifyFunc: DiscordAuthenticationVerificationFunction,
        logHandler: pino.Logger
    }) {
    this.applicationPublicKey = applicationPublicKey;
    this.verifyFunc = verifyFunc;
    this.logHandler = logHandler;
  }

  /**
     * Returns true if the request is authorized by passing the signature check.
     * 
     * @param body Body of the request
     * @param headers Headers of the request
     * @returns true if the request is authorized
     */
  handleAuthorization({ body, headers } : { body: DiscordInteraction, headers: ServerlessDiscordRouterRequestHeaders }): boolean {
    const timestamp = headers["x-signature-timestamp"];
    const signature = headers["x-signature-ed25519"];
    const rawBody = JSON.stringify(body);
    this.logHandler.debug(`Verifying signature of request with timestamp ${timestamp} and signature ${signature}`);
    const valid = this.verifyFunc(
      Buffer.from(`${timestamp}${rawBody}`),
      Buffer.from(signature, "hex"),
      Buffer.from(this.applicationPublicKey, "hex")
    );
    this.logHandler.debug(`Signature verification result: ${valid}`);
    return valid;
  }
}