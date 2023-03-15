# serverless-discord

Serverless-discord is a Typescript library designed to facilitate the creation of serverless Discord bots with slash commands. It can be found on [npm](https://www.npmjs.com/package/serverless-discord).

## Lambda Quick Start

Please note that this library is still in pre-release status and is not production-ready. We are still making large changes to the API, so please come back for a more polished project.

To get started, install the serverless-discord package from npm:

```
npm install serverless-discord
```

Next, create a simple command like this one:

```
import { ServerlessDiscordCommandChatInput, DiscordInteractionApplicationCommand, DiscordInteractionResponse, DiscordInteractionResponseTypes } from "serverless-discord";
import { initLambdaRouter } from "serverless-discord/aws";

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

Replace the DISCORD_PUBLIC_KEY with a secure credential handling method of your choice, such as an environment variable. You can obtain this key by creating a new bot on the Discord Developer Portal. The key is necessary to authenticate requests and ensure that they are coming from Discord servers.

You can now host this on Lambda behind an ApiGateway to create a fully functioning Discord bot.

For a complete example that can be used as a template, see [here](https://github.com/themcaffee/serverless-discord-template).

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