import { mock, MockProxy } from "jest-mock-extended";
import pino from "pino";
import { DiscordInteractionPing } from "../discord/interactions";
import { createAuthHandler, AuthHandler } from "./auth";
import { ServerlessDiscordRouterRequestHeaders } from "./router";

describe("ServerlessDiscordAuthorizationHandler", () => {
  let mockVerifyFunc: jest.Mock;
  let logHandler: MockProxy<pino.Logger>;

  beforeEach(() => {
    mockVerifyFunc = jest.fn();
    logHandler = mock<pino.Logger>();
  });

  it("should be able to handle authorization", () => {
    mockVerifyFunc.mockReturnValue(true);
    const handler = new AuthHandler({ applicationPublicKey: "test", verifyFunc: mockVerifyFunc, logHandler });
    const body = new DiscordInteractionPing({ id: "123", application_id: "123", token: "123", version: 1 });
    const headers: ServerlessDiscordRouterRequestHeaders = {
      "x-signature-ed25519": "123",
      "x-signature-timestamp": "123",
    };
    const result = handler.handleAuthorization({ body, headers });
    expect(mockVerifyFunc).toBeCalledWith(
      Buffer.from(headers["x-signature-timestamp"] + JSON.stringify(body)),
      Buffer.from(headers["x-signature-ed25519"], "hex"),
      Buffer.from("test", "hex")
    );
    expect(result).toBe(true);
  });

  it("should be able to handle invalid authorization", () => {
    mockVerifyFunc.mockReturnValue(false);
    const handler = new AuthHandler({ applicationPublicKey: "test", verifyFunc: mockVerifyFunc, logHandler });
    const body = new DiscordInteractionPing({ id: "123", application_id: "123", token: "123", version: 1 });
    const headers: ServerlessDiscordRouterRequestHeaders = {
      "x-signature-ed25519": "123",
      "x-signature-timestamp": "123",
    };
    const result = handler.handleAuthorization({ body, headers });
    expect(mockVerifyFunc).toBeCalledWith(
      Buffer.from(headers["x-signature-timestamp"] + JSON.stringify(body)),
      Buffer.from(headers["x-signature-ed25519"], "hex"),
      Buffer.from("test", "hex")
    );
    expect(result).toBe(false);
  });
});

describe("createServerlessDiscordAuthorizationHandler", () => {
  it("should be able to create a default handler", () => {
    const authHandler = createAuthHandler({ applicationPublicKey: "test" });
    expect(authHandler).toBeInstanceOf(AuthHandler);
  });
});