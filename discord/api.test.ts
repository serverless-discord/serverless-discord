import { discordReq } from "./api";

describe("discordReq", () => {
    it("should return a response", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
            json: () => Promise.resolve([
                {
                    id: "123",
                    application_id: "123",
                    name: "test",
                    description: "test",
                    options: []
                }
            ])
        });
        const response = await discordReq({
            path: "/test",
            method: "GET"
        });
        expect(response).toBeDefined();
    });
});