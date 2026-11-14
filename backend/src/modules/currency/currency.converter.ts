import { Decimal } from "decimal.js";

import type { CurrencyCode, ExchangeRates } from "./currency.types.js";

const ROUNDING_MODE = Decimal.ROUND_HALF_UP;

export function convertCurrency(
  amountCents: number,
  targetCurrency: CurrencyCode,
  exchangeRates: ExchangeRates | null = null,
): string {
  if (!Number.isSafeInteger(amountCents) || amountCents < 0) {
    throw new Error("Invalid amount in cents");
  }

  const amountEur = new Decimal(amountCents).div(100);

  if (targetCurrency === "EUR") {
    return amountEur.toFixed(2, ROUNDING_MODE);
  }

  if (exchangeRates === null) {
    throw new Error("Exchange rates are required");
  }

  const rate = new Decimal(exchangeRates.rates[targetCurrency]);

  if (!rate.isFinite() || rate.lte(0)) {
    throw new Error("Invalid exchange rate");
  }

  return amountEur.mul(rate).toFixed(2, ROUNDING_MODE);
}
