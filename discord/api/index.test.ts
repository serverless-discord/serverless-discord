import { DiscordApiClient } from ".";

describe("DiscordApiClient", () => {
  it("should be able to initialize", () => {
    const apiClient = new DiscordApiClient({ token: "test" });
    expect(apiClient).toBeDefined();
  });
});