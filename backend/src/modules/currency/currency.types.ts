// Define las estructuras compartidas para tasas y conversiones monetarias.
export type CurrencyCode = string;

export interface ExchangeRates {
  baseCurrency: "EUR";
  rates: Record<string, string>;
  fetchedAt: string;
}

export interface CurrencyConversion {
  originalAmountCents: number;
  originalCurrency: "EUR";
  convertedAmount: string;
  targetCurrency: CurrencyCode;
  exchangeRate: string;
  ratesUpdatedAt: string | null;
  isStale: boolean;
}
