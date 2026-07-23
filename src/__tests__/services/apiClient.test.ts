import axios from "axios";
import { apiClient } from "../../services/api/apiClient";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("apiClient service wrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an axios instance with base URL and send request", async () => {
    const mockResponse = { data: { name: "pikachu" }, status: 200 };
    const mockRequest = jest.fn().mockResolvedValue(mockResponse);

    mockedAxios.create.mockReturnValue({
      request: mockRequest,
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    } as any);

    const result = await apiClient({
      url: "pokemon/pikachu",
      method: "GET",
    });

    expect(mockedAxios.create).toHaveBeenCalled();
    expect(mockRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        url: "pokemon/pikachu",
        method: "GET",
      })
    );
    expect(result).toEqual(mockResponse);
  });
});
