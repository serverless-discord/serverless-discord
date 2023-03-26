import { mock, MockProxy } from "jest-mock-extended";
import { DiscordCommandApi } from "./commands";
import { AxiosInstance } from "axios";

const defaultApplication = {
  id: "123",
  name: "test",
  description: "test",
  summary: "test",
  verify_key: "test",
  flags: 0
};

describe("DiscordCommandApi.getGuildApplicationCommands", () => {
  it("should return a list of commands", async () => {
    const responseBody = [
      {
        id: "123",
        application_id: "123",
        name: "test",
        description: "test",
        options: []
      }
    ];
    const axiosInstance: MockProxy<AxiosInstance> = mock<AxiosInstance>();
    axiosInstance.get.mockResolvedValueOnce({
      data: responseBody
    });
    const commandApi = new DiscordCommandApi({ axiosInstance });
    const commands = await commandApi.getGuildApplicationCommands({
      applicationId: "123",
      guildId: "123"
    });
    expect(axiosInstance.get).toHaveBeenCalledWith(`/applications/${defaultApplication.id}/guilds/123/commands`);
    expect(commands).toEqual(responseBody);
  });
});

describe("DiscordCommandApi.createGuildApplicationCommand", () => {
  it("should return a command", async () => {
    const requestBody = {
      name: "test",
      description: "test"
    };
    const responseBody = {
      id: "123",
      application_id: "123",
      name: "test",
      description: "test",
      options: []
    };
    const axiosInstance: MockProxy<AxiosInstance> = mock<AxiosInstance>();
    axiosInstance.post.mockResolvedValueOnce({
      data: responseBody
    });
    const commandApi = new DiscordCommandApi({ axiosInstance });
    const command = await commandApi.createGuildApplicationCommand({
      applicationId: "123",
      guildId: "123",
      command: requestBody
    });
    expect(axiosInstance.post).toHaveBeenCalledWith(`/applications/${defaultApplication.id}/guilds/123/commands`,
      requestBody
    );
    expect(command).toEqual(responseBody);
  });
});

describe("DiscordCommandApi.getGuildApplicationCommand", () => {
  it("should return a command", async () => {
    const responseBody = {
      id: "123",
      application_id: "123",
      name: "test",
      description: "test",
      options: []
    };
    const axiosInstance: MockProxy<AxiosInstance> = mock<AxiosInstance>();
    axiosInstance.get.mockResolvedValueOnce({
      data: responseBody
    });
    const commandApi = new DiscordCommandApi({ axiosInstance });
    const command = await commandApi.getGuildApplicationCommand({
      applicationId: "123",
      guildId: "123",
      commandId: "123"
    });
    expect(axiosInstance.get).toHaveBeenCalledWith(`/applications/${defaultApplication.id}/guilds/123/commands/123`);
    expect(command).toEqual(responseBody);
  });
});

describe("DiscordCommandApi.bulkCreateGuildApplicationCommand", () => {
  it("should return a list of commands", async () => {
    const requestBody = [
      {
        name: "test",
        description: "test"
      }
    ];
    const responseBody = [
      {
        id: "123",
        application_id: "123",
        name: "test",
        description: "test",
        options: []
      }
    ];
    const axiosInstance: MockProxy<AxiosInstance> = mock<AxiosInstance>();
    axiosInstance.put.mockResolvedValueOnce({
      data: responseBody
    });
    const commandApi = new DiscordCommandApi({ axiosInstance });
    const commands = await commandApi.bulkCreateGuildApplicationCommand({
      applicationId: "123",
      guildId: "123",
      commands: requestBody
    });
    expect(axiosInstance.put).toHaveBeenCalledWith(`/applications/${defaultApplication.id}/guilds/123/commands`,
      requestBody
    );
    expect(commands).toEqual(responseBody);
  });
});

describe("DiscordCommandApi.getGlobalApplicationCommands", () => {
  it("should return a list of commands", async () => {
    const responseBody = [
      {
        id: "123",
        application_id: "123",
        name: "test",
        description: "test",
        options: []
      }
    ];
    const axiosInstance: MockProxy<AxiosInstance> = mock<AxiosInstance>();
    axiosInstance.get.mockResolvedValueOnce({
      data: responseBody
    });
    const commandApi = new DiscordCommandApi({ axiosInstance });
    const commands = await commandApi.getGlobalApplicationCommands({
      applicationId: "123"
    });
    expect(axiosInstance.get).toHaveBeenCalledWith(`/applications/${defaultApplication.id}/commands`);
    expect(commands).toEqual(responseBody);
  });
});

describe("DiscordCommandApi.createGlobalApplicationCommand", () => {
  it("should return a command", async () => {
    const requestBody = {
      name: "test",
      description: "test"
    };
    const responseBody = {
      id: "123",
      application_id: "123",
      name: "test",
      description: "test",
      options: []
    };
    const axiosInstance: MockProxy<AxiosInstance> = mock<AxiosInstance>();
    axiosInstance.post.mockResolvedValueOnce({
      data: responseBody
    });
    const commandApi = new DiscordCommandApi({ axiosInstance });
    const command = await commandApi.createGlobalApplicationCommand({
      applicationId: "123",
      command: requestBody
    });
    expect(axiosInstance.post).toHaveBeenCalledWith(`/applications/${defaultApplication.id}/commands`,
      requestBody
    );
    expect(command).toEqual(responseBody);
  });
});

describe("DiscordCommandApi.bulkCreateGlobalApplicationCommand", () => {
  it("should create a list of commands and return them", async () => {
    const requestBody = [
      {
        name: "test",
        description: "test"
      }
    ];
    const responseBody = [
      {
        id: "123",
        application_id: "123",
        name: "test",
        description: "test",
        options: []
      }
    ];
    const axiosInstance: MockProxy<AxiosInstance> = mock<AxiosInstance>();
    axiosInstance.put.mockResolvedValueOnce({
      data: responseBody
    });
    const commandApi = new DiscordCommandApi({ axiosInstance });
    const commands = await commandApi.bulkCreateGlobalApplicationCommand({
      applicationId: "123",
      commands: requestBody
    });
    expect(axiosInstance.put).toHaveBeenCalledWith(`/applications/${defaultApplication.id}/commands`,
      requestBody
    );
    expect(commands).toEqual(responseBody);
  });
});