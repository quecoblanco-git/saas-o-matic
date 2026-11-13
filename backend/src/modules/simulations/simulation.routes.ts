import { Router } from "express";
import { ZodError } from "zod";
import { createSimulationSchema } from "./simulation.schema.js";
import {
  createSimulation,
  listSimulations,
  CustomerNotFoundError,
} from "./simulation.service.js";

export const simulationRouter = Router();

simulationRouter.post("/", async (req, res) => {
  try {
    const simulationInput = createSimulationSchema.parse(req.body);

    const simulation = await createSimulation(simulationInput);

    res.status(201).json(simulation);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "ValidationError",
        message: "Invalid simulation data",
        details: error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      });
      return;
    }

    if (error instanceof CustomerNotFoundError) {
      res.status(404).json({
        error: "CustomerNotFoundError",
        message: error.message,
      });
      return;
    }

    throw error;
  }
});

simulationRouter.get("/", async (req, res) => {
  const customerId =
    typeof req.query.customerId === "string" ? req.query.customerId.trim() : "";

  if (!customerId) {
    res.status(400).json({
      error: "ValidationError",
      message: "Customer ID is required",
    });
    return;
  }

  const simulations = await listSimulations(customerId);

  res.status(200).json(simulations);
});
