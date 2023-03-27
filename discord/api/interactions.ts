import { AxiosInstance } from "axios";
import { DiscordInteractionResponse } from "../interactions";
import { DiscordApiResponseError } from "./errors";

export class DiscordInteractionsApi {
  private axiosInstance: AxiosInstance;
  constructor({ axiosInstance }: { axiosInstance: AxiosInstance }) {
    this.axiosInstance = axiosInstance;
  }
  /**
     * @see https://discord.com/developers/docs/interactions/receiving-and-responding#create-interaction-response
     */
  async createInteractionResponse({
    interactionId,
    interactionToken,
    body
  }: {
        interactionId: string,
        interactionToken: string,
        body: DiscordInteractionResponse
    }): Promise<void> {
    const response = await this.axiosInstance.post(`/interactions/${interactionId}/${interactionToken}/callback`, body);
    if (response.status !== 204) {
      throw new DiscordApiResponseError({ response });
    }
  }

  /**
   * @see https://discord.com/developers/docs/interactions/receiving-and-responding#get-original-interaction-response 
   */
  async getInteractionResponse({
    applicationId,
    interactionToken
  }: {
        applicationId: string,
        interactionToken: string
    }): Promise<DiscordInteractionResponse> {
    const response = await this.axiosInstance.get(`/webhooks/${applicationId}/${interactionToken}/messages/@original`);
    return response.data;
  }

  /**
   * @see https://discord.com/developers/docs/interactions/receiving-and-responding#edit-original-interaction-response 
   */
  async editInteractionResponse({
    applicationId,
    interactionToken,
    body
  }: {
        applicationId: string,
        interactionToken: string,
        body: DiscordInteractionResponse
    }): Promise<Response> {
    const response = await this.axiosInstance.patch(`/webhooks/${applicationId}/${interactionToken}/messages/@original`, body);
    return response.data;
  }
}