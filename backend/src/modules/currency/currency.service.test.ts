// Verifica consulta, caché y recuperación ante fallos del proveedor de tasas.
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

  it("returns valid EUR exchange rates for available currencies", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        result: "success",
        base_code: "EUR",
        rates: {
          USD: 1.15,
          GBP: 0.85,
          JPY: 180,
          invalid: 2,
          CAD: -1,
        },
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchExchangeRates();

    expect(result.baseCurrency).toBe("EUR");

    expect(result.rates).toEqual({
      USD: "1.15",
      GBP: "0.85",
      JPY: "180",
    });

    expect(result.fetchedAt).toEqual(expect.any(String));

    expect(Number.isNaN(Date.parse(result.fetchedAt))).toBe(false);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      "https://open.er-api.com/v6/latest/EUR",
    );
  });

  it("rejects a response without any valid foreign exchange rates", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "success",
          base_code: "EUR",
          rates: { EUR: 1, invalid: 3, JPY: 0 },
        }),
      }),
    );

    await expect(fetchExchangeRates()).rejects.toThrow("Invalid exchange rates");
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

  it("ignores invalid rates when other currencies are available", async () => {
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

    expect(await fetchExchangeRates()).toMatchObject({
      baseCurrency: "EUR",
      rates: { GBP: "0.85" },
    });
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

    // Avanzar más allá de la caducidad de una hora.
    vi.setSystemTime(new Date("2026-11-13T13:00:01.000Z"));

    const secondResult = await getExchangeRates();

    expect(secondResult.exchangeRates.rates).toEqual({
      USD: "1.2",
      GBP: "0.9",
    });

    expect(secondResult.isStale).toBe(false);

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

    // Cargar tasas antes de que caduque la caché.
    const firstResult = await getExchangeRates();

    expect(firstResult.isStale).toBe(false);

    // Forzar la caducidad de la caché.
    vi.setSystemTime(new Date("2026-11-13T13:00:01.000Z"));

    // La API falla al intentar actualizar las tasas.
    const secondResult = await getExchangeRates();

    expect(secondResult.exchangeRates.rates).toEqual({
      USD: "1.15",
      GBP: "0.85",
    });

    expect(secondResult.isStale).toBe(true);

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
