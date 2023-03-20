import { MockProxy } from "jest-mock-extended";
import { DiscordApplication } from "../application";
import { DiscordCommandApi } from "./commands";

const defaultApplication = {
    id: "123",
    name: "test",
    description: "test",
    summary: "test",
    verify_key: "test",
    flags: 0
}

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
        DiscordCommandApi.apiRequest = jest.fn().mockResolvedValueOnce({
            json: () => Promise.resolve(responseBody)
        });
        const commands = await DiscordCommandApi.getGuildApplicationCommands({
            applicationId: "123",
            guildId: "123"
        });
        expect(DiscordCommandApi.apiRequest).toHaveBeenCalledWith({
            path: `/applications/${defaultApplication.id}/guilds/123/commands`,
            method: "GET"
        });
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
        DiscordCommandApi.apiRequest = jest.fn().mockResolvedValueOnce({
            json: () => Promise.resolve(responseBody)
        });
        const command = await DiscordCommandApi.createGuildApplicationCommand({
            applicationId: "123",
            guildId: "123",
            command: requestBody
        });
        expect(DiscordCommandApi.apiRequest).toHaveBeenCalledWith({
            path: `/applications/${defaultApplication.id}/guilds/123/commands`,
            method: "POST",
            body: requestBody
        });
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
        DiscordCommandApi.apiRequest = jest.fn().mockResolvedValueOnce({
            json: () => Promise.resolve(responseBody)
        });
        const command = await DiscordCommandApi.getGuildApplicationCommand({
            applicationId: "123",
            guildId: "123",
            commandId: "123"
        });
        expect(DiscordCommandApi.apiRequest).toHaveBeenCalledWith({
            path: `/applications/${defaultApplication.id}/guilds/123/commands/123`,
            method: "GET"
        });
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
        DiscordCommandApi.apiRequest = jest.fn().mockResolvedValueOnce({
            json: () => Promise.resolve(responseBody)
        });
        const commands = await DiscordCommandApi.bulkCreateGuildApplicationCommand({
            applicationId: "123",
            guildId: "123",
            commands: requestBody
        });
        expect(DiscordCommandApi.apiRequest).toHaveBeenCalledWith({
            path: `/applications/${defaultApplication.id}/guilds/123/commands`,
            method: "PUT",
            body: requestBody
        });
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
        DiscordCommandApi.apiRequest = jest.fn().mockResolvedValueOnce({
            json: () => Promise.resolve(responseBody)
        });
        const commands = await DiscordCommandApi.getGlobalApplicationCommands({
            applicationId: "123"
        });
        expect(DiscordCommandApi.apiRequest).toHaveBeenCalledWith({
            path: `/applications/${defaultApplication.id}/commands`,
            method: "GET"
        });
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
        DiscordCommandApi.apiRequest = jest.fn().mockResolvedValueOnce({
            json: () => Promise.resolve(responseBody)
        });
        const command = await DiscordCommandApi.createGlobalApplicationCommand({
            applicationId: "123",
            command: requestBody
        });
        expect(DiscordCommandApi.apiRequest).toHaveBeenCalledWith({
            path: `/applications/${defaultApplication.id}/commands`,
            method: "POST",
            body: requestBody
        });
        expect(command).toEqual(responseBody);
    });
});