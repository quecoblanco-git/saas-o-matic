import { describe, expect, it } from "vitest";
import { createSimulationSchema } from "./simulation.schema.js";

describe("createSimulationSchema", () => {
  it("accepts valid simulation data", () => {
    const input = {
      customerId: "customer-123",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    };

    const result = createSimulationSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });

  it("trims whitespace from the customer ID", () => {
    const input = {
      customerId: "  customer-123  ",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    };

    const result = createSimulationSchema.parse(input);

    expect(result.customerId).toBe("customer-123");
  });

  it("accepts zero usage values", () => {
    const result = createSimulationSchema.safeParse({
      customerId: "customer-123",
      activeUsers: 0,
      storageGb: 0,
      apiCalls: 0,
    });

    expect(result.success).toBe(true);
  });
  it.each([
    ["activeUsers", -1],
    ["storageGb", -1],
    ["apiCalls", -1],
  ] as const)("rejects negative values for %s", (field, value) => {
    const input = {
      customerId: "customer-123",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
      [field]: value,
    };

    const result = createSimulationSchema.safeParse(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(
        true,
      );
    }
  });
  it.each([
    ["activeUsers", 15.5],
    ["storageGb", 100.5],
    ["apiCalls", 5000.5],
  ] as const)("rejects decimal values for %s", (field, value) => {
    const input = {
      customerId: "customer-123",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
      [field]: value,
    };

    const result = createSimulationSchema.safeParse(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(
        true,
      );
    }
  });
  it.each([
    ["activeUsers", 100001],
    ["storageGb", 1000001],
    ["apiCalls", 100000001],
  ] as const)("rejects values exceeding the maximum for %s", (field, value) => {
    const input = {
      customerId: "customer-123",
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
      [field]: value,
    };

    const result = createSimulationSchema.safeParse(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === field)).toBe(
        true,
      );
    }
  });
  it.each([
    ["missing", undefined],
    ["empty", ""],
    ["whitespace only", "   "],
    ["null", null],
    ["number", 123],
  ] as const)("rejects %s customer ID", (_description, customerId) => {
    const input = {
      customerId,
      activeUsers: 15,
      storageGb: 100,
      apiCalls: 5000,
    };

    const result = createSimulationSchema.safeParse(input);

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === "customerId"),
      ).toBe(true);
    }
  });
  it("accepts the maximum allowed usage values", () => {
    const input = {
      customerId: "customer-123",
      activeUsers: 100000,
      storageGb: 1000000,
      apiCalls: 100000000,
    };

    const result = createSimulationSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual(input);
    }
  });
});
