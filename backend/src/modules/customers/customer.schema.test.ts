import { describe, expect, it } from "vitest";
import {
  countrySchema,
  planSchema,
  companyNameSchema,
  emailSchema,
  spanishTaxIdSchema,
  frenchTaxIdSchema,
  germanTaxIdSchema,
  createCustomerSchema,
} from "./customer.schema.js";

describe("Customer validation", () => {
  describe("countrySchema", () => {
    it.each(["ES", "FR", "DE"])("accepts the valid country %s", (country) => {
      expect(countrySchema.safeParse(country).success).toBe(true);
    });

    it.each(["IT", "PT", "", "es"])(
      "rejects the invalid country %s",
      (country) => {
        expect(countrySchema.safeParse(country).success).toBe(false);
      },
    );
    describe("companyNameSchema", () => {
      it("accepts a valid company name", () => {
        expect(companyNameSchema.parse("Empresa Ejemplo S.L.")).toBe(
          "Empresa Ejemplo S.L.",
        );
      });

      it("removes leading and trailing whitespace", () => {
        expect(companyNameSchema.parse("  Empresa Ejemplo S.L.  ")).toBe(
          "Empresa Ejemplo S.L.",
        );
      });

      it.each(["", "   "])("rejects an empty company name", (name) => {
        expect(companyNameSchema.safeParse(name).success).toBe(false);
      });

      it("rejects company names longer than 150 characters", () => {
        expect(companyNameSchema.safeParse("A".repeat(151)).success).toBe(
          false,
        );
      });
    });

    describe("emailSchema", () => {
      it("accepts a valid email address", () => {
        expect(emailSchema.parse("contacto@ejemplo.com")).toBe(
          "contacto@ejemplo.com",
        );
      });

      it("normalizes whitespace and uppercase letters", () => {
        expect(emailSchema.parse("  CONTACTO@EJEMPLO.COM  ")).toBe(
          "contacto@ejemplo.com",
        );
      });

      it.each(["", "correo-invalido", "usuario@", "@ejemplo.com"])(
        "rejects an invalid email address",
        (email) => {
          expect(emailSchema.safeParse(email).success).toBe(false);
        },
      );
    });
  });

  describe("planSchema", () => {
    it.each(["Starter", "Professional", "Enterprise"])(
      "accepts the valid plan %s",
      (plan) => {
        expect(planSchema.safeParse(plan).success).toBe(true);
      },
    );

    it.each(["Basic", "Premium", "", "starter"])(
      "rejects the invalid plan %s",
      (plan) => {
        expect(planSchema.safeParse(plan).success).toBe(false);
      },
    );
  });
});

describe("spanishTaxIdSchema", () => {
  it.each([
    ["12345678Z", "12345678Z"],
    [" 12345678z ", "12345678Z"],
    ["X0000000T", "X0000000T"],
    [" y0000000z ", "Y0000000Z"],
    ["B12345674", "B12345674"],
    [" p1234567d ", "P1234567D"],
  ])("accepts and normalizes '%s'", (input, expected) => {
    const result = spanishTaxIdSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toBe(expected);
    }
  });

  it.each([
    "12345678A",
    "X0000000A",
    "B12345675",
    "1234-5678Z",
    "1234 5678Z",
    "",
    "   ",
  ])("rejects an invalid Spanish tax ID: '%s'", (taxId) => {
    const result = spanishTaxIdSchema.safeParse(taxId);

    expect(result.success).toBe(false);
  });

  it("rejects a non-string tax ID", () => {
    expect(spanishTaxIdSchema.safeParse(12345678).success).toBe(false);
  });
});

describe("frenchTaxIdSchema", () => {
  it.each([
    ["123456789", "123456789"],
    [" 123456789 ", "123456789"],
    ["000000000", "000000000"],
  ])("accepts and normalizes '%s'", (input, expected) => {
    const result = frenchTaxIdSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toBe(expected);
    }
  });

  it.each([
    "12345678",
    "1234567890",
    "12345678A",
    "FR123456789",
    "123 456 789",
    "",
  ])("rejects an invalid French tax ID: '%s'", (taxId) => {
    expect(frenchTaxIdSchema.safeParse(taxId).success).toBe(false);
  });

  it("rejects a non-string tax ID", () => {
    expect(frenchTaxIdSchema.safeParse(123456789).success).toBe(false);
  });
});

describe("germanTaxIdSchema", () => {
  it.each([
    ["DE123456789", "DE123456789"],
    ["de123456789", "DE123456789"],
    [" de123456789 ", "DE123456789"],
  ])("accepts and normalizes '%s'", (input, expected) => {
    const result = germanTaxIdSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toBe(expected);
    }
  });

  it.each([
    "123456789",
    "DE12345678",
    "DE1234567890",
    "FR123456789",
    "DE12345678A",
    "DE123 456789",
    "",
  ])("rejects an invalid German tax ID: '%s'", (taxId) => {
    expect(germanTaxIdSchema.safeParse(taxId).success).toBe(false);
  });

  it("rejects a non-string tax ID", () => {
    expect(germanTaxIdSchema.safeParse(123456789).success).toBe(false);
  });
});

describe("createCustomerSchema", () => {
  it.each([
    {
      country: "ES",
      taxId: "12345678Z",
      plan: "Starter",
    },
    {
      country: "FR",
      taxId: "123456789",
      plan: "Professional",
    },
    {
      country: "DE",
      taxId: "DE123456789",
      plan: "Enterprise",
    },
  ])("accepts a valid customer from $country", ({ country, taxId, plan }) => {
    const result = createCustomerSchema.safeParse({
      companyName: "Example Company",
      taxId,
      email: "contact@example.com",
      country,
      plan,
    });

    expect(result.success).toBe(true);
  });

  it("normalizes customer registration data", () => {
    const result = createCustomerSchema.safeParse({
      companyName: "  Example Company  ",
      taxId: " 12345678z ",
      email: "  CONTACT@EXAMPLE.COM  ",
      country: "ES",
      plan: "Professional",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        companyName: "Example Company",
        taxId: "12345678Z",
        email: "contact@example.com",
        country: "ES",
        plan: "Professional",
      });
    }
  });

  it.each([
    ["ES", "DE123456789"],
    ["ES", "123456789"],
    ["FR", "12345678Z"],
    ["FR", "DE123456789"],
    ["DE", "12345678Z"],
    ["DE", "123456789"],
  ])("rejects tax ID from another country: %s / %s", (country, taxId) => {
    const result = createCustomerSchema.safeParse({
      companyName: "Example Company",
      taxId,
      email: "contact@example.com",
      country,
      plan: "Starter",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.join(".") === "taxId"),
      ).toBe(true);
    }
  });
});

describe("createCustomerSchema required fields", () => {
  const validCustomer = {
    companyName: "Example Company",
    taxId: "12345678Z",
    email: "contact@example.com",
    country: "ES",
    plan: "Professional",
  };

  it.each(["companyName", "taxId", "email", "country", "plan"] as const)(
    "rejects a missing %s field",
    (field) => {
      const customer = { ...validCustomer };

      delete (customer as Partial<typeof validCustomer>)[field];

      const result = createCustomerSchema.safeParse(customer);

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path.join(".") === field),
        ).toBe(true);
      }
    },
  );

  it.each(["companyName", "taxId", "email", "country", "plan"] as const)(
    "rejects a null %s field",
    (field) => {
      const customer = {
        ...validCustomer,
        [field]: null,
      };

      const result = createCustomerSchema.safeParse(customer);

      expect(result.success).toBe(false);
    },
  );

  it("rejects an empty request body", () => {
    const result = createCustomerSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects a null request body", () => {
    const result = createCustomerSchema.safeParse(null);

    expect(result.success).toBe(false);
  });
});

describe("createCustomerSchema invalid values", () => {
  const validCustomer = {
    companyName: "Example Company",
    taxId: "12345678Z",
    email: "contact@example.com",
    country: "ES",
    plan: "Professional",
  };

  it.each([
    ["companyName", ""],
    ["companyName", "   "],
    ["companyName", "A".repeat(151)],
    ["companyName", 123],
    ["taxId", ""],
    ["taxId", "12345678A"],
    ["taxId", 12345678],
    ["email", ""],
    ["email", "invalid-email"],
    ["email", "contact@"],
    ["email", "a".repeat(250) + "@example.com"],
    ["email", 123],
    ["country", ""],
    ["country", "IT"],
    ["country", "es"],
    ["country", 123],
    ["plan", ""],
    ["plan", "Premium"],
    ["plan", "starter"],
    ["plan", 123],
  ])("rejects invalid %s value: %s", (field, value) => {
    const result = createCustomerSchema.safeParse({
      ...validCustomer,
      [field]: value,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path.join(".") === field),
      ).toBe(true);
    }
  });

  it("accepts a company name of exactly 150 characters", () => {
    const result = createCustomerSchema.safeParse({
      ...validCustomer,
      companyName: "A".repeat(150),
    });

    expect(result.success).toBe(true);
  });

  it("rejects an array instead of a customer object", () => {
    expect(createCustomerSchema.safeParse([]).success).toBe(false);
  });
});
