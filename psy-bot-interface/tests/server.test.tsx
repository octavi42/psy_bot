import { PrismaClient } from "@prisma/client";
import { mocked } from "ts-jest/utils";
import request from "supertest";
import { Response, Request } from "express";
import { POST } from "./server"; // Replace with the actual path to your server file

jest.mock("@prisma/client"); // Mock PrismaClient
const prismaMock = mocked(new PrismaClient(), true);

// Mock the fetcher function
jest.mock("~/lib/fetcher", () => ({
  fetcher: jest.fn(),
}));

const mockFetcher = require("~/lib/fetcher").fetcher;

describe("POST endpoint", () => {
  it("should return a success response", async () => {
    const req: Partial<Request> = {
      json: jest.fn().mockResolvedValue({
        classId: "class123",
        userId: "user123",
        title: "Test Title",
        description: "Test Description",
        endpoint: "test-endpoint",
      }),
    };

    const contextMock = {
      data: "test data",
      uuid: "uuid123",
      fileType: "test",
    };

    const saveObjectMock = {
      id: "uuid123",
      createdByUserId: "user123",
      title: "Test Title",
      description: "Test Description",
      transcription: "test data",
      type: "test",
    };

    const deleteResponseMock = {
      status: "success",
      message: "Deleted successfully",
    };

    prismaMock.objects.create.mockResolvedValue(saveObjectMock);
    mockFetcher.mockResolvedValue(contextMock);
    mockFetcher.mockResolvedValueOnce(deleteResponseMock);

    const response = await POST(req as Request);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      savedObject: saveObjectMock,
      message: "Successfully deleted from the external service",
    });
  });

  it("should handle fetcher errors", async () => {
    const req: Partial<Request> = {
      json: jest.fn().mockResolvedValue({
        classId: "class123",
        userId: "user123",
        title: "Test Title",
        description: "Test Description",
        endpoint: "test-endpoint",
      }),
    };

    mockFetcher.mockRejectedValue(new Error("Fetch error"));

    const response = await POST(req as Request);

    expect(response.status).toBe(500);
    expect(response.body).toBe("Error: Internal server error");
  });

  // Add more test cases to cover different scenarios
});
