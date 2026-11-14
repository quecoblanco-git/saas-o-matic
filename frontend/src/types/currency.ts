export type CurrencyCode = "EUR" | "USD" | "GBP";

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
