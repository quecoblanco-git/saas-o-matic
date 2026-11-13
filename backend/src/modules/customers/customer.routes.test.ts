import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { createCustomer, listCustomers } from "./customer.service.js";
import { DuplicateCustomerError } from "./customer.service.js";

vi.mock("./customer.service.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./customer.service.js")>();

  return {
    ...actual,
    createCustomer: vi.fn(),
    listCustomers: vi.fn(),
  };
});

describe("POST /customers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 201 and the created customer for valid data", async () => {
    const customerInput = {
      companyName: "Example Company",
      taxId: "12345678Z",
      email: "contact@example.com",
      country: "ES",
      plan: "Professional",
    };

    const savedCustomer = {
      id: "customer-123",
      ...customerInput,
      createdAt: new Date("2026-11-12T12:00:00.000Z"),
    };

    vi.mocked(createCustomer).mockResolvedValue(savedCustomer);

    const response = await request(app).post("/customers").send(customerInput);

    expect(response.status).toBe(201);

    expect(response.body).toEqual({
      ...customerInput,
      id: "customer-123",
      createdAt: "2026-11-12T12:00:00.000Z",
    });

    expect(createCustomer).toHaveBeenCalledExactlyOnceWith(customerInput);
  });
  it("returns 400 when the customer email is invalid", async () => {
    const invalidCustomer = {
      companyName: "Example Company",
      taxId: "12345678Z",
      email: "invalid-email",
      country: "ES",
      plan: "Professional",
    };

    const response = await request(app)
      .post("/customers")
      .send(invalidCustomer);

    expect(response.status).toBe(400);

    expect(response.body).toMatchObject({
      error: "ValidationError",
    });

    expect(response.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: ["email"],
        }),
      ]),
    );

    expect(createCustomer).not.toHaveBeenCalled();
  });
  it("returns 409 when the customer tax ID already exists", async () => {
    const customerInput = {
      companyName: "Example Company",
      taxId: "12345678Z",
      email: "contact@example.com",
      country: "ES",
      plan: "Professional",
    };

    vi.mocked(createCustomer).mockRejectedValue(new DuplicateCustomerError());

    const response = await request(app).post("/customers").send(customerInput);

    expect(response.status).toBe(409);

    expect(response.body).toEqual({
      error: "DuplicateCustomerError",
      message: "A customer with this tax ID already exists in this country",
    });

    expect(createCustomer).toHaveBeenCalledExactlyOnceWith(customerInput);
  });
  it.each([
    ["ES", "12345678A"],
    ["FR", "12345"],
    ["DE", "DE12345"],
  ])(
    "returns 400 for an invalid tax ID in country %s",
    async (country, taxId) => {
      const response = await request(app).post("/customers").send({
        companyName: "Example Company",
        taxId,
        email: "contact@example.com",
        country,
        plan: "Professional",
      });

      expect(response.status).toBe(400);

      expect(response.body).toMatchObject({
        error: "ValidationError",
      });

      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["taxId"],
          }),
        ]),
      );

      expect(createCustomer).not.toHaveBeenCalled();
    },
  );
  it("normalizes customer data before creating the customer", async () => {
    const customerInput = {
      companyName: "  Example Company  ",
      taxId: "  12345678z  ",
      email: "  CONTACT@EXAMPLE.COM  ",
      country: "ES",
      plan: "Professional",
    };

    const normalizedCustomer = {
      companyName: "Example Company",
      taxId: "12345678Z",
      email: "contact@example.com",
      country: "ES",
      plan: "Professional",
    };

    vi.mocked(createCustomer).mockResolvedValue({
      id: "customer-789",
      ...normalizedCustomer,
      createdAt: new Date("2026-11-12T12:00:00.000Z"),
    });

    const response = await request(app).post("/customers").send(customerInput);

    expect(response.status).toBe(201);

    expect(createCustomer).toHaveBeenCalledExactlyOnceWith(normalizedCustomer);

    expect(response.body).toMatchObject({
      id: "customer-789",
      ...normalizedCustomer,
    });
  });
  it.each(["companyName", "taxId", "email", "country", "plan"])(
    "returns 400 when the required field %s is missing",
    async (missingField) => {
      const customerInput: Record<string, string> = {
        companyName: "Example Company",
        taxId: "12345678Z",
        email: "contact@example.com",
        country: "ES",
        plan: "Professional",
      };

      delete customerInput[missingField];

      const response = await request(app)
        .post("/customers")
        .send(customerInput);

      expect(response.status).toBe(400);

      expect(response.body).toMatchObject({
        error: "ValidationError",
      });

      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: [missingField],
          }),
        ]),
      );

      expect(createCustomer).not.toHaveBeenCalled();
    },
  );
  it.each([
    ["country", "IT"],
    ["country", "USA"],
    ["plan", "Premium"],
    ["plan", "Basic"],
  ])(
    "returns 400 when %s has the invalid value %s",
    async (field, invalidValue) => {
      const customerInput: Record<string, string> = {
        companyName: "Example Company",
        taxId: "12345678Z",
        email: "contact@example.com",
        country: "ES",
        plan: "Professional",
      };

      customerInput[field] = invalidValue;

      const response = await request(app)
        .post("/customers")
        .send(customerInput);

      expect(response.status).toBe(400);

      expect(response.body).toMatchObject({
        error: "ValidationError",
      });

      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: [field],
          }),
        ]),
      );

      expect(createCustomer).not.toHaveBeenCalled();
    },
  );
  it.each([
    ["companyName", 12345],
    ["taxId", 12345678],
    ["email", true],
    ["country", 123],
    ["plan", false],
  ])(
    "returns 400 when %s has an incorrect data type",
    async (field, invalidValue) => {
      const customerInput: Record<string, unknown> = {
        companyName: "Example Company",
        taxId: "12345678Z",
        email: "contact@example.com",
        country: "ES",
        plan: "Professional",
      };

      customerInput[field] = invalidValue;

      const response = await request(app)
        .post("/customers")
        .send(customerInput);

      expect(response.status).toBe(400);

      expect(response.body).toMatchObject({
        error: "ValidationError",
      });

      expect(response.body.details).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: [field],
          }),
        ]),
      );

      expect(createCustomer).not.toHaveBeenCalled();
    },
  );
  it("returns 500 without exposing internal database errors", async () => {
    const customerInput = {
      companyName: "Example Company",
      taxId: "12345678Z",
      email: "contact@example.com",
      country: "ES",
      plan: "Professional",
    };

    vi.mocked(createCustomer).mockRejectedValue(
      new Error("Sensitive database connection details"),
    );

    const response = await request(app).post("/customers").send(customerInput);

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      error: "InternalServerError",
      message: "An unexpected error occurred",
    });

    expect(JSON.stringify(response.body)).not.toContain(
      "Sensitive database connection details",
    );
  });
});

describe("GET /customers", () => {
  it("returns HTTP 200 with the list of customers", async () => {
    const customers = [
      {
        id: "customer-1",
        companyName: "Tech Solutions",
        taxId: "B12345674",
        email: "contact@techsolutions.com",
        country: "ES",
        plan: "Professional",
        createdAt: "2026-11-12T12:00:00.000Z",
      },
    ];

    vi.mocked(listCustomers).mockResolvedValue(customers as never);

    const response = await request(app).get("/customers");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(customers);
    expect(listCustomers).toHaveBeenCalledWith(undefined);
  });
  it("passes the search query to the customer service", async () => {
    vi.mocked(listCustomers).mockResolvedValue([]);

    const response = await request(app)
      .get("/customers")
      .query({ search: "tech" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(listCustomers).toHaveBeenCalledWith("tech");
  });
  it("ignores repeated search query parameters", async () => {
    vi.mocked(listCustomers).mockResolvedValue([]);

    const response = await request(app)
      .get("/customers")
      .query({ search: ["tech", "alpha"] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(listCustomers).toHaveBeenCalledWith(undefined);
  });
});
