import { DiscordApi } from ".";

describe("DiscordApi.apiRequest", () => {
    it("should return a response", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: () => Promise.resolve([
                {
                    id: "123",
                }
            ])
        });
        const response = await DiscordApi.apiRequest({
            path: "/test",
            method: "GET"
        });
        expect(response.json()).resolves.toEqual([
            {
                id: "123"
            }
        ]);
    });
});