import { describe, expect, it } from "vitest";

import { currencyConversionSchema } from "./currency.schema.js";

describe("currencyConversionSchema", () => {
  it("accepts a valid EUR conversion request", () => {
    const result = currencyConversionSchema.safeParse({
      amountCents: 16800,
      currency: "EUR",
    });

    expect(result.success).toBe(true);
  });

  it("accepts USD and GBP currencies", () => {
    for (const currency of ["USD", "GBP"]) {
      const result = currencyConversionSchema.safeParse({
        amountCents: 16800,
        currency,
      });

      expect(result.success).toBe(true);
    }
  });

  it("accepts zero cents", () => {
    const result = currencyConversionSchema.safeParse({
      amountCents: 0,
      currency: "USD",
    });

    expect(result.success).toBe(true);
  });

  it("rejects negative amounts", () => {
    const result = currencyConversionSchema.safeParse({
      amountCents: -100,
      currency: "EUR",
    });

    expect(result.success).toBe(false);
  });

  it("rejects decimal amounts", () => {
    const result = currencyConversionSchema.safeParse({
      amountCents: 168.5,
      currency: "EUR",
    });

    expect(result.success).toBe(false);
  });

  it("rejects unsupported currencies", () => {
    const result = currencyConversionSchema.safeParse({
      amountCents: 16800,
      currency: "JPY",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = currencyConversionSchema.safeParse({
      amountCents: 16800,
    });

    expect(result.success).toBe(false);
  });

  it("rejects additional fields", () => {
    const result = currencyConversionSchema.safeParse({
      amountCents: 16800,
      currency: "USD",
      exchangeRate: 999,
    });

    expect(result.success).toBe(false);
  });

  it("rejects unsafe integers", () => {
    const result = currencyConversionSchema.safeParse({
      amountCents: Number.MAX_SAFE_INTEGER + 1,
      currency: "EUR",
    });

    expect(result.success).toBe(false);
  });
});
