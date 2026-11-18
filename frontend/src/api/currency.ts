import { apiRequest } from "./client";

import type {
  AvailableExchangeRates,
  ConvertCurrencyInput,
  CurrencyConversion,
} from "../types/currency";

export async function getAvailableCurrencies(): Promise<AvailableExchangeRates> {
  return apiRequest<AvailableExchangeRates>("/currency/rates");
}

export async function convertCurrency(
  input: ConvertCurrencyInput,
): Promise<CurrencyConversion> {
  return apiRequest<CurrencyConversion>("/currency/convert", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
