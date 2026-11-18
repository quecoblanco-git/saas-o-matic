// Valida y normaliza los datos requeridos para registrar clientes.
import { z } from "zod";
import {
  normalizeTaxId,
  validateSpanishDni,
  validateSpanishNie,
  validateSpanishEntityNif,
  validateFrenchSiren,
  validateGermanVatId,
} from "./tax-id.js";

export const countrySchema = z.enum(["ES", "FR", "DE"]);

export const planSchema = z.enum(["Starter", "Professional", "Enterprise"]);

export const companyNameSchema = z
  .string()
  .trim()
  .min(1, "Company name is required")
  .max(150, "Company name must not exceed 150 characters");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(
    z
      .email("Invalid email address")
      .max(254, "Email must not exceed 254 characters"),
  );

export const spanishTaxIdSchema = z
  .string()
  .transform(normalizeTaxId)
  .refine(
    (taxId) =>
      validateSpanishDni(taxId) ||
      validateSpanishNie(taxId) ||
      validateSpanishEntityNif(taxId),
    {
      message: "Invalid Spanish tax ID",
    },
  );

export const frenchTaxIdSchema = z
  .string()
  .transform(normalizeTaxId)
  .refine(validateFrenchSiren, {
    message: "Invalid French tax ID",
  });

export const germanTaxIdSchema = z
  .string()
  .transform(normalizeTaxId)
  .refine(validateGermanVatId, {
    message: "Invalid German tax ID",
  });

export const createCustomerSchema = z
  .object({
    companyName: companyNameSchema,
    taxId: z.string().transform(normalizeTaxId),
    email: emailSchema,
    country: countrySchema,
    plan: planSchema,
  })
  .superRefine((customer, ctx) => {
    const taxIdSchemas = {
      ES: spanishTaxIdSchema,
      FR: frenchTaxIdSchema,
      DE: germanTaxIdSchema,
    };

    const taxIdSchema = taxIdSchemas[customer.country];

    if (!taxIdSchema.safeParse(customer.taxId).success) {
      ctx.addIssue({
        code: "custom",
        path: ["taxId"],
        message: `Invalid tax ID for country ${customer.country}`,
      });
    }
  });

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
