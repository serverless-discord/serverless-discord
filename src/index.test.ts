import { ServerlessDiscordRouter } from ".";
import { DiscordInteractionPing } from "./discord/interactions";

describe("ServerlessDiscordRouter", () => {
    it("should handle ping", () => {
        const router = new ServerlessDiscordRouter({
            commands: [],
        });
        const interaction = new DiscordInteractionPing({ 
            id: "123",
            type: 1,
            application_id: "123",
            token: "123",
            version: 1,
        });
        const response = router.handleInteraction(interaction);
        expect(response).toEqual({ type: 1 });
    });
});
        