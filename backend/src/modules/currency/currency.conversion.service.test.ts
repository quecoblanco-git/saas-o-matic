import { afterEach, describe, expect, it, vi } from "vitest";

import { convertSimulationAmount } from "./currency.conversion.service.js";
import { clearExchangeRatesCache } from "./currency.service.js";

describe("convertSimulationAmount", () => {
  afterEach(() => {
    clearExchangeRatesCache();
    vi.unstubAllGlobals();
  });

  it("converts EUR without consulting the external API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await convertSimulationAmount(16800, "EUR");

    expect(result).toEqual({
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

    const result = await convertSimulationAmount(16800, "USD");

    expect(result.originalAmountCents).toBe(16800);
    expect(result.originalCurrency).toBe("EUR");
    expect(result.convertedAmount).toBe("193.20");
    expect(result.targetCurrency).toBe("USD");
    expect(result.exchangeRate).toBe("1.15");
    expect(result.isStale).toBe(false);
    expect(result.ratesUpdatedAt).toEqual(expect.any(String));

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("converts EUR to GBP using exchange rates", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "success",
          base_code: "EUR",
          rates: {
            USD: 1.15,
            GBP: 0.85,
          },
        }),
      }),
    );

    const result = await convertSimulationAmount(16800, "GBP");

    expect(result.convertedAmount).toBe("142.80");
    expect(result.targetCurrency).toBe("GBP");
    expect(result.exchangeRate).toBe("0.85");
  });

  it("converts EUR to another currency available from the provider", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "success",
          base_code: "EUR",
          rates: { JPY: 180 },
        }),
      }),
    );

    const result = await convertSimulationAmount(100, "JPY");

    expect(result.convertedAmount).toBe("180.00");
    expect(result.targetCurrency).toBe("JPY");
    expect(result.exchangeRate).toBe("180");
  });

  it("marks a conversion as stale when cached exchange rates are outdated", async () => {
    vi.useFakeTimers();

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

      // La primera conversión carga y almacena las tasas.
      const firstResult = await convertSimulationAmount(16800, "USD");

      expect(firstResult.isStale).toBe(false);

      // Forzar la caducidad de la caché.
      vi.setSystemTime(new Date("2026-11-13T13:00:01.000Z"));

      // Si falla la actualización, se conservan las tasas anteriores como obsoletas.
      const secondResult = await convertSimulationAmount(16800, "USD");

      expect(secondResult.originalAmountCents).toBe(16800);
      expect(secondResult.convertedAmount).toBe("193.20");
      expect(secondResult.exchangeRate).toBe("1.15");
      expect(secondResult.isStale).toBe(true);

      expect(secondResult.ratesUpdatedAt).toBe(firstResult.ratesUpdatedAt);

      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      vi.useRealTimers();
    }
  });
});
