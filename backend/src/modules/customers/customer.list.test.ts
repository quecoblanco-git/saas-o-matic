// Comprueba filtros y ordenación de la búsqueda de clientes.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { listCustomers } from "./customer.service.js";

const { findManyMock } = vi.hoisted(() => ({
  findManyMock: vi.fn(),
}));

vi.mock("../../lib/prisma.js", () => ({
  prisma: {
    customer: {
      findMany: findManyMock,
    },
  },
}));

describe("listCustomers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all customers ordered by creation date", async () => {
    const customers = [
      {
        id: "customer-2",
        companyName: "Beta Company",
        taxId: "87654321X",
        email: "beta@example.com",
        country: "ES",
        plan: "Enterprise",
        createdAt: new Date("2026-11-12T12:00:00.000Z"),
      },
      {
        id: "customer-1",
        companyName: "Alpha Company",
        taxId: "12345678Z",
        email: "alpha@example.com",
        country: "ES",
        plan: "Starter",
        createdAt: new Date("2026-11-11T12:00:00.000Z"),
      },
    ];

    findManyMock.mockResolvedValue(customers);

    const result = await listCustomers();

    expect(findManyMock).toHaveBeenCalledExactlyOnceWith({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    expect(result).toEqual(customers);
  });
  it("filters customers by partial company name", async () => {
    const customers = [
      {
        id: "customer-1",
        companyName: "Tech Solutions",
        taxId: "12345678Z",
        email: "contact@techsolutions.com",
        country: "ES",
        plan: "Professional",
        createdAt: new Date("2026-11-12T12:00:00.000Z"),
      },
    ];

    findManyMock.mockResolvedValue(customers);

    const result = await listCustomers("tech");

    expect(findManyMock).toHaveBeenCalledExactlyOnceWith({
      where: {
        OR: [
          {
            companyName: {
              contains: "tech",
            },
          },
          {
            taxId: {
              contains: "TECH",
            },
          },
        ],
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    expect(result).toEqual(customers);
  });
  it("filters customers by partial tax ID", async () => {
    const customers = [
      {
        id: "customer-3",
        companyName: "Empresa Ejemplo",
        taxId: "B12345674",
        email: "contacto@ejemplo.com",
        country: "ES",
        plan: "Professional",
        createdAt: new Date("2026-11-12T14:00:00.000Z"),
      },
    ];

    findManyMock.mockResolvedValue(customers);

    const result = await listCustomers("b123");

    expect(findManyMock).toHaveBeenCalledExactlyOnceWith({
      where: {
        OR: [
          {
            companyName: {
              contains: "b123",
            },
          },
          {
            taxId: {
              contains: "B123",
            },
          },
        ],
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    expect(result).toEqual(customers);
  });
  it("trims whitespace from the search term", async () => {
    findManyMock.mockResolvedValue([]);

    const result = await listCustomers("  tech  ");

    expect(findManyMock).toHaveBeenCalledExactlyOnceWith({
      where: {
        OR: [
          {
            companyName: {
              contains: "tech",
            },
          },
          {
            taxId: {
              contains: "TECH",
            },
          },
        ],
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    expect(result).toEqual([]);
  });
  it("returns all customers when search contains only whitespace", async () => {
    findManyMock.mockResolvedValue([]);

    const result = await listCustomers("   ");

    expect(findManyMock).toHaveBeenCalledExactlyOnceWith({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    expect(result).toEqual([]);
  });
});
