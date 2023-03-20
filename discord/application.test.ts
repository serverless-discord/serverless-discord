import { MockProxy } from "jest-mock-extended";
import { discordReq } from "./api";
import { DiscordApplication } from "./application";

const defaultApplication = {
    id: "123",
    name: "test",
    description: "test",
    summary: "test",
    verify_key: "test",
    flags: 0
}

describe("DiscordApplication.getGlobalApplicationCommands", () => {
    it("should return an array of application commands", async () => {
        const discordReqMock: MockProxy<typeof discordReq> = jest.fn().mockResolvedValueOnce({
            json: () => Promise.resolve([
                {
                    id: "123",
                    application_id: "123",
                    name: "test",
                    description: "test",
                    options: []
                }
            ])
        });
        const application = new DiscordApplication({
            ...defaultApplication,
            apiRequest: discordReqMock
        });
        const commands = await application.getGlobalApplicationCommands();
        expect(commands).toEqual([
            {
                id: "123",
                application_id: "123",
                name: "test",
                description: "test",
                options: []
            }
        ]);
    });
});

describe("DiscordApplication.createGlobalApplicationCommand", () => {
    it("should return an application command", async () => {
        const discordReqMock: MockProxy<typeof discordReq> = jest.fn().mockResolvedValueOnce({
            statusCode: 201,
            json: () => Promise.resolve({
                id: "123",
                type: 1,
                application_id: "123",
                version: "123",
                name: "test",
                description: "test",
                options: []
            })
        });
        const application = new DiscordApplication({
            ...defaultApplication,
            apiRequest: discordReqMock
        });
        const commandData = {
            id: "123",
            type: 1,
            application_id: "123",
            version: "123",
            name: "test",
            description: "test",
            options: []
        }
        const command = await application.createGlobalApplicationCommand(commandData);
        expect(command).toEqual(commandData);
    });
});

describe("DiscordApplication.bulkCreateGlobalApplicationCommand", () => {
    it("should return an array of application commands", async () => {
        const discordReqMock: MockProxy<typeof discordReq> = jest.fn().mockResolvedValueOnce({
            json: () => Promise.resolve([
                {
                    id: "123",
                    application_id: "123",
                    name: "test",
                    description: "test",
                    options: []
                }
            ])
        });
        const application = new DiscordApplication({
            ...defaultApplication,
            apiRequest: discordReqMock
        });
        const commands = await application.bulkCreateGlobalApplicationCommand([
            {
                name: "test",
                description: "test",
            }
        ]);
        expect(discordReqMock).toHaveBeenCalledWith({
            path: "/applications/123/commands",
            method: "PUT",
            body: [
                {
                    name: "test",
                    description: "test",
                }
            ]
        });
        expect(commands).toEqual([
            {
                id: "123",
                application_id: "123",
                name: "test",
                description: "test",
                options: []
            }
        ]);
    });
});