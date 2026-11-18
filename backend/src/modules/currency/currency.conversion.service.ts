// Coordina la consulta de tasas y la conversión de importes de simulación.
import { convertCurrency } from "./currency.converter.js";
import { getExchangeRates } from "./currency.service.js";

import type { CurrencyCode, CurrencyConversion } from "./currency.types.js";

export async function convertSimulationAmount(
  amountCents: number,
  targetCurrency: CurrencyCode,
): Promise<CurrencyConversion> {
  // EUR no necesita consultar la API externa.
  if (targetCurrency === "EUR") {
    return {
      originalAmountCents: amountCents,
      originalCurrency: "EUR",
      convertedAmount: convertCurrency(amountCents, "EUR"),
      targetCurrency: "EUR",
      exchangeRate: "1",
      ratesUpdatedAt: null,
      isStale: false,
    };
  }

  // Las divisas distintas de EUR necesitan tipos de cambio.
  const { exchangeRates, isStale } = await getExchangeRates();
  const exchangeRate = exchangeRates.rates[targetCurrency];

  if (exchangeRate === undefined) {
    throw new Error("Exchange rate is unavailable");
  }

  return {
    originalAmountCents: amountCents,
    originalCurrency: "EUR",
    convertedAmount: convertCurrency(
      amountCents,
      targetCurrency,
      exchangeRates,
    ),
    targetCurrency,
    exchangeRate,
    ratesUpdatedAt: exchangeRates.fetchedAt,
    isStale,
  };
}
