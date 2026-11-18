// Comprueba formatos y reglas de validación de identificadores fiscales.
import { describe, expect, it } from "vitest";
import {
  validateSpanishDni,
  validateSpanishNie,
  validateSpanishEntityNif,
  normalizeTaxId,
  validateFrenchSiren,
  validateGermanVatId,
} from "./tax-id.js";

describe("Spanish tax ID validation", () => {
  describe("validateSpanishDni", () => {
    it.each(["00000000T", "12345678Z", "87654321X"])(
      "accepts a valid DNI: %s",
      (dni) => {
        expect(validateSpanishDni(dni)).toBe(true);
      },
    );

    it.each([
      "12345678A",
      "00000000A",
      "1234567Z",
      "123456789Z",
      "ABCDEFGHZ",
      "",
    ])("rejects an invalid DNI: %s", (dni) => {
      expect(validateSpanishDni(dni)).toBe(false);
    });
  });

  describe("validateSpanishNie", () => {
    it.each(["X0000000T", "Y0000000Z", "Z0000000M", "X1234567L"])(
      "accepts a valid NIE: %s",
      (nie) => {
        expect(validateSpanishNie(nie)).toBe(true);
      },
    );

    it.each([
      "X0000000A",
      "Y0000000A",
      "Z0000000A",
      "A0000000T",
      "X123456L",
      "X12345678L",
      "",
    ])("rejects an invalid NIE: %s", (nie) => {
      expect(validateSpanishNie(nie)).toBe(false);
    });
  });
  describe("validateSpanishEntityNif", () => {
    it.each([
      "A12345674",
      "B12345674",
      "P1234567D",
      "Q1234567D",
      "C12345674",
      "C1234567D",
    ])("accepts a valid entity NIF: %s", (nif) => {
      expect(validateSpanishEntityNif(nif)).toBe(true);
    });

    it.each([
      "A12345674",
      "B12345674",
      "C12345674",
      "D12345674",
      "E12345674",
      "F12345674",
      "G12345674",
      "H12345674",
      "J12345674",
      "N12345674",
      "P1234567D",
      "Q1234567D",
      "R12345674",
      "S1234567D",
      "U12345674",
      "V12345674",
      "W1234567D",
    ])("accepts a valid entity NIF for supported prefix: %s", (nif) => {
      expect(validateSpanishEntityNif(nif)).toBe(true);
    });

    it.each([
      "A1234567D",
      "P12345674",
      "B12345675",
      "C1234567E",
      "B1234567",
      "B123456789",
      "I12345674",
      "BABCDEFG4",
      "",
    ])("rejects an invalid entity NIF: %s", (nif) => {
      expect(validateSpanishEntityNif(nif)).toBe(false);
    });
  });
  describe("normalizeTaxId", () => {
    it.each([
      ["12345678Z", "12345678Z"],
      ["12345678z", "12345678Z"],
      [" 12345678z ", "12345678Z"],
      [" x0000000t ", "X0000000T"],
      [" b12345674 ", "B12345674"],
      ["", ""],
      ["   ", ""],
    ])("normalizes '%s' to '%s'", (input, expected) => {
      expect(normalizeTaxId(input)).toBe(expected);
    });

    it.each(["1234 5678Z", "1234-5678Z", "X 0000000T"])(
      "preserves invalid internal separators: %s",
      (taxId) => {
        expect(normalizeTaxId(taxId)).toBe(taxId);
      },
    );
  });
});

describe("validateFrenchSiren", () => {
  it.each(["123456789", "000000000", "987654321"])(
    "accepts a valid SIREN format: %s",
    (siren) => {
      expect(validateFrenchSiren(siren)).toBe(true);
    },
  );

  it.each([
    "12345678",
    "1234567890",
    "12345678A",
    "FR123456789",
    "123 456 789",
    "",
  ])("rejects an invalid SIREN format: %s", (siren) => {
    expect(validateFrenchSiren(siren)).toBe(false);
  });
});

describe("validateGermanVatId", () => {
  it.each(["DE123456789", "DE000000000", "DE987654321"])(
    "accepts a valid German VAT ID format: %s",
    (vatId) => {
      expect(validateGermanVatId(vatId)).toBe(true);
    },
  );

  it.each([
    "123456789",
    "DE12345678",
    "DE1234567890",
    "FR123456789",
    "DE12345678A",
    "DE123 456789",
    "",
  ])("rejects an invalid German VAT ID format: %s", (vatId) => {
    expect(validateGermanVatId(vatId)).toBe(false);
  });
});
