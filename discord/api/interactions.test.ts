import { DiscordApiResponseError } from "./errors";
import { DiscordInteractionsApi } from "./interactions";

describe("DiscordInteractionApi.createInteractionResponse", () => {
  it("should return a response", async () => {
    DiscordInteractionsApi.apiRequest = jest.fn().mockResolvedValueOnce({
      status: 204,
    });
    await DiscordInteractionsApi.createInteractionResponse({
      interactionId: "123",
      interactionToken: "123",
      body: {
        type: 4,
        data: {
          content: "test"
        }
      }
    });
    expect(DiscordInteractionsApi.apiRequest).toHaveBeenCalledWith({
      path: "/interactions/123/123/callback",
      method: "POST",
      body: {
        type: 4,
        data: {
          content: "test"
        }
      }
    });
  });

  it("should throw an error if the status code is not 204", async () => {
    DiscordInteractionsApi.apiRequest = jest.fn().mockResolvedValueOnce({
      status: 400,
      json: () => Promise.resolve({
        message: "test"
      })
    });
    await expect(DiscordInteractionsApi.createInteractionResponse({
      interactionId: "123",
      interactionToken: "123",
      body: {
        type: 4,
        data: {
          content: "test"
        }
      }
    })).rejects.toThrow(DiscordApiResponseError);
  });
});

describe("DiscordInteractionApi.getInteractionResponse", () => {
  it("should return a response", async () => {
    DiscordInteractionsApi.apiRequest = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve({
        id: "123"
      })
    });
    const response = await DiscordInteractionsApi.getInteractionResponse({
      applicationId: "123",
      interactionToken: "123"
    });
    expect(DiscordInteractionsApi.apiRequest).toHaveBeenCalledWith({
      path: "/webhooks/123/123/messages/@original",
      method: "GET"
    });
    expect(response).toEqual({
      id: "123"
    });
  });
});

describe("DiscordInteractionApi.editInteractionResponse", () => {
  it("should return a response", async () => {
    DiscordInteractionsApi.apiRequest = jest.fn().mockResolvedValueOnce({
      json: () => Promise.resolve({
        id: "123"
      })
    });
    const response = await DiscordInteractionsApi.editInteractionResponse({
      applicationId: "123",
      interactionToken: "123",
      body: {
        type: 4,
        data: {
          content: "test"
        }
      }
    });
    expect(DiscordInteractionsApi.apiRequest).toHaveBeenCalledWith({
      path: "/webhooks/123/123/messages/@original",
      method: "PATCH",
      body: {
        type: 4,
        data: {
          content: "test"
        }
      }
    });
    expect(response).toEqual({
      id: "123"
    });
  });
});