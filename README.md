# serverless-discord

Typescript library for creating a serverless discord bot with slash commands

## Quick start

```
// import
// create slash command handler
const handleHello = ({ arguments: })

class HelloCommand extends DiscordCommand {
    constructor ()
}

// initialize library
const requestBodyJson = ''
const router = DiscordRouter({
    routes: [
        { interaction: Interaction }
    ]
})
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