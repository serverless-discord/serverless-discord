import { DiscordCommandApi } from "./commands";
import { AxiosInstance } from "axios";
import { DiscordInteractionsApi } from "./interactions";
import axios from "axios";

export const DISCORD_API_VERSION = 9;
export const DISCORD_API_BASE_URL = `https://discord.com/api/v${DISCORD_API_VERSION}`;

export class DiscordApiClient {
  private token: string;
  private axiosInstance: AxiosInstance;
  commands: DiscordCommandApi;
  interactions: DiscordInteractionsApi;

  constructor({ token }:{ token: string }) {
    this.token = token;
    this.axiosInstance = axios.create({
      baseURL: DISCORD_API_BASE_URL,
      headers: {
        "Authorization": `Bot ${token}`,
        "Content-Type": "application/json"
      }
    });
    this.commands = new DiscordCommandApi({ axiosInstance: this.axiosInstance });
    this.interactions = new DiscordInteractionsApi({ axiosInstance: this.axiosInstance });
  }
}