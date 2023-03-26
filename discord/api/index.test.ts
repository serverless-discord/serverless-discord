import { mock, MockProxy } from "jest-mock-extended";
import { DiscordApiClient } from ".";
import { AxiosInstance } from "axios";

describe("DiscordApiClient", () => {
  let axiosInstance: MockProxy<AxiosInstance>;

  beforeEach(() => {
    axiosInstance = mock<AxiosInstance>();
  });
  
  it("should be able to initialize", () => {
    const apiClient = new DiscordApiClient({ token: "test", axiosInstance });
    expect(apiClient).toBeDefined();
  });
});