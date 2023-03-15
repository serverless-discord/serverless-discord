import { instanceOfDiscordAuthenticationRequestHeaders } from ".";

describe("instanceOfDiscordAuthenticationRequestHeaders", () => {
    it("should return true for valid headers", () => {
        const headers = {
            "content-type": "application/json",
            "x-signature-ed25519": "123",
            "x-signature-timestamp": "123",
        };
        expect(instanceOfDiscordAuthenticationRequestHeaders(headers)).toBe(true);
    });
    it("should return false for invalid headers", () => {
        const headers = {
            "content-type": "application/json",
        };
        expect(instanceOfDiscordAuthenticationRequestHeaders(headers)).toBe(false);
    });
    it("should return false for empty headers", () => {
        const headers = {};
        expect(instanceOfDiscordAuthenticationRequestHeaders(headers)).toBe(false);
    });
});