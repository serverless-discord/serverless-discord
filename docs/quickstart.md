[_metadata_:title]:- "serverless-discord - Quickstart"
[_metadata_:layout]:- "quickstart"

# Quick Start - AWS Lambda

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

## Adding Asynchronous Commands

Asynchronous commands returns a response immediately to let Discord know the request has been received. This HTTP handler lambda also adds a message to an SQS queue. The SQS queue has a trigger for another lambda that has 15 minutes to send Discord an update on the interaction.

To get started add a new command like this in your project:

```ts
export class HelloWorldCommandAsync extends CommandChatInputAsync {
  constructor() {
    super({
      name: "testasync",
      description: "Test async command",
      options: [],
    });
  }

  async handleInteractionAsync(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponseData> {
    return { content: "Hello from async land!" };
  }
}
```

Then you need to make sure to pass the `queueUrl` when calling `initLambdaRouter` in your lambda function. 

```ts
// Initialize your command
const commands = [new HelloWorldCommandAsync()]
// Initialize the router that will handle APIGatewayEvents
const router = initLambdaRouter({ applicationPublicKey, applicationId, commands, queueUrl, logLevel: "debug" });
```