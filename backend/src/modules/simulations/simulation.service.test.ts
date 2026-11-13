import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createSimulation,
  listSimulations,
  CustomerNotFoundError,
} from "./simulation.service.js";

const { findUniqueMock, createMock, findManyMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
  createMock: vi.fn(),
  findManyMock: vi.fn(),
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    customer: {
      findUnique: findUniqueMock,
    },
    simulation: {
      create: createMock,
      findMany: findManyMock,
    },
  },
}));

describe("createSimulation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects a simulation when the customer does not exist", async () => {
    findUniqueMock.mockResolvedValue(null);

    const input = {
      customerId: "non-existent-customer",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    };

    await expect(createSimulation(input)).rejects.toBeInstanceOf(
      CustomerNotFoundError,
    );

    expect(findUniqueMock).toHaveBeenCalledExactlyOnceWith({
      where: {
        id: "non-existent-customer",
      },
    });

    expect(createMock).not.toHaveBeenCalled();
  });
  it("calculates and saves a simulation for an existing customer", async () => {
    const customer = {
      id: "customer-123",
      companyName: "Tech Solutions",
      taxId: "B12345674",
      email: "contact@techsolutions.com",
      country: "ES",
      plan: "Professional",
      createdAt: new Date("2026-11-13T10:00:00.000Z"),
    };

    const savedSimulation = {
      id: "simulation-123",
      customerId: customer.id,
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
      planSnapshot: "Professional",
      countrySnapshot: "ES",
      taxRateSnapshot: "0.21",
      usersCostCents: 14000,
      subtotalCents: 14000,
      taxCents: 2940,
      totalCents: 16940,
      createdAt: new Date("2026-11-13T12:00:00.000Z"),
    };

    findUniqueMock.mockResolvedValue(customer);
    createMock.mockResolvedValue(savedSimulation);

    const result = await createSimulation({
      customerId: "customer-123",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(createMock).toHaveBeenCalledExactlyOnceWith({
      data: {
        customerId: "customer-123",
        activeUsers: 15,
        storageGb: 100,
        apiCalls: 5000,
        planSnapshot: "Professional",
        countrySnapshot: "ES",
        taxRateSnapshot: "0.21",
        usersCostCents: 14000,
        subtotalCents: 14000,
        taxCents: 2940,
        totalCents: 16940,
      },
    });

    expect(result).toEqual(savedSimulation);
  });
  it("preserves the customer's plan and country in the simulation snapshot", async () => {
    const customer = {
      id: "customer-fr",
      companyName: "Entreprise Française",
      taxId: "123456789",
      email: "contact@example.fr",
      country: "FR",
      plan: "Enterprise",
      createdAt: new Date("2026-11-13T10:00:00.000Z"),
    };

    findUniqueMock.mockResolvedValue(customer);
    createMock.mockImplementation(async ({ data }) => ({
      id: "simulation-fr",
      ...data,
      createdAt: new Date("2026-11-13T12:00:00.000Z"),
    }));

    const result = await createSimulation({
      customerId: "customer-fr",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(createMock).toHaveBeenCalledWith({
      data: expect.objectContaining({
        planSnapshot: "Enterprise",
        countrySnapshot: "FR",
        taxRateSnapshot: "0.20",
        usersCostCents: 14000,
        subtotalCents: 14000,
        taxCents: 2800,
        totalCents: 16800,
      }),
    });

    expect(result.planSnapshot).toBe("Enterprise");
    expect(result.countrySnapshot).toBe("FR");
    expect(result.taxRateSnapshot).toBe("0.20");
  });
  it("saves a zero-cost simulation when there are no active users", async () => {
    const customer = {
      id: "customer-zero",
      companyName: "Zero Users Company",
      taxId: "B12345674",
      email: "zero@example.com",
      country: "ES",
      plan: "Enterprise",
      createdAt: new Date("2026-11-13T10:00:00.000Z"),
    };

    findUniqueMock.mockResolvedValue(customer);

    createMock.mockImplementation(async ({ data }) => ({
      id: "simulation-zero",
      ...data,
      createdAt: new Date("2026-11-13T12:00:00.000Z"),
    }));

    const result = await createSimulation({
      customerId: "customer-zero",
      activeUsers: 0,
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(createMock).toHaveBeenCalledExactlyOnceWith({
      data: {
        customerId: "customer-zero",
        activeUsers: 0,
        storageGb: 100,
        apiCalls: 5000,
        planSnapshot: "Enterprise",
        countrySnapshot: "ES",
        taxRateSnapshot: "0.21",
        usersCostCents: 0,
        subtotalCents: 0,
        taxCents: 0,
        totalCents: 0,
      },
    });

    expect(result.totalCents).toBe(0);
  });
  it("propagates unexpected database errors when saving a simulation", async () => {
    const customer = {
      id: "customer-error",
      companyName: "Error Test Company",
      taxId: "B12345674",
      email: "error@example.com",
      country: "ES",
      plan: "Professional",
      createdAt: new Date("2026-11-13T10:00:00.000Z"),
    };

    findUniqueMock.mockResolvedValue(customer);

    const databaseError = new Error("Sensitive database connection details");

    createMock.mockRejectedValue(databaseError);

    await expect(
      createSimulation({
        customerId: "customer-error",
        activeUsers: 15,
        storageGb: 100,
        apiCalls: 5000,
      }),
    ).rejects.toBe(databaseError);

    expect(findUniqueMock).toHaveBeenCalledExactlyOnceWith({
      where: {
        id: "customer-error",
      },
    });

    expect(createMock).toHaveBeenCalledOnce();
  });
});

describe("listSimulations", () => {
  it("returns the simulations of a customer ordered by newest first", async () => {
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

    findManyMock.mockResolvedValue(simulations);

    const result = await listSimulations(customerId);

    expect(result).toEqual(simulations);

    expect(findManyMock).toHaveBeenCalledExactlyOnceWith({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });
});
