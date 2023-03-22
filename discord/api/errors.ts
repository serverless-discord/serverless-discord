export class DiscordApiResponseError extends Error {
  response: Response;

  constructor({ response }: { response: Response }) {
    super(`Discord API responded with status ${response.status}`);
    this.name = "DiscordApiResponseError";
    this.response = response;
  }
}