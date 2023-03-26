import { DiscordCommand, DiscordCreateApplicationCommandParams } from "../command";
import { AxiosInstance } from "axios";

export class DiscordCommandApi {
  private axiosInstance: AxiosInstance;

  constructor({ axiosInstance }: { axiosInstance: AxiosInstance }) {
    this.axiosInstance = axiosInstance;
  }

  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#get-global-application-commands
     */
  async getGlobalApplicationCommands({ applicationId } : { applicationId: string }): Promise<DiscordCommand[]> {
    const resp = await this.axiosInstance.get(`/applications/${applicationId}/commands`);
    return resp.data;
  }

  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
    */
  async createGlobalApplicationCommand({ applicationId, command } : { applicationId: string, command: DiscordCreateApplicationCommandParams }): Promise<DiscordCommand> {
    const resp = await this.axiosInstance.post(`/applications/${applicationId}/commands`, command);
    return resp.data;
  }

  /**
   * @see https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
   */
  async bulkCreateGlobalApplicationCommand({ applicationId, commands } : { applicationId: string, commands: DiscordCreateApplicationCommandParams[] }): Promise<DiscordCommand[]> {
    const resp = await this.axiosInstance.put(`/applications/${applicationId}/commands`, commands);
    return resp.data;
  }

  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#get-guild-application-commands 
     */
  async getGuildApplicationCommands({ applicationId, guildId } : {applicationId: string, guildId: string }): Promise<DiscordCommand[]> {
    const resp = await this.axiosInstance.get(`/applications/${applicationId}/guilds/${guildId}/commands`);
    return resp.data;
  }

  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#get-guild-application-command
     */
  async getGuildApplicationCommand({
    applicationId,
    guildId,
    commandId
  } : {
        applicationId: string,
        guildId: string,
        commandId: string
    }): Promise<DiscordCommand> {
    const resp = await this.axiosInstance.get(`/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`);
    return resp.data;
  }

  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command
     */
  async createGuildApplicationCommand({
    applicationId,
    guildId,
    command
  } : {
        applicationId: string,
        guildId: string,
        command: DiscordCreateApplicationCommandParams
    }): Promise<DiscordCommand> {
    const resp = await this.axiosInstance.post(`/applications/${applicationId}/guilds/${guildId}/commands`, command);
    return resp.data;
  }

  /**
     * @see https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-guild-application-commands
     */
  async bulkCreateGuildApplicationCommand({
    applicationId,
    guildId,
    commands
  } : {
        applicationId: string,
        guildId: string,
        commands: DiscordCreateApplicationCommandParams[]
    }): Promise<DiscordCommand[]> {
    const resp = await this.axiosInstance.put(`/applications/${applicationId}/guilds/${guildId}/commands`, commands);
    return resp.data;
  }
}
