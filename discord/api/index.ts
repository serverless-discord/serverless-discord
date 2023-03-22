export const DISCORD_API_VERSION = 9;
export const DISCORD_API_BASE_URL = `https://discord.com/api/v${DISCORD_API_VERSION}`;

export class DiscordApi {
  static async apiRequest({ path, method, headers, body }: {
        path: string,
        method: string,
        headers?: Record<string, string>,
        body?: unknown
    }): Promise<Response> {
    return await fetch(`${DISCORD_API_BASE_URL}${path}`, {
      method,
      headers: {
        ...headers,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
  }

}