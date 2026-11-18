// Calcula vistas previas, persiste simulaciones y pagina su historial.
import { prisma } from "../../lib/prisma.js";
import {
  calculateMonthlyBill,
  calculateUserTierBreakdown,
  calculateUsersCost,
  eurosToCents,
  getTaxRate,
} from "../billing/billing.js";
import type { CreateSimulationInput } from "./simulation.schema.js";

export class CustomerNotFoundError extends Error {
  constructor() {
    super("Customer not found");
    this.name = "CustomerNotFoundError";
  }
}

export async function previewSimulation(input: CreateSimulationInput) {
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

  const taxRate = getTaxRate(customer.country);

  const usersCost = calculateUsersCost(input.activeUsers);

  return {
    customerId: customer.id,
    activeUsers: input.activeUsers,
    storageGb: input.storageGb,
    apiCalls: input.apiCalls,
    plan: customer.plan,
    country: customer.country,
    taxRate,
    tierBreakdown: calculateUserTierBreakdown(input.activeUsers),
    usersCostCents: eurosToCents(usersCost.toFixed(2)),
    subtotalCents: eurosToCents(bill.subtotal.toFixed(2)),
    taxCents: eurosToCents(bill.tax.toFixed(2)),
    totalCents: eurosToCents(bill.total.toFixed(2)),
  };
}

export async function createSimulation(input: CreateSimulationInput) {
  // Reutilizar la vista previa mantiene las mismas reglas y validaciones al guardar.
  const preview = await previewSimulation(input);

  return prisma.simulation.create({
    data: {
      customerId: preview.customerId,
      activeUsers: preview.activeUsers,
      storageGb: preview.storageGb,
      apiCalls: preview.apiCalls,
      planSnapshot: preview.plan,
      countrySnapshot: preview.country,
      taxRateSnapshot: preview.taxRate,
      usersCostCents: preview.usersCostCents,
      subtotalCents: preview.subtotalCents,
      taxCents: preview.taxCents,
      totalCents: preview.totalCents,
    },
  });
}

export async function listSimulations(customerId: string, skip = 0, take = 10) {
  return prisma.simulation.findMany({
    where: {
      customerId,
    },
    // El id desempata fechas iguales y mantiene estable la paginación.
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip,
    take,
  });
}
