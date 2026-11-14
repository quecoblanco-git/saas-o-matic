import { Decimal } from "decimal.js";
import type { ExchangeRates } from "./currency.types.js";

const EXCHANGE_RATES_URL = "https://open.er-api.com/v6/latest/EUR";

interface ExchangeRateApiResponse {
  result?: string;
  base_code?: string;
  rates?: {
    USD?: unknown;
    GBP?: unknown;
  };
}

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  const response = await fetch(EXCHANGE_RATES_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  const responseData: unknown = await response.json();

  if (
    typeof responseData !== "object" ||
    responseData === null ||
    Array.isArray(responseData)
  ) {
    throw new Error("Invalid exchange rate API response");
  }

  const data = responseData as ExchangeRateApiResponse;

  if (data.result !== "success" || data.base_code !== "EUR") {
    throw new Error("Invalid exchange rate API response");
  }

  const usdRate = data.rates?.USD;
  const gbpRate = data.rates?.GBP;

  if (
    typeof usdRate !== "number" ||
    typeof gbpRate !== "number" ||
    !Number.isFinite(usdRate) ||
    !Number.isFinite(gbpRate)
  ) {
    throw new Error("Invalid exchange rates");
  }

  const usd = new Decimal(usdRate);
  const gbp = new Decimal(gbpRate);

  if (usd.lte(0) || gbp.lte(0)) {
    throw new Error("Exchange rates must be positive");
  }

  return {
    baseCurrency: "EUR",
    rates: {
      USD: usd.toString(),
      GBP: gbp.toString(),
    },
    fetchedAt: new Date().toISOString(),
  };
}

const CACHE_DURATION_MS = 60 * 60 * 1000;

let cachedRates: ExchangeRates | null = null;
let cacheExpiresAt = 0;

export interface CachedExchangeRates {
  exchangeRates: ExchangeRates;
  isStale: boolean;
}

export async function getExchangeRates(): Promise<CachedExchangeRates> {
  const now = Date.now();

  // Reutilizar los tipos de cambio mientras la caché sea válida.
  if (cachedRates !== null && now < cacheExpiresAt) {
    return {
      exchangeRates: cachedRates,
      isStale: false,
    };
  }

  try {
    const exchangeRates = await fetchExchangeRates();

    cachedRates = exchangeRates;
    cacheExpiresAt = Date.now() + CACHE_DURATION_MS;

    return {
      exchangeRates,
      isStale: false,
    };
  } catch (error) {
    // Si la API falla, reutilizar tasas anteriores si existen.
    if (cachedRates !== null) {
      return {
        exchangeRates: cachedRates,
        isStale: true,
      };
    }

    // Sin tasas disponibles, propagamos el error.
    throw error;
  }
}

export function clearExchangeRatesCache(): void {
  cachedRates = null;
  cacheExpiresAt = 0;
}
