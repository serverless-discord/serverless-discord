import { Logger } from "pino";
import { DiscordApiClient } from "../discord/api";
import { Command } from "./command";

export class CommandRegistrar {
  protected commands: Command[];
  protected logHandler: Logger;
  protected apiClient: DiscordApiClient;
  protected applicationId: string;

  constructor({ logHandler, commands, apiClient, applicationId }: { 
    logHandler: Logger; 
    commands: Command[];
    apiClient: DiscordApiClient;
    applicationId: string;
  }) {
    this.logHandler = logHandler;
    this.commands = commands;
    this.apiClient = apiClient;
    this.applicationId = applicationId;
  }

  /**
   * Registers both guild command and global commands with Discord.
   */
  async registerAllCommands() {
    this.logHandler.debug("Registering all commands", { commands: this.commands });
    await this.registerGuildCommands();
    await this.registerGlobalCommands();
    this.logHandler.debug("Registered all commands", { commands: this.commands });
  }

  async registerGuildCommands() {
    // Register guild commands
    const guildCommands = this.commands.filter(command => command.guilds.length > 0);
    if (guildCommands.length === 0) {
      this.logHandler.info("No guild commands to register");
      return;
    }
    this.logHandler.debug("Registering Guild Commands", { guildCommands });
    // Group all commands by guild
    const guildCommandMap = new Map<string, Command[]>(); // guildId -> commands
    guildCommands.forEach(command => {
      command.guilds.forEach(guildId => {
        if (!guildCommandMap.has(guildId)) {
          guildCommandMap.set(guildId, []);
        }
        guildCommandMap.get(guildId)?.push(command);
      });
    });
    this.logHandler.debug("Registering Guild Command Batches", { guildCommandMap });
    await Promise.all(
      Array.from(guildCommandMap.entries()).map(([guildId, commands]) => this.registerGuildCommandBatch({ commands, guildId }))
    );
    this.logHandler.debug("Registered Guild Commands", { guildCommands });
  }

  async registerGuildCommandBatch({ commands, guildId } : { commands: Command[]; guildId: string }) {
    this.logHandler.debug("Registering Guild Command Batch", { commands, guildId });
    const result = await this.apiClient.commands.bulkCreateGuildApplicationCommand({
      applicationId: this.applicationId,
      guildId,
      commands: commands.map(command => command.toJSON()),
    });
    this.logHandler.debug("Registered Guild Command Batch", { commands, guildId, result });
  }

  async registerGlobalCommands() {
    this.logHandler.debug("Registering Global Commands");
    const globalCommands = this.commands.filter(command => command.guilds.length <= 0);
    if (globalCommands.length === 0) {
      return;
    }
    await Promise.all(globalCommands.map(command => this.registerGlobalCommand({ command })));
    this.logHandler.debug("Registered Global Commands", { globalCommands });
  }

  async registerGlobalCommand({ command } : { command: Command }) {
    this.logHandler.debug("Registering Global Command", { command });
    const result = await this.apiClient.commands.createGlobalApplicationCommand({
      applicationId: this.applicationId,
      command: command.toJSON(),
    });
    this.logHandler.debug("Registered Global Command", { command, result });
  }
}