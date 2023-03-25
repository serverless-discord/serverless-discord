import { mock, MockProxy } from "jest-mock-extended";
import { DiscordApiResponseError } from "./errors";
import { DiscordInteractionsApi } from "./interactions";
import { AxiosInstance } from "axios";

describe("DiscordInteractionApi.createInteractionResponse", () => {
  let axiosInstance: MockProxy<AxiosInstance>;

  beforeEach(() => {
    axiosInstance = mock<AxiosInstance>();
  });

  it("should return a response", async () => {
    axiosInstance.post.mockResolvedValueOnce({
      status: 204
    });
    const interactionsApi = new DiscordInteractionsApi({ axiosInstance });
    await interactionsApi.createInteractionResponse({
      interactionId: "123",
      interactionToken: "123",
      body: {
        type: 4,
        data: {
          content: "test"
        }
      }
    });
    expect(axiosInstance.post).toHaveBeenCalledWith("/interactions/123/123/callback", {
      type: 4,
      data: {
        content: "test"
      }
    });
  });

  it("should throw an error if the status code is not 204", async () => {
    axiosInstance.post.mockResolvedValueOnce({
      status: 400,
      data: {
        message: "test"
      }
    });
    const interactionsApi = new DiscordInteractionsApi({ axiosInstance });
    await expect(interactionsApi.createInteractionResponse({
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
  let axiosInstance: MockProxy<AxiosInstance>;

  beforeEach(() => {
    axiosInstance = mock<AxiosInstance>();
  });

  it("should return a response", async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: {
        id: "123"
      }
    });
    const interactionsApi = new DiscordInteractionsApi({ axiosInstance });
    const response = await interactionsApi.getInteractionResponse({
      applicationId: "123",
      interactionToken: "123"
    });
    expect(axiosInstance.get).toHaveBeenCalledWith("/webhooks/123/123/messages/@original");
    expect(response).toEqual({
      id: "123"
    });
  });
});

describe("DiscordInteractionApi.editInteractionResponse", () => {
  let axiosInstance: MockProxy<AxiosInstance>;

  beforeEach(() => {
    axiosInstance = mock<AxiosInstance>();
  });

  it("should return a response", async () => {
    axiosInstance.patch.mockResolvedValueOnce({
      data: {
        id: "123"
      }
    });
    const interactionsApi = new DiscordInteractionsApi({ axiosInstance });
    const response = await interactionsApi.editInteractionResponse({
      applicationId: "123",
      interactionToken: "123",
      body: {
        type: 4,
        data: {
          content: "test"
        }
      }
    });
    expect(axiosInstance.patch).toHaveBeenCalledWith("/webhooks/123/123/messages/@original", {
      type: 4,
      data: {
        content: "test"
      }
    });
    expect(response).toEqual({
      id: "123"
    });
  });
});