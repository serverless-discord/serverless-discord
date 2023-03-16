import { DiscordInteractionApplicationCommand, DiscordInteractionPing, instanceofDiscordInteractionApplicationCommand, instanceofDiscordInteractionPing } from "./interactions";

describe("instanceofDiscordInteractionPing", () => {
  it("should return true for valid ping", () => {
    const interaction = new DiscordInteractionPing({
      id: "123",
      application_id: "123",
      version: 1,
      token: "123",
    });
    expect(instanceofDiscordInteractionPing(interaction)).toBe(true);
  });
  it("should return false for invalid ping", () => {
    const interaction = {
      type: 999
    };
    expect(instanceofDiscordInteractionPing(interaction)).toBe(false);
  });
});

describe("instanceofDiscordInteractionApplicationCommand", () => {
  it("should return true for valid application command", () => {
    const interaction = new DiscordInteractionApplicationCommand({
      id: "123",
      application_id: "123",
      version: 1,
      token: "123",
      data: {
        id: "123",
        name: "test",
        options: [],
        type: 1,
      },
    });
    expect(instanceofDiscordInteractionApplicationCommand(interaction)).toBe(true);
  });
  it("should return false for invalid application command", () => {
    const interaction = {
      type: 999
    };
    expect(instanceofDiscordInteractionApplicationCommand(interaction)).toBe(false);
  });
});