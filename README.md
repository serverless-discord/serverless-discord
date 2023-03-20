# serverless-discord

**Please note that this library is still in pre-release status and is not production-ready. We are still making large changes to the API, so please come back for a more polished project.**

Typescript library designed to facilitate the creation of serverless Discord bots with slash commands. Check it out on [npm](https://www.npmjs.com/package/serverless-discord).

## Quickstart - AWS Lambda 


To get started, install the serverless-discord package from npm:

```
npm install serverless-discord
```

Next, create a simple command like this one:

```
import { ServerlessDiscordCommandChatInput, DiscordInteractionApplicationCommand, DiscordInteractionResponse, DiscordInteractionResponseTypes } from "serverless-discord";
import { initLambdaRouter } from "serverless-discord-lambda";

// You can get this from the Discord Developer Portal
const DISCORD_PUBLIC_KEY = process.env?.DISCORD_PUBLIC_KEY || "";

class HelloWorldCommand extends ServerlessDiscordCommandChatInput {
    constructor() {
        super({
            name: "test",
            options: [],
        });
    }
    async handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
        return {
            type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "Hello World!",
            },
        }
    }
}

const router = initLambdaRouter({ commands: [new HelloWorldCommand()], applicationPublicKey: DISCORD_PUBLIC_KEY });
```

Replace `DISCORD_PUBLIC_KEY` with a secure credential handling method of your choice, such as an environment variable. You can obtain this key by creating a new bot on the Discord Developer Portal. The key is necessary to authenticate requests and ensure that they are coming from Discord servers.

You can now host this on Lambda behind an ApiGateway to create a fully functioning Discord bot.

For a complete example that can be used as a template, see [here](https://github.com/themcaffee/serverless-discord-template).

For more information about the Lambda integration, see [serverless-discord-lambda](https://github.com/themcaffee/serverless-discord-lambda).

## Quickstart - Roll your own 

It is also possible to run `serverless-discord` on it's own to handle routing in any way you please.

To get started, install the serverless-discord npm package:

```
npm install serverless-discord
```

```
import { ServerlessDiscordCommandChatInput, DiscordInteractionApplicationCommand, DiscordInteractionResponse, DiscordInteractionResponseTypes, initRouter } from "serverless-discord";

// You can get this from the Discord Developer Portal
const DISCORD_PUBLIC_KEY = process.env?.DISCORD_PUBLIC_KEY || "";

class HelloWorldCommand extends ServerlessDiscordCommandChatInput {
    constructor() {
        super({
            name: "test",
            options: [],
        });
    }
    async handleInteraction(interaction: DiscordInteractionApplicationCommand): Promise<DiscordInteractionResponse> {
        return {
            type: DiscordInteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "Hello World!",
            },
        }
    }
}

const router = initRouter({ commands: [new HelloWorldCommand()], applicationPublicKey: DISCORD_PUBLIC_KEY });
// Get an interaction and request headers
const result = router.handleInteraction(interaction, requestHeaders);
// Return the result back to the Discord request in any you like
```

## Development

### Linting

Linting is enforced and run on every pull request. Run the following command to lint the code:

```
npm run lint
```

### Testing

Tests are run on every pull request and must pass before merging. Run the following command to execute the tests:

```
npm run tests
```

### Building

The Typescript files are built with sourcemaps for the npm package. Run the following command to build to javascript:

```
npm run build
```

### Versioning and Publishing

Versioning follows normal semantic versioning, and it's handled by running the appropriate npm version <level> command. Publishing is done via GitHub releases, where each release triggers a GitHub action that deploys to npm.