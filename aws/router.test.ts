import { MockProxy, mock } from "jest-mock-extended";
import { BadRequestResponse, MethodNotAllowedResponse, ServerlessDiscordLambdaRouter, UnauthorizedResponse } from "./router";
import { APIGatewayEvent } from "aws-lambda";
import { DiscordInteractionApplicationCommand, DiscordInteractionPing } from "../discord";
import { CommandNotFoundError, UnauthorizedError } from "../core/errors";
import { ServerlessDiscordRouter } from "../core/router";

describe("ServerlessDiscordRouter.handleInteraction", () => {
    let lambdaEventMock: MockProxy<APIGatewayEvent>;
    let coreRouterMock: MockProxy<ServerlessDiscordRouter>;

    beforeEach(() => {
        lambdaEventMock = mock<APIGatewayEvent>();
        lambdaEventMock.headers = {
            "content-type": "application/json",
            "x-signature-ed25519": "123", 
            "x-signature-timestamp": "123", 
        }
        lambdaEventMock.httpMethod = "POST";
        coreRouterMock = mock<ServerlessDiscordRouter>();
    });

    it("should handle ping", async () => {
        const interaction = new DiscordInteractionPing({
            id: "123",
            application_id: "123",
            token: "123",
            version: 1,
        });
        lambdaEventMock.body = JSON.stringify(interaction);
        coreRouterMock.handleInteraction.mockResolvedValue({ type: 1 });
        const router = new ServerlessDiscordLambdaRouter({
          router: coreRouterMock,
        });
        const result = await router.handleLambdaInteraction(lambdaEventMock);
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify({ type: 1 }),
        });
    });

    it("should handle application command", async () => {
        const interaction = new DiscordInteractionApplicationCommand({
            id: "123",
            application_id: "123",
            token: "123",
            version: 1,
            data: {
                id: "123",
                name: "test",
                options: [],
                type: 1,
            },
        });
        lambdaEventMock.body = JSON.stringify(interaction);
        const resolvedValue = {
            type: 1,
            data: {
                tts: false,
                content: "test",
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
        coreRouterMock.handleInteraction.mockResolvedValue(resolvedValue);
        const router = new ServerlessDiscordLambdaRouter({
          router: coreRouterMock,
        });
        const result = await router.handleLambdaInteraction(lambdaEventMock);
        expect(result).toEqual({
            statusCode: 200,
            body: JSON.stringify(resolvedValue),
        });
        expect(coreRouterMock.handleInteraction).toBeCalledWith(interaction, lambdaEventMock.headers);
    });

    it("should handle application command with no matching command", async () => {
      const interaction = new DiscordInteractionApplicationCommand({
        id: "123",
        application_id: "123",
        token: "123",
        version: 1,
        data: {
            id: "123",
            name: "test",
            options: [],
            type: 1,
        },
      });
      lambdaEventMock.body = JSON.stringify(interaction);
      coreRouterMock.handleInteraction.mockRejectedValue(new CommandNotFoundError());
      const router = new ServerlessDiscordLambdaRouter({
        router: coreRouterMock,
      });
      const result = router.handleLambdaInteraction(lambdaEventMock);
      expect(result).rejects.toThrow(CommandNotFoundError);
    });

    it("should handle invalid authentication", async () => {
      const interaction = new DiscordInteractionPing({
        id: "123",
        application_id: "123",
        version: 1,
        token: "123",
      });
      lambdaEventMock.body = JSON.stringify(interaction);
      coreRouterMock.handleInteraction.mockRejectedValue(new UnauthorizedError());
      const router = new ServerlessDiscordLambdaRouter({
        router: coreRouterMock,
      });
      const result = await router.handleLambdaInteraction(lambdaEventMock);
      expect(result).toEqual(UnauthorizedResponse);
    });

    it("should handle invalid content type", async () => {
      lambdaEventMock.headers["content-type"] = "text/plain";
      const router = new ServerlessDiscordLambdaRouter({
        router: coreRouterMock,
      });
      const result = await router.handleLambdaInteraction(lambdaEventMock);
      expect(result).toEqual(BadRequestResponse);
    });

    it("should handle invalid request method", async () => {
      lambdaEventMock.httpMethod = "GET";
      const router = new ServerlessDiscordLambdaRouter({
        router: coreRouterMock,
      });
      const result = await router.handleLambdaInteraction(lambdaEventMock);
      expect(result).toEqual(MethodNotAllowedResponse);
    });
});