import type { CustomerCountry, CustomerPlan } from "./customer";

export interface CreateSimulationInput {
  customerId: string;
  activeUsers: number;
  storageGb: number;
  apiCalls: number;
}

export interface Simulation {
  id: string;
  customerId: string;

  activeUsers: number;
  storageGb: number;
  apiCalls: number;

  planSnapshot: CustomerPlan;
  countrySnapshot: CustomerCountry;
  taxRateSnapshot: string;

  usersCostCents: number;
  subtotalCents: number;
  taxCents: number;
  totalCents: number;

  createdAt: string;
}
