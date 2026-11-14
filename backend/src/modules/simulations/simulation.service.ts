import { prisma } from "../../lib/prisma.js";
import {
  calculateMonthlyBill,
  calculateUsersCost,
  eurosToCents,
} from "../billing/billing.js";
import type { CreateSimulationInput } from "./simulation.schema.js";

const TAX_RATES: Record<string, string> = {
  ES: "0.21",
  FR: "0.20",
  DE: "0.19",
};

export class CustomerNotFoundError extends Error {
  constructor() {
    super("Customer not found");
    this.name = "CustomerNotFoundError";
  }
}

export async function createSimulation(input: CreateSimulationInput) {
  const customer = await prisma.customer.findUnique({
    where: {
      id: input.customerId,
    },
  });

  if (!customer) {
    throw new CustomerNotFoundError();
  }

  const bill = calculateMonthlyBill({
    activeUsers: input.activeUsers,
    storageGb: input.storageGb,
    apiCalls: input.apiCalls,
    plan: customer.plan as "Starter" | "Professional" | "Enterprise",
    country: customer.country,
  });

  const taxRate = TAX_RATES[customer.country];

  if (taxRate === undefined) {
    throw new RangeError("Invalid customer country");
  }

  const usersCost = calculateUsersCost(input.activeUsers);

  return prisma.simulation.create({
    data: {
      customerId: customer.id,
      activeUsers: input.activeUsers,
      storageGb: input.storageGb,
      apiCalls: input.apiCalls,
      planSnapshot: customer.plan,
      countrySnapshot: customer.country,
      taxRateSnapshot: taxRate,
      usersCostCents: eurosToCents(usersCost.toFixed(2)),
      subtotalCents: eurosToCents(bill.subtotal.toFixed(2)),
      taxCents: eurosToCents(bill.tax.toFixed(2)),
      totalCents: eurosToCents(bill.total.toFixed(2)),
    },
  });
}
export async function listSimulations(customerId: string, skip = 0, take = 10) {
  return prisma.simulation.findMany({
    where: {
      customerId,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip,
    take,
  });
}
