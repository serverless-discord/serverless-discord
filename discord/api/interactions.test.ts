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
      body:  {
        content: "test"
      }
    });
    expect(axiosInstance.post).toHaveBeenCalledWith("/interactions/123/123", {
      content: "test"
    });
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
        content: "test"
      }
    });
    expect(axiosInstance.patch).toHaveBeenCalledWith("/webhooks/123/123/messages/@original", {
      content: "test"
    });
    expect(response).toEqual({
      id: "123"
    });
  });
});