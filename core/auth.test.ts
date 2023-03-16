import { DiscordInteractionPing } from "../discord";
import { ServerlessDiscordAuthorizationHandler } from "./auth";
import { ServerlessDiscordRouterRequestHeaders } from "./router";

describe("ServerlessDiscordAuthorizationHandler", () => {
    let mockVerifyFunc: jest.Mock;

    beforeEach(() => {
        mockVerifyFunc = jest.fn();
    });

    it("should be able to handle authorization", () => {
        mockVerifyFunc.mockReturnValue(true);
        const handler = new ServerlessDiscordAuthorizationHandler({ applicationPublicKey: "test", verifyFunc: mockVerifyFunc });
        const body = new DiscordInteractionPing({ id: "123", application_id: "123", token: "123", version: 1 });
        const headers: ServerlessDiscordRouterRequestHeaders = {
            "x-signature-ed25519": "123",
            "x-signature-timestamp": "123",
        };
        const result = handler.handleAuthorization(body, headers)
        expect(mockVerifyFunc).toBeCalledWith(
            Buffer.from(headers["x-signature-timestamp"] + JSON.stringify(body)),
            Buffer.from(headers["x-signature-ed25519"], "hex"),
            Buffer.from("test", "hex")
        );
        expect(result).toBe(true);
    });

    it("should be able to handle invalid authorization", () => {
        mockVerifyFunc.mockReturnValue(false);
        const handler = new ServerlessDiscordAuthorizationHandler({ applicationPublicKey: "test", verifyFunc: mockVerifyFunc });
        const body = new DiscordInteractionPing({ id: "123", application_id: "123", token: "123", version: 1 });
        const headers: ServerlessDiscordRouterRequestHeaders = {
            "x-signature-ed25519": "123",
            "x-signature-timestamp": "123",
        };
        const result = handler.handleAuthorization(body, headers)
        expect(mockVerifyFunc).toBeCalledWith(
            Buffer.from(headers["x-signature-timestamp"] + JSON.stringify(body)),
            Buffer.from(headers["x-signature-ed25519"], "hex"),
            Buffer.from("test", "hex")
        );
        expect(result).toBe(false);
    });
});