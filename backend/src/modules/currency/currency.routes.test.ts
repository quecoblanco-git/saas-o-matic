import express from "express";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { currencyRouter } from "./currency.routes.js";
import { clearExchangeRatesCache } from "./currency.service.js";

const app = express();

app.use(express.json());
app.use("/currency", currencyRouter);

describe("POST /currency/convert", () => {
  beforeEach(() => {
    clearExchangeRatesCache();
  });

  afterEach(() => {
    clearExchangeRatesCache();
    vi.unstubAllGlobals();
  });

  it("converts EUR without consulting the exchange rate API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await request(app).post("/currency/convert").send({
      amountCents: 16800,
      currency: "EUR",
    });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      originalAmountCents: 16800,
      originalCurrency: "EUR",
      convertedAmount: "168.00",
      targetCurrency: "EUR",
      exchangeRate: "1",
      ratesUpdatedAt: null,
      isStale: false,
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("converts EUR to USD using exchange rates", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        result: "success",
        base_code: "EUR",
        rates: {
          USD: 1.15,
          GBP: 0.85,
        },
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const response = await request(app).post("/currency/convert").send({
      amountCents: 16800,
      currency: "USD",
    });

    expect(response.status).toBe(200);
    expect(response.body.convertedAmount).toBe("193.20");
    expect(response.body.targetCurrency).toBe("USD");
    expect(response.body.exchangeRate).toBe("1.15");
    expect(response.body.isStale).toBe(false);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects invalid conversion data", async () => {
    const response = await request(app).post("/currency/convert").send({
      amountCents: -100,
      currency: "JPY",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid currency conversion data");
  });

  it("returns HTTP 503 when exchange rates are unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    const response = await request(app).post("/currency/convert").send({
      amountCents: 16800,
      currency: "GBP",
    });

    expect(response.status).toBe(503);
    expect(response.body.message).toBe(
      "Currency conversion service unavailable",
    );
  });
});
