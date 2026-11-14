import { Router } from "express";

import { currencyConversionSchema } from "./currency.schema.js";
import { convertSimulationAmount } from "./currency.conversion.service.js";

export const currencyRouter = Router();

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
