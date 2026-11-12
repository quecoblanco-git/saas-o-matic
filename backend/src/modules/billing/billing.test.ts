import { describe, expect, it } from "vitest";
import {
  calculateApiCost,
  calculateMonthlyBill,
  calculatePlanCost,
  calculateStorageCost,
  calculateSubtotal,
  calculateTax,
  calculateUsersCost,
  eurosToCents,
  type SubscriptionPlan,
} from "./billing.js";

describe("calculateUsersCost", () => {
  it.each([
    [0, "0"],
    [1, "10"],
    [10, "100"],
    [11, "108"],
    [15, "140"],
    [50, "420"],
    [51, "425"],
    [100, "670"],
  ])("calculates %i users as %s EUR", (users, expected) => {
    const result = calculateUsersCost(users);

    expect(result.toString()).toBe(expected);
  });
  it.each([[-1], [1.5], [100001], [NaN], [Infinity]])(
    "rejects invalid user count: %s",
    (users) => {
      expect(() => calculateUsersCost(users)).toThrow(RangeError);
    },
  );
});

describe("calculatePlanCost", () => {
  it.each([
    ["Starter", "0"],
    ["Professional", "29"],
    ["Enterprise", "99"],
  ])("calculates the %s plan as %s EUR", (plan, expected) => {
    const result = calculatePlanCost(plan as SubscriptionPlan);

    expect(result.toString()).toBe(expected);
  });
  it.each([["Basic"], ["Premium"], [""], ["starter"]])(
    "rejects invalid subscription plan: %s",
    (plan) => {
      expect(() => calculatePlanCost(plan as SubscriptionPlan)).toThrow(
        RangeError,
      );
    },
  );
});

describe("calculateStorageCost", () => {
  it.each([
    [0, "0"],
    [1, "0.1"],
    [10, "1"],
    [100, "10"],
    [250, "25"],
    [1000000, "100000"],
  ])("calculates %i GB as %s EUR", (storageGb, expected) => {
    const result = calculateStorageCost(storageGb);

    expect(result.toString()).toBe(expected);
  });
  it.each([[-1], [1.5], [1000001], [NaN], [Infinity]])(
    "rejects invalid storage amount: %s",
    (storageGb) => {
      expect(() => calculateStorageCost(storageGb)).toThrow(RangeError);
    },
  );
});

describe("calculateApiCost", () => {
  it.each([
    [0, "0"],
    [1, "0.001"],
    [500, "0.5"],
    [1000, "1"],
    [1500, "1.5"],
    [5000, "5"],
    [100000000, "100000"],
  ])("calculates %i API calls as %s EUR", (apiCalls, expected) => {
    const result = calculateApiCost(apiCalls);

    expect(result.toString()).toBe(expected);
  });
  it.each([[-1], [1.5], [100000001], [NaN], [Infinity]])(
    "rejects invalid API call count: %s",
    (apiCalls) => {
      expect(() => calculateApiCost(apiCalls)).toThrow(RangeError);
    },
  );
});

describe("calculateSubtotal", () => {
  it("calculates a Professional subscription correctly", () => {
    const result = calculateSubtotal({
      activeUsers: 15,
      plan: "Professional",
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(result.toString()).toBe("184");
  });

  it("calculates an empty Starter subscription as zero", () => {
    const result = calculateSubtotal({
      activeUsers: 0,
      plan: "Starter",
      storageGb: 0,
      apiCalls: 0,
    });

    expect(result.toString()).toBe("0");
  });

  it("rounds the subtotal to two decimal places", () => {
    const result = calculateSubtotal({
      activeUsers: 0,
      plan: "Starter",
      storageGb: 0,
      apiCalls: 5,
    });

    expect(result.toFixed(2)).toBe("0.01");
  });
});

describe("calculateTax", () => {
  it.each([
    ["ES", "38.64"],
    ["FR", "36.8"],
    ["DE", "34.96"],
  ])("calculates tax for %s correctly", (country, expected) => {
    const result = calculateTax("184", country);

    expect(result.toString()).toBe(expected);
  });

  it("rounds tax to two decimal places", () => {
    const result = calculateTax("0.05", "ES");

    expect(result.toFixed(2)).toBe("0.01");
  });

  it("calculates zero tax for a zero subtotal", () => {
    const result = calculateTax("0", "ES");

    expect(result.toString()).toBe("0");
  });
  it.each(["IT", "PT", "", "es"])(
    "rejects invalid billing country: %s",
    (country) => {
      expect(() => calculateTax("100", country)).toThrow(RangeError);
    },
  );

  it.each(["-1", "NaN", "Infinity"])(
    "rejects invalid subtotal: %s",
    (subtotal) => {
      expect(() => calculateTax(subtotal, "ES")).toThrow(RangeError);
    },
  );
});

describe("calculateMonthlyBill", () => {
  it.each([
    ["ES", "38.64", "222.64"],
    ["FR", "36.8", "220.8"],
    ["DE", "34.96", "218.96"],
  ])(
    "calculates the complete monthly bill for %s",
    (country, expectedTax, expectedTotal) => {
      const result = calculateMonthlyBill({
        activeUsers: 15,
        plan: "Professional",
        storageGb: 100,
        apiCalls: 5000,
        country,
      });

      expect(result.subtotal.toString()).toBe("184");
      expect(result.tax.toString()).toBe(expectedTax);
      expect(result.total.toString()).toBe(expectedTotal);
    },
  );

  it("calculates a zero-cost Starter subscription", () => {
    const result = calculateMonthlyBill({
      activeUsers: 0,
      plan: "Starter",
      storageGb: 0,
      apiCalls: 0,
      country: "ES",
    });

    expect(result.subtotal.toString()).toBe("0");
    expect(result.tax.toString()).toBe("0");
    expect(result.total.toString()).toBe("0");
  });

  it("rounds the subtotal before calculating tax", () => {
    const result = calculateMonthlyBill({
      activeUsers: 0,
      plan: "Starter",
      storageGb: 0,
      apiCalls: 5,
      country: "ES",
    });

    expect(result.subtotal.toFixed(2)).toBe("0.01");
    expect(result.tax.toFixed(2)).toBe("0.00");
    expect(result.total.toFixed(2)).toBe("0.01");
  });
});

describe("eurosToCents", () => {
  it.each([
    ["0", 0],
    ["0.01", 1],
    ["29", 2900],
    ["184", 18400],
    ["222.64", 22264],
    ["0.005", 1],
    ["0.004", 0],
  ])("converts %s EUR to %i cents", (euros, expected) => {
    const result = eurosToCents(euros);

    expect(result).toBe(expected);
  });
  it.each([["-1"], ["NaN"], ["Infinity"], ["90071992547409.92"]])(
    "rejects invalid euro amount: %s",
    (euros) => {
      expect(() => eurosToCents(euros)).toThrow(RangeError);
    },
  );
});
