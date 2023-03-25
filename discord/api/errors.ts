import { AxiosResponse } from "axios";

export class DiscordApiResponseError extends Error {
  response: AxiosResponse;

  constructor({ response }: { response: AxiosResponse }) {
    super(`Discord API responded with status ${response.status}`);
    this.name = "DiscordApiResponseError";
    this.response = response;
  }
}