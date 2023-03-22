import { CommandChatInput } from "./core/command";
import { DiscordInteractionApplicationCommand, DiscordInteractionResponse, DiscordInteractionResponseTypes } from "./discord/interactions";
import { initLambdaRouter } from "./lambda/router";

describe("serverless-discord", () => {
  let applicationPublicKey: string;

  beforeEach(() => {
    if (!process.env.DISCORD_PUBLIC_KEY) {
      throw new Error("DISCORD_PUBLIC_KEY is not set.");
    }
    applicationPublicKey = process.env.DISCORD_PUBLIC_KEY;
  });

  it("should response to a basic interaction", () => {
    class HelloWorldCommand extends CommandChatInput {
      constructor() {
        super({
          name: "test",
          options: [],
        });
      }
      async handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
        console.log(interaction);
        return {
          type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: "Hello World!",
          },
        };
      }
    }
    // Initialize the router with the command and the public key of your application.
    const router = initLambdaRouter({ 
      commands: [new HelloWorldCommand()], 
      applicationPublicKey
    });
    
  });
});