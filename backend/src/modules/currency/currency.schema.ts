// Valida los datos y códigos de moneda enviados para una conversión.
import { z } from "zod";

export const currencyConversionSchema = z
  .object({
    amountCents: z.number().int().nonnegative().safe(),
    currency: z.string().regex(/^[A-Z]{3}$/, "Invalid currency code"),
  })
  .strict();

export type CurrencyConversionInput = z.infer<typeof currencyConversionSchema>;
