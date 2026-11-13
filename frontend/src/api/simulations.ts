import { apiRequest } from "./client";
import type { CreateSimulationInput, Simulation } from "../types/simulation";

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
): Promise<Simulation[]> {
  const params = new URLSearchParams({
    customerId: customerId.trim(),
  });

  return apiRequest<Simulation[]>(`/simulations?${params.toString()}`);
}
