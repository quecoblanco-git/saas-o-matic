import { describe, expect, it } from "vitest";

import { convertCurrency } from "./currency.converter.js";
import type { ExchangeRates } from "./currency.types.js";

const mockExchangeRates: ExchangeRates = {
  baseCurrency: "EUR",
  rates: {
    USD: "1.15",
    GBP: "0.85",
  },
  fetchedAt: "2026-11-13T12:00:00.000Z",
};

describe("convertCurrency", () => {
  it("returns the original EUR amount without conversion", () => {
    expect(convertCurrency(16800, "EUR")).toBe("168.00");
  });

  it("converts EUR to USD", () => {
    expect(convertCurrency(16800, "USD", mockExchangeRates)).toBe("193.20");
  });

  it("converts EUR to GBP", () => {
    expect(convertCurrency(16800, "GBP", mockExchangeRates)).toBe("142.80");
  });

  it("returns zero correctly", () => {
    expect(convertCurrency(0, "USD", mockExchangeRates)).toBe("0.00");
  });

  it("rounds monetary conversions using ROUND_HALF_UP", () => {
    expect(
      convertCurrency(101, "USD", {
        ...mockExchangeRates,
        rates: {
          USD: "1.125",
          GBP: "0.85",
        },
      }),
    ).toBe("1.14");
  });

  it("rejects negative amounts", () => {
    expect(() => convertCurrency(-100, "EUR")).toThrow(
      "Invalid amount in cents",
    );
  });

  it("requires exchange rates for foreign currencies", () => {
    expect(() => convertCurrency(1000, "USD")).toThrow(
      "Exchange rates are required",
    );
  });

  it("rejects invalid exchange rates", () => {
    expect(() =>
      convertCurrency(1000, "GBP", {
        ...mockExchangeRates,
        rates: {
          USD: "1.15",
          GBP: "0",
        },
      }),
    ).toThrow("Invalid exchange rate");
  });
});
