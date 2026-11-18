import { apiRequest } from "./client";
import type { CreateSimulationInput, Simulation } from "../types/simulation";
export interface SimulationPreview {
  customerId: string;
  activeUsers: number;
  storageGb: number;
  apiCalls: number;
  plan: string;
  country: string;
  taxRate: string;
  tierBreakdown: {
    tier: 1 | 2 | 3;
    userCount: number;
    unitPriceCents: number;
    totalCents: number;
  }[];
  usersCostCents: number;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
}

export async function createSimulation(
  input: CreateSimulationInput,
): Promise<Simulation> {
  return apiRequest<Simulation>("/simulations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getSimulations(
  customerId: string,
  skip = 0,
): Promise<Simulation[]> {
  const params = new URLSearchParams({
    customerId,
    skip: String(skip),
  });

  return apiRequest<Simulation[]>(`/simulations?${params.toString()}`);
}

export async function previewSimulation(
  input: CreateSimulationInput,
): Promise<SimulationPreview> {
  return apiRequest<SimulationPreview>("/simulations/preview", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
