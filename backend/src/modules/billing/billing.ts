import { Decimal } from "decimal.js";

export function calculateUsersCost(activeUsers: number): Decimal {
  if (
    !Number.isInteger(activeUsers) ||
    activeUsers < 0 ||
    activeUsers > 100000
  ) {
    throw new RangeError("activeUsers must be an integer between 0 and 100000");
  }

  const firstTier = Math.min(activeUsers, 10);
  const secondTier = Math.min(Math.max(activeUsers - 10, 0), 40);
  const thirdTier = Math.max(activeUsers - 50, 0);

  return new Decimal(firstTier)
    .mul(10)
    .plus(new Decimal(secondTier).mul(8))
    .plus(new Decimal(thirdTier).mul(5));
}

export type SubscriptionPlan = "Starter" | "Professional" | "Enterprise";

const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  Starter: 0,
  Professional: 29,
  Enterprise: 99,
};

export function calculatePlanCost(plan: SubscriptionPlan): Decimal {
  const price = PLAN_PRICES[plan];

  if (price === undefined) {
    throw new RangeError(`Invalid subscription plan: ${plan}`);
  }

  return new Decimal(price);
}

export function calculateStorageCost(storageGb: number): Decimal {
  if (!Number.isInteger(storageGb) || storageGb < 0 || storageGb > 1000000) {
    throw new RangeError("storageGb must be an integer between 0 and 1000000");
  }

  return new Decimal(storageGb).mul("0.10");
}

export function calculateApiCost(apiCalls: number): Decimal {
  if (!Number.isInteger(apiCalls) || apiCalls < 0 || apiCalls > 100000000) {
    throw new RangeError("apiCalls must be an integer between 0 and 100000000");
  }

  return new Decimal(apiCalls).div(1000);
}

export interface SubtotalInput {
  activeUsers: number;
  plan: SubscriptionPlan;
  storageGb: number;
  apiCalls: number;
}

export function calculateSubtotal(input: SubtotalInput): Decimal {
  const usersCost = calculateUsersCost(input.activeUsers);
  const planCost = calculatePlanCost(input.plan);
  const storageCost = calculateStorageCost(input.storageGb);
  const apiCost = calculateApiCost(input.apiCalls);

  return usersCost
    .plus(planCost)
    .plus(storageCost)
    .plus(apiCost)
    .toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}

export type BillingCountry = "ES" | "FR" | "DE";

const TAX_RATES: Record<BillingCountry, string> = {
  ES: "0.21",
  FR: "0.20",
  DE: "0.19",
};

export function calculateTax(subtotal: string, country: string): Decimal {
  const taxRate = TAX_RATES[country as BillingCountry];

  if (taxRate === undefined) {
    throw new RangeError(`Invalid billing country: ${country}`);
  }

  const subtotalAmount = new Decimal(subtotal);

  if (!subtotalAmount.isFinite() || subtotalAmount.isNegative()) {
    throw new RangeError("Subtotal must be a non-negative finite amount");
  }

  return subtotalAmount.mul(taxRate).toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
}

export interface MonthlyBillInput extends SubtotalInput {
  country: string;
}

export interface MonthlyBillResult {
  subtotal: Decimal;
  tax: Decimal;
  total: Decimal;
}

export function calculateMonthlyBill(
  input: MonthlyBillInput,
): MonthlyBillResult {
  const subtotal = calculateSubtotal(input);

  const tax = calculateTax(subtotal.toFixed(2), input.country);

  const total = subtotal.plus(tax);

  return {
    subtotal,
    tax,
    total,
  };
}

export function eurosToCents(euros: string): number {
  const amount = new Decimal(euros);

  if (!amount.isFinite() || amount.isNegative()) {
    throw new RangeError("Euros must be a non-negative finite amount");
  }

  const cents = amount.mul(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP);

  if (cents.gt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError("Amount exceeds the safe integer range");
  }

  return cents.toNumber();
}
