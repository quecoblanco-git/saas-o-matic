import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCustomer } from "./customer.service.js";
import { Prisma } from "../../generated/prisma/client.js";

const { createMock } = vi.hoisted(() => ({
  createMock: vi.fn(),
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    customer: {
      create: createMock,
    },
  },
}));

describe("createCustomer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validCustomer = {
    companyName: "Example Company",
    taxId: "12345678Z",
    email: "contact@example.com",
    country: "ES" as const,
    plan: "Professional" as const,
  };

  it("creates a customer using Prisma", async () => {
    const savedCustomer = {
      id: "customer-123",
      ...validCustomer,
      createdAt: new Date("2026-11-12T12:00:00.000Z"),
    };

    createMock.mockResolvedValue(savedCustomer);

    const result = await createCustomer(validCustomer);

    expect(createMock).toHaveBeenCalledExactlyOnceWith({
      data: validCustomer,
    });

    expect(result).toEqual(savedCustomer);
  });

  it("returns the generated customer ID", async () => {
    createMock.mockResolvedValue({
      id: "customer-456",
      ...validCustomer,
      createdAt: new Date(),
    });

    const result = await createCustomer(validCustomer);

    expect(result.id).toBe("customer-456");
  });

  it("propagates unexpected database errors", async () => {
    createMock.mockRejectedValue(new Error("Database unavailable"));

    await expect(createCustomer(validCustomer)).rejects.toThrow(
      "Database unavailable",
    );
  });
  it("throws a specific error for a duplicate country and tax ID", async () => {
    const duplicateError = new Prisma.PrismaClientKnownRequestError(
      "Unique constraint failed on the fields: (country, taxId)",
      {
        code: "P2002",
        clientVersion: "7.10.1",
        meta: {
          modelName: "Customer",
          target: ["country", "taxId"],
        },
      },
    );

    createMock.mockRejectedValue(duplicateError);

    await expect(createCustomer(validCustomer)).rejects.toMatchObject({
      name: "DuplicateCustomerError",
      message: "A customer with this tax ID already exists in this country",
    });
  });
});
