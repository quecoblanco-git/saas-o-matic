// Comprueba persistencia, vista previa, snapshots e historial con SQLite.
import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { prisma } from "../../lib/prisma.js";

describe("Simulation integration tests", () => {
  const createdCustomerIds: string[] = [];

  it("uses the dedicated test database", () => {
    expect(process.env.DATABASE_URL).toBe("file:./test.db");
  });

  afterAll(async () => {
    for (const customerId of createdCustomerIds) {
      await prisma.simulation.deleteMany({
        where: { customerId },
      });

      await prisma.customer.delete({
        where: { id: customerId },
      });
    }

    await prisma.$disconnect();
  });

  it("does not persist a simulation when the customer does not exist", async () => {
    const customerId = "non-existent-customer-integration-test";

    const countBefore = await prisma.simulation.count({
      where: { customerId },
    });

    const response = await request(app).post("/simulations").send({
      customerId,
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: "CustomerNotFoundError",
      message: "Customer not found",
    });

    const countAfter = await prisma.simulation.count({
      where: { customerId },
    });

    expect(countAfter).toBe(countBefore);
    expect(countAfter).toBe(0);
  });

  it("does not persist a simulation when requesting a billing preview", async () => {
    const customer = await prisma.customer.create({
      data: {
        companyName: "Simulation Preview Integration Test",
        taxId: "TEST-PREVIEW-001",
        email: "preview-integration@example.com",
        country: "ES",
        plan: "Professional",
      },
    });

    // Registrar el cliente para eliminarlo al finalizar las pruebas.
    createdCustomerIds.push(customer.id);

    const countBefore = await prisma.simulation.count({
      where: { customerId: customer.id },
    });

    const response = await request(app).post("/simulations/preview").send({
      customerId: customer.id,
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      customerId: customer.id,
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
      usersCostCents: 14000,
      subtotalCents: 14000,
      taxCents: 2940,
      totalCents: 16940,
    });

    const countAfter = await prisma.simulation.count({
      where: { customerId: customer.id },
    });

    expect(countAfter).toBe(countBefore);
    expect(countAfter).toBe(0);
  });

  it("creates and persists a simulation through POST /simulations", async () => {
    const customer = await prisma.customer.create({
      data: {
        companyName: "Simulation Integration Test",
        taxId: "TEST-SIMULATION-001",
        email: "simulation-integration@example.com",
        country: "ES",
        plan: "Professional",
      },
    });

    createdCustomerIds.push(customer.id);

    const response = await request(app).post("/simulations").send({
      customerId: customer.id,
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(response.status).toBe(201);

    expect(response.body).toMatchObject({
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
    });

    const savedSimulation = await prisma.simulation.findUnique({
      where: { id: response.body.id },
    });

    expect(savedSimulation).not.toBeNull();
    expect(savedSimulation?.totalCents).toBe(16940);
  });
  it("preserves simulation snapshots after customer changes", async () => {
    const customer = await prisma.customer.create({
      data: {
        companyName: "Historical Snapshot Test",
        taxId: "TEST-SNAPSHOT-001",
        email: "snapshot-integration@example.com",
        country: "ES",
        plan: "Professional",
      },
    });

    createdCustomerIds.push(customer.id);

    const response = await request(app).post("/simulations").send({
      customerId: customer.id,
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(response.status).toBe(201);

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        country: "FR",
        plan: "Enterprise",
      },
    });

    const savedSimulation = await prisma.simulation.findUniqueOrThrow({
      where: { id: response.body.id },
    });

    expect(savedSimulation).toMatchObject({
      planSnapshot: "Professional",
      countrySnapshot: "ES",
      taxRateSnapshot: "0.21",
      usersCostCents: 14000,
      subtotalCents: 14000,
      taxCents: 2940,
      totalCents: 16940,
    });
  });
  it.each([
    ["ES", "0.21", 2940, 16940],
    ["FR", "0.20", 2800, 16800],
    ["DE", "0.19", 2660, 16660],
  ] as const)(
    "persists the correct tax for country %s",
    async (country, taxRate, taxCents, totalCents) => {
      const customer = await prisma.customer.create({
        data: {
          companyName: `Tax Integration Test ${country}`,
          taxId: `TEST-TAX-${country}`,
          email: `tax-${country.toLowerCase()}@example.com`,
          country,
          plan: "Starter",
        },
      });

      createdCustomerIds.push(customer.id);

      const response = await request(app).post("/simulations").send({
        customerId: customer.id,
        activeUsers: 15,
        storageGb: 100,
        apiCalls: 5000,
      });

      expect(response.status).toBe(201);

      const savedSimulation = await prisma.simulation.findUniqueOrThrow({
        where: { id: response.body.id },
      });

      expect(savedSimulation).toMatchObject({
        countrySnapshot: country,
        taxRateSnapshot: taxRate,
        usersCostCents: 14000,
        subtotalCents: 14000,
        taxCents,
        totalCents,
      });
    },
  );
  it("persists a zero-cost simulation with no active users", async () => {
    const customer = await prisma.customer.create({
      data: {
        companyName: "Zero Users Integration Test",
        taxId: "TEST-ZERO-USERS-001",
        email: "zero-users-integration@example.com",
        country: "ES",
        plan: "Enterprise",
      },
    });

    createdCustomerIds.push(customer.id);

    const response = await request(app).post("/simulations").send({
      customerId: customer.id,
      activeUsers: 0,
      storageGb: 1000,
      apiCalls: 100000,
    });

    expect(response.status).toBe(201);

    const savedSimulation = await prisma.simulation.findUniqueOrThrow({
      where: { id: response.body.id },
    });

    expect(savedSimulation).toMatchObject({
      customerId: customer.id,
      activeUsers: 0,
      storageGb: 1000,
      apiCalls: 100000,
      planSnapshot: "Enterprise",
      countrySnapshot: "ES",
      taxRateSnapshot: "0.21",
      usersCostCents: 0,
      subtotalCents: 0,
      taxCents: 0,
      totalCents: 0,
    });
  });
  it.each(["Starter", "Professional", "Enterprise"] as const)(
    "charges the same amount for plan %s",
    async (plan) => {
      const customer = await prisma.customer.create({
        data: {
          companyName: `Plan Integration Test ${plan}`,
          taxId: `TEST-PLAN-${plan}`,
          email: `plan-${plan.toLowerCase()}@example.com`,
          country: "ES",
          plan,
        },
      });

      createdCustomerIds.push(customer.id);

      const response = await request(app).post("/simulations").send({
        customerId: customer.id,
        activeUsers: 15,
        storageGb: 100,
        apiCalls: 5000,
      });

      expect(response.status).toBe(201);

      const savedSimulation = await prisma.simulation.findUniqueOrThrow({
        where: { id: response.body.id },
      });

      expect(savedSimulation).toMatchObject({
        planSnapshot: plan,
        countrySnapshot: "ES",
        usersCostCents: 14000,
        subtotalCents: 14000,
        taxCents: 2940,
        totalCents: 16940,
      });
    },
  );
  it.each([
    ["no usage", 0, 0],
    ["moderate usage", 100, 5000],
    ["maximum usage", 1000000, 100000000],
  ] as const)(
    "does not charge for storage or API calls with %s",
    async (_description, storageGb, apiCalls) => {
      const customer = await prisma.customer.create({
        data: {
          companyName: `Usage Integration Test ${_description}`,
          taxId: `TEST-USAGE-${storageGb}`,
          email: `usage-${storageGb}@example.com`,
          country: "ES",
          plan: "Professional",
        },
      });

      createdCustomerIds.push(customer.id);

      const response = await request(app).post("/simulations").send({
        customerId: customer.id,
        activeUsers: 15,
        storageGb,
        apiCalls,
      });

      expect(response.status).toBe(201);

      const savedSimulation = await prisma.simulation.findUniqueOrThrow({
        where: { id: response.body.id },
      });

      expect(savedSimulation).toMatchObject({
        activeUsers: 15,
        storageGb,
        apiCalls,
        usersCostCents: 14000,
        subtotalCents: 14000,
        taxCents: 2940,
        totalCents: 16940,
      });
    },
  );
  it("retrieves persisted simulations through GET /simulations", async () => {
    const customer = await prisma.customer.create({
      data: {
        companyName: "Simulation History Integration Test",
        taxId: "TEST-HISTORY-001",
        email: "history-integration@example.com",
        country: "ES",
        plan: "Professional",
      },
    });

    createdCustomerIds.push(customer.id);

    const firstResponse = await request(app).post("/simulations").send({
      customerId: customer.id,
      activeUsers: 5,
      storageGb: 50,
      apiCalls: 1000,
    });

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app).post("/simulations").send({
      customerId: customer.id,
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(secondResponse.status).toBe(201);

    const historyResponse = await request(app)
      .get("/simulations")
      .query({ customerId: customer.id });

    expect(historyResponse.status).toBe(200);
    expect(historyResponse.body).toHaveLength(2);

    expect(historyResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: firstResponse.body.id,
          customerId: customer.id,
          activeUsers: 5,
          totalCents: 6050,
        }),
        expect.objectContaining({
          id: secondResponse.body.id,
          customerId: customer.id,
          activeUsers: 15,
          totalCents: 16940,
        }),
      ]),
    );

    const dates = historyResponse.body.map(
      (simulation: { createdAt: string }) =>
        new Date(simulation.createdAt).getTime(),
    );

    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it("paginates 11 persisted simulations without duplicates", async () => {
    const customer = await prisma.customer.create({
      data: {
        companyName: "Simulation Pagination Integration Test",
        taxId: "TEST-PAGINATION-001",
        email: "pagination-integration@example.com",
        country: "ES",
        plan: "Professional",
      },
    });

    createdCustomerIds.push(customer.id);

    // Crear 11 simulaciones reales en SQLite.
    for (let index = 0; index < 11; index++) {
      const response = await request(app)
        .post("/simulations")
        .send({
          customerId: customer.id,
          activeUsers: index + 1,
          storageGb: 100,
          apiCalls: 5000,
        });

      expect(response.status).toBe(201);
    }

    const firstPage = await request(app).get("/simulations").query({
      customerId: customer.id,
      skip: 0,
    });

    expect(firstPage.status).toBe(200);
    expect(firstPage.body).toHaveLength(10);

    const secondPage = await request(app).get("/simulations").query({
      customerId: customer.id,
      skip: 10,
    });

    expect(secondPage.status).toBe(200);
    expect(secondPage.body).toHaveLength(1);

    const simulations = [...firstPage.body, ...secondPage.body];

    const ids = simulations.map((simulation: { id: string }) => simulation.id);

    expect(new Set(ids).size).toBe(11);

    // El identificador desempata fechas iguales para mantener el orden estable.
    const expectedOrder = [...simulations].sort(
      (
        a: { createdAt: string; id: string },
        b: { createdAt: string; id: string },
      ) => {
        const dateComparison =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        return dateComparison !== 0 ? dateComparison : b.id.localeCompare(a.id);
      },
    );

    expect(ids).toEqual(expectedOrder.map((simulation) => simulation.id));
  });

  it("returns only the simulations belonging to the requested customer", async () => {
    const firstCustomer = await prisma.customer.create({
      data: {
        companyName: "History Isolation Customer A",
        taxId: "TEST-ISOLATION-A",
        email: "isolation-a@example.com",
        country: "ES",
        plan: "Starter",
      },
    });

    createdCustomerIds.push(firstCustomer.id);

    const secondCustomer = await prisma.customer.create({
      data: {
        companyName: "History Isolation Customer B",
        taxId: "TEST-ISOLATION-B",
        email: "isolation-b@example.com",
        country: "FR",
        plan: "Enterprise",
      },
    });

    createdCustomerIds.push(secondCustomer.id);

    const firstSimulation = await request(app).post("/simulations").send({
      customerId: firstCustomer.id,
      activeUsers: 5,
      storageGb: 50,
      apiCalls: 1000,
    });

    const secondSimulation = await request(app).post("/simulations").send({
      customerId: secondCustomer.id,
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(firstSimulation.status).toBe(201);
    expect(secondSimulation.status).toBe(201);

    const response = await request(app)
      .get("/simulations")
      .query({ customerId: firstCustomer.id });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);

    expect(response.body[0]).toMatchObject({
      id: firstSimulation.body.id,
      customerId: firstCustomer.id,
      activeUsers: 5,
      totalCents: 6050,
    });

    expect(response.body).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: secondSimulation.body.id,
        }),
      ]),
    );
  });
});
