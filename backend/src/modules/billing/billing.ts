// Implementa las tarifas progresivas, impuestos y cálculos monetarios.
import { Decimal } from "decimal.js";

export interface UserTierBreakdown {
  tier: 1 | 2 | 3;
  userCount: number;
  unitPriceCents: number;
  totalCents: number;
}

export function calculateUserTierBreakdown(
  activeUsers: number,
): UserTierBreakdown[] {
  if (
    !Number.isInteger(activeUsers) ||
    activeUsers < 0 ||
    activeUsers > 100000
  ) {
    throw new RangeError("activeUsers must be an integer between 0 and 100000");
  }

  // Cada tramo cuenta solo los usuarios que le corresponden, sin volver a cobrar los anteriores.
  const firstTier = Math.min(activeUsers, 10);
  const secondTier = Math.min(Math.max(activeUsers - 10, 0), 40);
  const thirdTier = Math.max(activeUsers - 50, 0);

  return [
    {
      tier: 1,
      userCount: firstTier,
      unitPriceCents: 1000,
      totalCents: firstTier * 1000,
    },
    {
      tier: 2,
      userCount: secondTier,
      unitPriceCents: 800,
      totalCents: secondTier * 800,
    },
    {
      tier: 3,
      userCount: thirdTier,
      unitPriceCents: 500,
      totalCents: thirdTier * 500,
    },
  ];
}

export function calculateUsersCost(activeUsers: number): Decimal {
  const breakdown = calculateUserTierBreakdown(activeUsers);

  return breakdown.reduce(
    (total, tier) => total.plus(new Decimal(tier.totalCents).div(100)),
    new Decimal(0),
  );
}

export type SubscriptionPlan = "Starter" | "Professional" | "Enterprise";

// Los planes y consumos no generan costes en esta versión, según Roams.
const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  Starter: 0,
  Professional: 0,
  Enterprise: 0,
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

  return new Decimal(0);
}

export function calculateApiCost(apiCalls: number): Decimal {
  if (!Number.isInteger(apiCalls) || apiCalls < 0 || apiCalls > 100000000) {
    throw new RangeError("apiCalls must be an integer between 0 and 100000000");
  }

  return new Decimal(0);
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

// Tasas simplificadas para la prueba; no cubren la normativa fiscal de operaciones SaaS.
const TAX_RATES: Record<BillingCountry, string> = {
  ES: "0.21",
  FR: "0.20",
  DE: "0.19",
};

export function getTaxRate(country: string): string {
  const taxRate = TAX_RATES[country as BillingCountry];

  if (taxRate === undefined) {
    throw new RangeError(`Invalid billing country: ${country}`);
  }

  return taxRate;
}

export function calculateTax(subtotal: string, country: string): Decimal {
  const taxRate = getTaxRate(country);

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

  // El impuesto se aplica al subtotal ya redondeado a céntimos, según RT-007.
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

  // Evitar pérdida de precisión al representar los céntimos como un número entero.
  if (cents.gt(Number.MAX_SAFE_INTEGER)) {
    throw new RangeError("Amount exceeds the safe integer range");
  }

  return cents.toNumber();
}
