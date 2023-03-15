# serverless-discord

Typescript library for creating a serverless discord bot with slash commands

## Lambda Quick start

```
class HelloCommand extends ServerlessDiscordCommandChatInput {
    constructor() {
        super({
            name: "test",
            options: [],
        });
    }
    async handleInteraction(): Promise<DiscordInteractionResponse> {
        return {
            type: 1,
            data: {
                tts: false,
                content: "Hello world!",
                embeds: [],
                allowed_mentions: {
                    parse: [],
                    roles: [],
                    users: [],
                    replied_user: false,
                },
                components: [],
            },
        }
    }
}
```

TODO: Guide to setup discord bot and authentication

### Deploy using AWS Lambda

TODO: deployment using CDK
TODO: deployment using serverless

### Deploy using Google Cloud Functions

TODO

### Development

```
npm install
npm run test
```