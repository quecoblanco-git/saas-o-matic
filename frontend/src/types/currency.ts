export type CurrencyCode = string;

export interface AvailableExchangeRates {
  baseCurrency: "EUR";
  rates: Record<string, string>;
  ratesUpdatedAt: string;
  isStale: boolean;
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

export interface ConvertCurrencyInput {
  amountCents: number;
  currency: CurrencyCode;
}
