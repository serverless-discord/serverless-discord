import { DiscordInteractionApplicationCommand, DiscordInteractionPing, DiscordInteractionApplicationCommandAutocomplete, instanceofDiscordInteractionApplicationCommand, instanceofDiscordInteractionPing, instanceofDiscordInteractionApplicationCommandAutocomplete, DiscordInteractionResponsePong, DiscordInteractionResponseChannelMessageWithSource, DiscordInteractionResponseDeferredUpdateMessage, DiscordInteractionResponseDeferredChannelMessageWithSource, DiscordInteractionResponseUpdateMessage, DiscordInteractionResponseApplicationCommandAutocompleteResult, DiscordInteractionResponseModal, DiscordInteractionMessageComponent, instanceofDiscordInteractionMessageComponent, DiscordInteractionModalSubmit, instanceofDiscordInteractionModalSubmit } from "./interactions";

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

describe("DiscordInteractionApplicationCommandAutoComplete", () => {
  it("should be able to create a DiscordInteractionApplicationCommandAutoComplete", () => {
    const interaction = new DiscordInteractionApplicationCommandAutocomplete({
      id: "123",
      application_id: "123",
      version: 1,
      token: "123",
      data: {
        id: "123",
      }
    });
    expect(interaction).toBeDefined();
    expect(interaction.id).toBe("123");
    expect(interaction.application_id).toBe("123");
    expect(interaction.version).toBe(1);
    expect(interaction.token).toBe("123");
    expect(interaction.data).toBeDefined();
  });
});

describe("instanceofDiscordInteractionApplicationCommandAutocomplete", () => {
  it("should return true for valid application command", () => {
    const interaction = new DiscordInteractionApplicationCommandAutocomplete({
      id: "123",
      application_id: "123",
      version: 1,
      token: "123",
      data: {
        id: "123",
      }
    });
    const result = instanceofDiscordInteractionApplicationCommandAutocomplete(interaction);
    expect(result).toBe(true);
  });
  it("should return false for invalid application command", () => {
    const interaction = {
      type: 999
    };
    const result = instanceofDiscordInteractionApplicationCommandAutocomplete(interaction);
    expect(result).toBe(false);
  });
});

describe("DiscordInteractionResponsePong", () => {
  it("should be able to create a DiscordInteractionResponsePong", () => {
    const interaction = new DiscordInteractionResponsePong();
    expect(interaction).toBeDefined();
  });
});

describe("DiscordInteractionResponseChannelMessageWithSource", () => {
  it("should be able to create a DiscordInteractionResponseChannelMessageWithSource", () => {
    const interaction = new DiscordInteractionResponseChannelMessageWithSource({
      data: {
        content: "test",
      }
    });
    expect(interaction).toBeDefined();
    expect(interaction.data).toBeDefined();
  });
});

describe("DiscordInteractionResponseDeferredUpdateMessage", () => {
  it("should be able to create a DiscordInteractionResponseDeferredUpdateMessage", () => {
    const interaction = new DiscordInteractionResponseDeferredUpdateMessage({
      data: {
        content: "test",
      } 
    });
    expect(interaction).toBeDefined();
  });
});

describe("DiscordInteractionResponseDeferredChannelMessageWithSource", () => {
  it("should be able to create a DiscordInteractionResponseDeferredChannelMessageWithSource", () => {
    const interaction = new DiscordInteractionResponseDeferredChannelMessageWithSource({
      data: {
        content: "test",
      } 
    });
    expect(interaction).toBeDefined();
  });
});

describe("DiscordInteractionResponseUpdateMessage", () => {
  it("should be able to create a DiscordInteractionResponseUpdateMessage", () => {
    const interaction = new DiscordInteractionResponseUpdateMessage({
      data: {
        content: "test",
      }
    });
    expect(interaction).toBeDefined();
  });
});

describe("DiscordInteractionResponseApplicationCommandAutocompleteResult", () => {
  it("should be able to create a DiscordInteractionResponseApplicationCommandAutocompleteResult", () => {
    const interaction = new DiscordInteractionResponseApplicationCommandAutocompleteResult({
      data: {
        choices: [
          {
            name: "test",
            value: "test",
          }
        ]
      }
    });
    expect(interaction).toBeDefined();
  });
});

describe("DiscordInteractionResponseModal", () => {
  it("should be able to create a DiscordInteractionResponseModal", () => {
    const interaction = new DiscordInteractionResponseModal({
      data: {
        content: "test",
      }
    });
    expect(interaction).toBeDefined();
  });
});

describe("instanceofDiscordInteractionMessageComponent", () => {
  it("should return true for valid message component", () => {
    const interaction = new DiscordInteractionMessageComponent({
      id: "123",
      application_id: "123",
      token: "123",
      version: 1,
      data: {
        custom_id: "123",
        component_type: 2,
        values: [],
      }
    });
    expect(instanceofDiscordInteractionMessageComponent(interaction)).toBe(true);
  });

  it("should return false for invalid message component", () => {
    const interaction = {
      type: 999
    };
    expect(instanceofDiscordInteractionMessageComponent(interaction)).toBe(false);
  });
});

describe("instanceofDiscordInteractionModalSubmit", () => {
  it("should return true for valid modal submit", () => {
    const interaction = new DiscordInteractionModalSubmit({
      id: "123",
      application_id: "123",
      token: "123",
      version: 1,
      data: {
        custom_id: "123",
        components: [],
      }
    });
    expect(instanceofDiscordInteractionModalSubmit(interaction)).toBe(true);
  });

  it("should return false for invalid modal submit", () => {
    const interaction = {
      type: 999
    };
    expect(instanceofDiscordInteractionModalSubmit(interaction)).toBe(false);
  });
});