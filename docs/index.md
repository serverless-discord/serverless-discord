[_metadata_:title]:- "serverless-discord"
[_metadata_:layout]:- "index"

> **Please note that this library is still in pre-release status and is not production-ready. We are still making large changes to the API, so please come back for a more polished project.**

Typescript library designed to facilitate the creation of serverless Discord bots with slash commands.

## Features

 * Fully typed for improved code reliability
 * Object-oriented API for ease of use
 * Integrates directly with AWS Lambda for scalable, serverless computing
 * Asynchronous handlers using SQS for efficient message processing

## Getting Started

To get started quickly and easily, we recommend using our pre-built template available at: https://github.com/serverless-discord/serverless-discord-template. This template includes all necessary dependencies and file structure to start building your own Discord bot with serverless-discord.

### Quick Start - AWS Lambda

This guide assumes that you already have an AWS account setup and a Discord application created with a bot token.

First, you will want to create your command:

```ts
// This is a simple command that replies with "Hello World!" when the command is executed.
export class HelloWorldCommand extends CommandChatInput {
  constructor() {
    super({
      name: "test",
      description: "Test command",
      options: [],
    });
  }

  async handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
    return {
      type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "Hello World!",
      },
    };
  }
}
```

This is a very basic global Discord slash command that simply responds with "Hello World!" from the slash command `/test`.

Next, you will want to register the commands with the serverless-discord router using `initLambdaRouter`. Here is
an example:

```ts
const applicationPublicKey = process.env.APPLICATION_PUBLIC_KEY;
const applicationId = process.env.APPLICATION_ID;

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const commands = [HelloWorldCommand()];
  const router = initLambdaRouter({ applicationPublicKey, applicationId, commands });
  return router.handleLambda(event);
};
```

Then just point your lambda to the lambdaHandler from above! You will need to let Discord know about
your commands so create a script to register them like the following:

```ts
import { initRegistrar } from "serverless-discord/core/register";
import { commands } from "../src";

const applicationId = process.env.DISCORD_APPLICATION_ID || "";
const botToken = process.env.DISCORD_BOT_TOKEN || "";

const commands = [HelloWorldCommand()];

const registrar = initRegistrar({ commands, applicationId, botToken });
registrar.registerAllCommands();
```

Run the script you just created to register all of the Discord commands. Once you have your lambda deployed, 
just paste it's URL (usually from an API gateway in front of it) in to the Discord developer portal.