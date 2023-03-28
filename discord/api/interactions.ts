import { AxiosInstance } from "axios";
import { DiscordMessage } from "../channel";
import { DiscordInteractionResponseData } from "../interactions";

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
        body: DiscordInteractionResponseData
    }): Promise<void> {
    const response = await this.axiosInstance.post(`/interactions/${interactionId}/${interactionToken}`, body);
  }

  async getInteractionResponse({
    applicationId,
    interactionToken
  }: {
        applicationId: string,
        interactionToken: string
    }): Promise<DiscordInteractionResponseData> {
    const response = await this.axiosInstance.get(`/webhooks/${applicationId}/${interactionToken}/messages/@original`);
    return response.data;
  }

  async editInteractionResponse({
    applicationId,
    interactionToken,
    body
  }: {
        applicationId: string,
        interactionToken: string,
        body: DiscordInteractionResponseData
    }): Promise<DiscordMessage> {
    const response = await this.axiosInstance.patch(`/webhooks/${applicationId}/${interactionToken}/messages/@original`, body);
    return response.data;
  }
}