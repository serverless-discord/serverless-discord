import { initRouter, ServerlessDiscordCommandChatInput } from "../../core";
import { DiscordInteractionResponse, DiscordInteractionResponseTypes } from "../../discord";
import * as http from "http";

const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY || "123";

class HelloWorldCommand extends ServerlessDiscordCommandChatInput {
    constructor() {
        super({
            name: "hello-world",
            options: [],
        });
    }

    async handleInteraction(): Promise<DiscordInteractionResponse> {
        return {
            type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "Hello World!",
            },
        };
    }
}

// Create a router and pass in the commands you want to handle
const discordRouter = initRouter({
    commands: [new HelloWorldCommand()],
    applicationPublicKey: DISCORD_PUBLIC_KEY,
});

// Create a simple HTTP server
const server = http.createServer((req, res) => {
    let body = "";
    req.on("data", (data) => {
        body += data;
    });

    req.on("end", async () => {
        // Handle the request
        const result = await discordRouter.handle({
            interaction: JSON.parse(body), 
            requestHeaders: req.headers,
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});