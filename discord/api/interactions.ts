import { DiscordApi } from ".";
import { DiscordInteractionResponse } from "../interactions";
import { DiscordApiResponseError } from "./errors";

export class DiscordInteractionsApi extends DiscordApi {
  /**
     * @see https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response
     */
  static async createInteractionResponse({
    interactionId,
    interactionToken,
    body
  }: {
        interactionId: string,
        interactionToken: string,
        body: DiscordInteractionResponse
    }): Promise<void> {
    const response = await this.apiRequest({
      path: `/interactions/${interactionId}/${interactionToken}/callback`,
      method: "POST",
      body
    });
    if (response.status !== 204) {
      throw new DiscordApiResponseError({ response });
    }
  }

  static async getInteractionResponse({
    applicationId,
    interactionToken
  }: {
        applicationId: string,
        interactionToken: string
    }): Promise<DiscordInteractionResponse> {
    const response = await this.apiRequest({
      path: `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
      method: "GET"
    });
    return await response.json();
  }

  static async editInteractionResponse({
    applicationId,
    interactionToken,
    body
  }: {
        applicationId: string,
        interactionToken: string,
        body: DiscordInteractionResponse
    }): Promise<Response> {
    const response = await this.apiRequest({
      path: `/webhooks/${applicationId}/${interactionToken}/messages/@original`,
      method: "PATCH",
      body
    });
    return await response.json();
  }
}