// Comprueba operaciones de clientes sobre la base SQLite de pruebas.
import "dotenv/config";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { listCustomers } from "./customer.service.js";

const adapter = new PrismaBetterSqlite3({
  url: "file:./test.db",
});

const testPrisma = new PrismaClient({ adapter });

describe("Customer SQLite integration", () => {
  beforeAll(async () => {
    await testPrisma.$connect();
  });
  afterEach(async () => {
    await testPrisma.customer.deleteMany({
      where: {
        email: {
          endsWith: "@integration-test.example",
        },
      },
    });
  });
  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  it("connects to the isolated test database", async () => {
    const customers = await testPrisma.customer.findMany();

    expect(Array.isArray(customers)).toBe(true);
  });

  it("finds customers by partial company name ignoring case", async () => {
    const customer = await testPrisma.customer.create({
      data: {
        companyName: "Tech Solutions Integration",
        taxId: `INT-${Date.now()}`,
        email: "tech@integration-test.example",
        country: "ES",
        plan: "Professional",
      },
    });

    const results = await testPrisma.customer.findMany({
      where: {
        companyName: {
          contains: "tech solutions",
        },
      },
    });

    expect(results.some((result) => result.id === customer.id)).toBe(true);
  });
  it("finds customers by partial tax ID ignoring case", async () => {
    const customer = await testPrisma.customer.create({
      data: {
        companyName: "Fiscal ID Integration Test",
        taxId: `B${Date.now()}`,
        email: "fiscal@integration-test.example",
        country: "ES",
        plan: "Starter",
      },
    });

    const results = await testPrisma.customer.findMany({
      where: {
        taxId: {
          contains: "b",
        },
      },
    });

    expect(results.some((result) => result.id === customer.id)).toBe(true);
  });
  it("removes temporary customers after integration tests", async () => {
    const temporaryCustomers = await testPrisma.customer.findMany({
      where: {
        email: {
          endsWith: "@integration-test.example",
        },
      },
    });

    expect(temporaryCustomers).toEqual([]);
  });
  it("searches customers through the real listCustomers service", async () => {
    const customer = await testPrisma.customer.create({
      data: {
        companyName: "Integration Software Solutions",
        taxId: `INT-SERVICE-${Date.now()}`,
        email: "service@integration-test.example",
        country: "ES",
        plan: "Professional",
      },
    });

    const results = await listCustomers("integration software", testPrisma);

    expect(results.some((result) => result.id === customer.id)).toBe(true);
  });
  it("searches customers by tax ID through the real service", async () => {
    const customer = await testPrisma.customer.create({
      data: {
        companyName: "Fiscal Search Integration",
        taxId: `B${Date.now()}`,
        email: "fiscal-service@integration-test.example",
        country: "ES",
        plan: "Starter",
      },
    });

    const results = await listCustomers(
      customer.taxId.slice(0, 5).toLowerCase(),
      testPrisma,
    );

    expect(results.some((result) => result.id === customer.id)).toBe(true);
  });
  it("returns customers ordered by creation date descending", async () => {
    const olderCustomer = await testPrisma.customer.create({
      data: {
        companyName: "Ordering Test Older",
        taxId: `OLD-${Date.now()}`,
        email: "older@integration-test.example",
        country: "ES",
        plan: "Starter",
        createdAt: new Date("2025-01-01T12:00:00.000Z"),
      },
    });

    const newerCustomer = await testPrisma.customer.create({
      data: {
        companyName: "Ordering Test Newer",
        taxId: `NEW-${Date.now()}`,
        email: "newer@integration-test.example",
        country: "ES",
        plan: "Professional",
        createdAt: new Date("2026-01-01T12:00:00.000Z"),
      },
    });

    const results = await listCustomers("Ordering Test", testPrisma);

    const matchingIds = results
      .filter((customer) =>
        [olderCustomer.id, newerCustomer.id].includes(customer.id),
      )
      .map((customer) => customer.id);

    expect(matchingIds).toEqual([newerCustomer.id, olderCustomer.id]);
  });
  it("orders customers by ID when creation dates are equal", async () => {
    const sharedDate = new Date("2026-01-01T12:00:00.000Z");

    const firstCustomer = await testPrisma.customer.create({
      data: {
        id: "integration-order-a",
        companyName: "Tie Break Integration A",
        taxId: "INTEGRATION-ORDER-A",
        email: "order-a@integration-test.example",
        country: "ES",
        plan: "Starter",
        createdAt: sharedDate,
      },
    });

    const secondCustomer = await testPrisma.customer.create({
      data: {
        id: "integration-order-z",
        companyName: "Tie Break Integration Z",
        taxId: "INTEGRATION-ORDER-Z",
        email: "order-z@integration-test.example",
        country: "ES",
        plan: "Starter",
        createdAt: sharedDate,
      },
    });

    const results = await listCustomers("Tie Break Integration", testPrisma);

    expect(results.map((customer) => customer.id)).toEqual([
      secondCustomer.id,
      firstCustomer.id,
    ]);
  });

  it("returns an empty list when no customers match the search", async () => {
    const results = await listCustomers(
      "NO_MATCH_CUSTOMER_SEARCH_987654321",
      testPrisma,
    );

    expect(results).toEqual([]);
  });
});
