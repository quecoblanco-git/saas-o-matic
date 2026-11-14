export type CurrencyCode = "EUR" | "USD" | "GBP";

export interface ExchangeRates {
  baseCurrency: "EUR";
  rates: {
    USD: string;
    GBP: string;
  };
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
