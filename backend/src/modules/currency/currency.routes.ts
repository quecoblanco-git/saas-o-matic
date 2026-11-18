// Define los endpoints para consultar tasas y convertir importes.
import { Router } from "express";

import { currencyConversionSchema } from "./currency.schema.js";
import { convertSimulationAmount } from "./currency.conversion.service.js";
import { getExchangeRates } from "./currency.service.js";

export const currencyRouter = Router();

currencyRouter.get("/rates", async (_req, res) => {
  try {
    const { exchangeRates, isStale } = await getExchangeRates();

    res.status(200).json({
      baseCurrency: exchangeRates.baseCurrency,
      rates: exchangeRates.rates,
      ratesUpdatedAt: exchangeRates.fetchedAt,
      isStale,
    });
  } catch {
    res.status(503).json({
      message: "Currency conversion service unavailable",
    });
  }
});

currencyRouter.post("/convert", async (req, res) => {
  const validation = currencyConversionSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      message: "Invalid currency conversion data",
      errors: validation.error.flatten(),
    });
    return;
  }

  const { amountCents, currency } = validation.data;

  try {
    const result = await convertSimulationAmount(amountCents, currency);

    res.status(200).json(result);
  } catch {
    res.status(503).json({
      message: "Currency conversion service unavailable",
    });
  }
});
