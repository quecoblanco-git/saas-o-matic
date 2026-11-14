import { z } from "zod";

export const currencyConversionSchema = z
  .object({
    amountCents: z.number().int().nonnegative().safe(),
    currency: z.enum(["EUR", "USD", "GBP"]),
  })
  .strict();

export type CurrencyConversionInput = z.infer<typeof currencyConversionSchema>;
