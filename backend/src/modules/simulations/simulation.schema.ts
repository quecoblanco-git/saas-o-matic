import { z } from "zod";

export const createSimulationSchema = z.object({
  customerId: z.string().trim().min(1, "Customer ID is required"),

  activeUsers: z
    .number()
    .int("Active users must be an integer")
    .min(0, "Active users cannot be negative")
    .max(100000, "Active users cannot exceed 100000"),

  storageGb: z
    .number()
    .int("Storage must be an integer")
    .min(0, "Storage cannot be negative")
    .max(1000000, "Storage cannot exceed 1000000"),

  apiCalls: z
    .number()
    .int("API calls must be an integer")
    .min(0, "API calls cannot be negative")
    .max(100000000, "API calls cannot exceed 100000000"),
});

export type CreateSimulationInput = z.infer<typeof createSimulationSchema>;
