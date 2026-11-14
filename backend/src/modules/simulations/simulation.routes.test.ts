import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../../app.js";
import {
  createSimulation,
  listSimulations,
  CustomerNotFoundError,
} from "./simulation.service.js";

vi.mock("./simulation.service.js", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("./simulation.service.js")>();

  return {
    ...actual,
    createSimulation: vi.fn(),
    listSimulations: vi.fn(),
  };
});

describe("POST /simulations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns HTTP 201 when a simulation is created", async () => {
    const input = {
      customerId: "customer-123",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    };

    const savedSimulation = {
      id: "simulation-123",
      ...input,
      planSnapshot: "Professional",
      countrySnapshot: "ES",
      taxRateSnapshot: "0.21",
      usersCostCents: 14000,
      subtotalCents: 14000,
      taxCents: 2940,
      totalCents: 16940,
      createdAt: "2026-11-13T12:00:00.000Z",
    };

    vi.mocked(createSimulation).mockResolvedValue(savedSimulation as never);

    const response = await request(app).post("/simulations").send(input);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(savedSimulation);
    expect(createSimulation).toHaveBeenCalledExactlyOnceWith(input);
  });
  it.each([
    ["negative active users", "activeUsers", -1],
    ["decimal active users", "activeUsers", 15.5],
    ["too many active users", "activeUsers", 100001],
    ["negative storage", "storageGb", -1],
    ["decimal storage", "storageGb", 100.5],
    ["too much storage", "storageGb", 1000001],
    ["negative API calls", "apiCalls", -1],
    ["decimal API calls", "apiCalls", 5000.5],
    ["too many API calls", "apiCalls", 100000001],
  ] as const)("returns HTTP 400 for %s", async (_description, field, value) => {
    const input = {
      customerId: "customer-123",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
      [field]: value,
    };

    const response = await request(app).post("/simulations").send(input);

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      error: "ValidationError",
      message: "Invalid simulation data",
    });

    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: [field],
        }),
      ]),
    );

    expect(createSimulation).not.toHaveBeenCalled();
  });
  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["whitespace only", "   "],
    ["null", null],
    ["number", 123],
  ] as const)(
    "returns HTTP 400 for %s customer ID",
    async (_description, customerId) => {
      const input = {
        customerId,
        activeUsers: 15,
        storageGb: 100,
        apiCalls: 5000,
      };

      const response = await request(app).post("/simulations").send(input);

      expect(response.status).toBe(400);

      expect(response.body).toMatchObject({
        error: "ValidationError",
        message: "Invalid simulation data",
      });

      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["customerId"],
          }),
        ]),
      );

      expect(createSimulation).not.toHaveBeenCalled();
    },
  );
  it("returns HTTP 404 when the customer does not exist", async () => {
    vi.mocked(createSimulation).mockRejectedValue(new CustomerNotFoundError());

    const response = await request(app).post("/simulations").send({
      customerId: "non-existent-customer",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: "CustomerNotFoundError",
      message: "Customer not found",
    });

    expect(createSimulation).toHaveBeenCalledExactlyOnceWith({
      customerId: "non-existent-customer",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    });
  });
  it("returns HTTP 500 without exposing internal database errors", async () => {
    const databaseError = new Error("Sensitive database connection details");

    vi.mocked(createSimulation).mockRejectedValue(databaseError);

    const response = await request(app).post("/simulations").send({
      customerId: "customer-123",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      error: "InternalServerError",
      message: "An unexpected error occurred",
    });

    expect(JSON.stringify(response.body)).not.toContain(
      "Sensitive database connection details",
    );

    expect(createSimulation).toHaveBeenCalledOnce();
  });
});

describe("GET /simulations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the first 10 simulations by default", async () => {
    const customerId = "customer-123";

    const simulations = [
      {
        id: "simulation-2",
        customerId,
        totalCents: 16940,
      },
      {
        id: "simulation-1",
        customerId,
        totalCents: 12100,
      },
    ];

    vi.mocked(listSimulations).mockResolvedValue(simulations as never);

    const response = await request(app)
      .get("/simulations")
      .query({ customerId });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(simulations);

    expect(listSimulations).toHaveBeenCalledExactlyOnceWith(customerId, 0, 10);
  });

  it("returns the second page of simulations", async () => {
    const customerId = "customer-123";

    const simulations = [
      {
        id: "simulation-11",
        customerId,
        totalCents: 6050,
      },
    ];

    vi.mocked(listSimulations).mockResolvedValue(simulations as never);

    const response = await request(app).get("/simulations").query({
      customerId,
      skip: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(simulations);

    expect(listSimulations).toHaveBeenCalledExactlyOnceWith(customerId, 10, 10);
  });

  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["whitespace only", "   "],
  ] as const)(
    "returns HTTP 400 for %s customer ID",
    async (_description, customerId) => {
      const response = await request(app)
        .get("/simulations")
        .query(customerId === undefined ? {} : { customerId });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        error: "ValidationError",
        message: "Customer ID is required",
      });

      expect(listSimulations).not.toHaveBeenCalled();
    },
  );

  it.each(["-1", "abc", "1.5", "9007199254740992"])(
    "returns HTTP 400 for invalid skip value %s",
    async (skip) => {
      const response = await request(app).get("/simulations").query({
        customerId: "customer-123",
        skip,
      });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        error: "ValidationError",
        message: "Skip must be a non-negative integer",
      });

      expect(listSimulations).not.toHaveBeenCalled();
    },
  );

  it("returns an empty array when the customer has no simulations", async () => {
    const customerId = "customer-without-simulations";

    vi.mocked(listSimulations).mockResolvedValue([]);

    const response = await request(app)
      .get("/simulations")
      .query({ customerId });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

    expect(listSimulations).toHaveBeenCalledExactlyOnceWith(customerId, 0, 10);
  });
});
