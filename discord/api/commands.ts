import { DiscordApi } from ".";
import { DiscordCommand, DiscordCreateApplicationCommandParams } from "../command";

export class DiscordCommandApi extends DiscordApi {
  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands
     */
  static async getGlobalApplicationCommands({ applicationId } : { applicationId: string }): Promise<DiscordCommand[]> {
    const resp = await this.apiRequest({
      path: `/applications/${applicationId}/commands`,
      method: "GET"
    });
    return await resp.json();
  }

  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
    */
  static async createGlobalApplicationCommand({ applicationId, command } : { applicationId: string, command: DiscordCreateApplicationCommandParams }): Promise<DiscordCommand> {
    const resp = await this.apiRequest({
      path: `/applications/${applicationId}/commands`,
      method: "POST",
      body: command
    });
    return await resp.json();
  }

  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#get-guild-application-commands 
     */
  static async getGuildApplicationCommands({ applicationId, guildId } : {applicationId: string, guildId: string }): Promise<DiscordCommand[]> {
    const resp = await this.apiRequest({
      path: `/applications/${applicationId}/guilds/${guildId}/commands`,
      method: "GET"
    });
    return await resp.json();
  }

  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command
     */
  static async getGuildApplicationCommand({
    applicationId,
    guildId,
    commandId
  } : {
        applicationId: string,
        guildId: string,
        commandId: string
    }): Promise<DiscordCommand> {
    const resp = await this.apiRequest({
      path: `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,
      method: "GET"
    });
    return await resp.json();
  }

  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command
     */
  static async createGuildApplicationCommand({
    applicationId,
    guildId,
    command
  } : {
        applicationId: string,
        guildId: string,
        command: DiscordCreateApplicationCommandParams
    }): Promise<DiscordCommand> {
    const resp = await this.apiRequest({
      path: `/applications/${applicationId}/guilds/${guildId}/commands`,
      method: "POST",
      body: command
    });
    return await resp.json();
  }

  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands
     */
  static async bulkCreateGuildApplicationCommand({
    applicationId,
    guildId,
    commands
  } : {
        applicationId: string,
        guildId: string,
        commands: DiscordCreateApplicationCommandParams[]
    }): Promise<DiscordCommand[]> {
    const resp = await this.apiRequest({
      path: `/applications/${applicationId}/guilds/${guildId}/commands`,
      method: "PUT",
      body: commands
    });
    return await resp.json();
  }
}
