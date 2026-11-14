import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearExchangeRatesCache,
  fetchExchangeRates,
  getExchangeRates,
} from "./currency.service.js";

describe("fetchExchangeRates", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns valid EUR exchange rates for USD and GBP", async () => {
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

    const result = await fetchExchangeRates();

    expect(result.baseCurrency).toBe("EUR");

    expect(result.rates).toEqual({
      USD: "1.15",
      GBP: "0.85",
    });

    expect(result.fetchedAt).toEqual(expect.any(String));

    expect(Number.isNaN(Date.parse(result.fetchedAt))).toBe(false);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      "https://open.er-api.com/v6/latest/EUR",
    );
  });
  it("rejects unsuccessful HTTP responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchExchangeRates()).rejects.toThrow(
      "Failed to fetch exchange rates",
    );
  });

  it("rejects an incorrect base currency", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "success",
          base_code: "USD",
          rates: {
            USD: 1.15,
            GBP: 0.85,
          },
        }),
      }),
    );

    await expect(fetchExchangeRates()).rejects.toThrow(
      "Invalid exchange rate API response",
    );
  });

  it("rejects negative exchange rates", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "success",
          base_code: "EUR",
          rates: {
            USD: -1.15,
            GBP: 0.85,
          },
        }),
      }),
    );

    await expect(fetchExchangeRates()).rejects.toThrow(
      "Exchange rates must be positive",
    );
  });
});

describe("getExchangeRates cache", () => {
  beforeEach(() => {
    clearExchangeRatesCache();
  });

  afterEach(() => {
    clearExchangeRatesCache();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("fetches rates when the cache is empty", async () => {
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

    const result = await getExchangeRates();

    expect(result.exchangeRates.rates).toEqual({
      USD: "1.15",
      GBP: "0.85",
    });

    expect(result.isStale).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("reuses cached rates within one hour", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-13T12:00:00.000Z"));

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

    const firstResult = await getExchangeRates();

    vi.setSystemTime(new Date("2026-11-13T12:30:00.000Z"));

    const secondResult = await getExchangeRates();

    expect(secondResult).toEqual(firstResult);
    expect(secondResult.isStale).toBe(false);

    // Solo se consulta la API una vez.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it("refreshes exchange rates when the cache expires", async () => {
    vi.useFakeTimers();
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
        ok: true,
        json: async () => ({
          result: "success",
          base_code: "EUR",
          rates: {
            USD: 1.2,
            GBP: 0.9,
          },
        }),
      });

    vi.stubGlobal("fetch", fetchMock);

    const firstResult = await getExchangeRates();

    expect(firstResult.exchangeRates.rates.USD).toBe("1.15");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Simulamos que ha pasado una hora y un segundo.
    vi.setSystemTime(new Date("2026-11-13T13:00:01.000Z"));

    const secondResult = await getExchangeRates();

    expect(secondResult.exchangeRates.rates).toEqual({
      USD: "1.2",
      GBP: "0.9",
    });

    expect(secondResult.isStale).toBe(false);

    // La API se ha consultado nuevamente.
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("uses stale cached rates when the API fails after expiration", async () => {
    vi.useFakeTimers();
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

    // Primera consulta: obtenemos tasas válidas.
    const firstResult = await getExchangeRates();

    expect(firstResult.isStale).toBe(false);

    // Simulamos que la caché ha caducado.
    vi.setSystemTime(new Date("2026-11-13T13:00:01.000Z"));

    // Segunda consulta: la API falla.
    const secondResult = await getExchangeRates();

    // Conservamos las tasas anteriores.
    expect(secondResult.exchangeRates.rates).toEqual({
      USD: "1.15",
      GBP: "0.85",
    });

    // Indicamos que están desactualizadas.
    expect(secondResult.isStale).toBe(true);

    // Se ha intentado actualizar la caché.
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it("throws an error when the API fails and no cached rates exist", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(getExchangeRates()).rejects.toThrow(
      "Failed to fetch exchange rates",
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
