import { apiRequest } from "./client";

import type {
  ConvertCurrencyInput,
  CurrencyConversion,
} from "../types/currency";

export async function convertCurrency(
  input: ConvertCurrencyInput,
): Promise<CurrencyConversion> {
  return apiRequest<CurrencyConversion>("/currency/convert", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
