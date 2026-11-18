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

  it("converts EUR to another currency available from the provider", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "success",
          base_code: "EUR",
          rates: { USD: 1.15, GBP: 0.85, JPY: 180 },
        }),
      }),
    );

    const response = await request(app).post("/currency/convert").send({
      amountCents: 100,
      currency: "JPY",
    });

    expect(response.status).toBe(200);
    expect(response.body.convertedAmount).toBe("180.00");
    expect(response.body.exchangeRate).toBe("180");
  });

  it("returns the available rates for the frontend selector", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "success",
          base_code: "EUR",
          rates: { USD: 1.15, GBP: 0.85, JPY: 180 },
        }),
      }),
    );

    const response = await request(app).get("/currency/rates");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      baseCurrency: "EUR",
      rates: { USD: "1.15", GBP: "0.85", JPY: "180" },
      isStale: false,
    });
    expect(typeof response.body.ratesUpdatedAt).toBe("string");
  });

  it("rejects invalid conversion data", async () => {
    const response = await request(app).post("/currency/convert").send({
      amountCents: -100,
      currency: "JP",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid currency conversion data");
  });

  it("returns HTTP 200 with stale exchange rates when refresh fails", async () => {
    vi.useFakeTimers({
      toFake: ["Date"],
    });

    try {
      vi.setSystemTime(new Date("2026-11-13T12:00:00.000Z"));

      const fetchMock = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            result: "success",
            base_code: "EUR",
            rates: {
              USD: 1.15,
              GBP: 0.85,
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 503,
        });

      vi.stubGlobal("fetch", fetchMock);

      const firstResponse = await request(app).post("/currency/convert").send({
        amountCents: 16800,
        currency: "USD",
      });

      expect(firstResponse.status).toBe(200);
      expect(firstResponse.body.isStale).toBe(false);

      // Avanzar el reloj hasta después de la caducidad.
      vi.setSystemTime(new Date("2026-11-13T13:00:01.000Z"));

      const secondResponse = await request(app).post("/currency/convert").send({
        amountCents: 16800,
        currency: "USD",
      });

      expect(secondResponse.status).toBe(200);

      expect(secondResponse.body).toMatchObject({
        originalAmountCents: 16800,
        originalCurrency: "EUR",
        convertedAmount: "193.20",
        targetCurrency: "USD",
        exchangeRate: "1.15",
        isStale: true,
      });

      expect(secondResponse.body.ratesUpdatedAt).toBe(
        firstResponse.body.ratesUpdatedAt,
      );

      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
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
