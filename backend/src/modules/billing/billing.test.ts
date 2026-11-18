import { describe, expect, it } from "vitest";
import {
  calculateApiCost,
  calculateMonthlyBill,
  calculatePlanCost,
  calculateStorageCost,
  calculateSubtotal,
  calculateTax,
  calculateUsersCost,
  calculateUserTierBreakdown,
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

describe("calculateUserTierBreakdown", () => {
  it("breaks down 15 users across the first two tiers", () => {
    expect(calculateUserTierBreakdown(15)).toEqual([
      { tier: 1, userCount: 10, unitPriceCents: 1000, totalCents: 10000 },
      { tier: 2, userCount: 5, unitPriceCents: 800, totalCents: 4000 },
      { tier: 3, userCount: 0, unitPriceCents: 500, totalCents: 0 },
    ]);
  });

  it("assigns users above 50 to the third tier", () => {
    expect(calculateUserTierBreakdown(51)).toEqual([
      { tier: 1, userCount: 10, unitPriceCents: 1000, totalCents: 10000 },
      { tier: 2, userCount: 40, unitPriceCents: 800, totalCents: 32000 },
      { tier: 3, userCount: 1, unitPriceCents: 500, totalCents: 500 },
    ]);
  });
});

describe("calculatePlanCost", () => {
  it.each([
    ["Starter", "0"],
    ["Professional", "0"],
    ["Enterprise", "0"],
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
    [1, "0"],
    [10, "0"],
    [100, "0"],
    [250, "0"],
    [1000000, "0"],
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
    [1, "0"],
    [500, "0"],
    [1000, "0"],
    [1500, "0"],
    [5000, "0"],
    [100000000, "0"],
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
  it("calculates a Professional subscription using only active users", () => {
    const result = calculateSubtotal({
      activeUsers: 15,
      plan: "Professional",
      storageGb: 100,
      apiCalls: 5000,
    });

    expect(result.toFixed(2)).toBe("140.00");
  });

  it("calculates an empty Starter subscription as zero", () => {
    const result = calculateSubtotal({
      activeUsers: 0,
      plan: "Starter",
      storageGb: 0,
      apiCalls: 0,
    });

    expect(result.toFixed(2)).toBe("0.00");
  });

  it("does not charge for storage or API calls", () => {
    const result = calculateSubtotal({
      activeUsers: 0,
      plan: "Enterprise",
      storageGb: 1000000,
      apiCalls: 100000000,
    });

    expect(result.toFixed(2)).toBe("0.00");
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
  const subscription = {
    activeUsers: 15,
    plan: "Professional" as const,
    storageGb: 100,
    apiCalls: 5000,
  };

  it("calculates the complete monthly bill for ES", () => {
    const result = calculateMonthlyBill({
      ...subscription,
      country: "ES",
    });

    expect(result.subtotal.toFixed(2)).toBe("140.00");
    expect(result.tax.toFixed(2)).toBe("29.40");
    expect(result.total.toFixed(2)).toBe("169.40");
  });

  it("calculates the complete monthly bill for FR", () => {
    const result = calculateMonthlyBill({
      ...subscription,
      country: "FR",
    });

    expect(result.subtotal.toFixed(2)).toBe("140.00");
    expect(result.tax.toFixed(2)).toBe("28.00");
    expect(result.total.toFixed(2)).toBe("168.00");
  });

  it("calculates the complete monthly bill for DE", () => {
    const result = calculateMonthlyBill({
      ...subscription,
      country: "DE",
    });

    expect(result.subtotal.toFixed(2)).toBe("140.00");
    expect(result.tax.toFixed(2)).toBe("26.60");
    expect(result.total.toFixed(2)).toBe("166.60");
  });

  it("calculates a zero-cost Starter subscription", () => {
    const result = calculateMonthlyBill({
      activeUsers: 0,
      plan: "Starter",
      storageGb: 0,
      apiCalls: 0,
      country: "ES",
    });

    expect(result.subtotal.toFixed(2)).toBe("0.00");
    expect(result.tax.toFixed(2)).toBe("0.00");
    expect(result.total.toFixed(2)).toBe("0.00");
  });

  it("does not charge for plan, storage or API calls", () => {
    const result = calculateMonthlyBill({
      activeUsers: 1,
      plan: "Enterprise",
      storageGb: 1000000,
      apiCalls: 100000000,
      country: "ES",
    });

    expect(result.subtotal.toFixed(2)).toBe("10.00");
    expect(result.tax.toFixed(2)).toBe("2.10");
    expect(result.total.toFixed(2)).toBe("12.10");
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

describe("Official Roams billing clarification", () => {
  it("charges only for active users, regardless of plan, storage or API calls", () => {
    const result = calculateMonthlyBill({
      activeUsers: 15,
      plan: "Enterprise",
      storageGb: 100,
      apiCalls: 5000,
      country: "ES",
    });

    expect(result.subtotal.toFixed(2)).toBe("140.00");
    expect(result.tax.toFixed(2)).toBe("29.40");
    expect(result.total.toFixed(2)).toBe("169.40");
  });
});
