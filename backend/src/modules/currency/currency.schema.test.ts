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

  it("accepts any uppercase three-letter currency code", () => {
    for (const currency of ["USD", "GBP", "JPY"]) {
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

  it("rejects malformed currency codes", () => {
    const result = currencyConversionSchema.safeParse({
      amountCents: 16800,
      currency: "USDD",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing required fields", () => {
    const result = currencyConversionSchema.safeParse({
      amountCents: 16800,
    });

    expect(result.success).toBe(false);
  });

  it.each([
    ["missing", undefined],
    ["string", "16800"],
    ["null", null],
    ["boolean", true],
    ["NaN", NaN],
  ] as const)(
    "rejects an invalid amountCents value: %s",
    (_description, amountCents) => {
      const input = {
        amountCents,
        currency: "EUR",
      };

      const result = currencyConversionSchema.safeParse(input);

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === "amountCents"),
        ).toBe(true);
      }
    },
  );

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
