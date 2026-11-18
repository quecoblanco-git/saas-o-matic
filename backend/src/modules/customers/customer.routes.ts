// Define los endpoints HTTP para registrar y buscar clientes.
import { Router } from "express";
import { ZodError } from "zod";
import { createCustomerSchema } from "./customer.schema.js";
import {
  createCustomer,
  listCustomers,
  DuplicateCustomerError,
} from "./customer.service.js";

export const customerRouter = Router();

customerRouter.post("/", async (req, res) => {
  try {
    const customerInput = createCustomerSchema.parse(req.body);

    const customer = await createCustomer(customerInput);

    res.status(201).json(customer);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "ValidationError",
        message: "Invalid customer data",
        details: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
      return;
    }

    if (error instanceof DuplicateCustomerError) {
      res.status(409).json({
        error: "DuplicateCustomerError",
        message: error.message,
      });
      return;
    }

    throw error;
  }
});

customerRouter.get("/", async (req, res) => {
  const search =
    typeof req.query.search === "string" ? req.query.search : undefined;

  const customers = await listCustomers(search);

  res.status(200).json(customers);
});
