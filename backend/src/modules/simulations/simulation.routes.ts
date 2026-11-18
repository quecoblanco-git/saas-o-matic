import { Router } from "express";
import { ZodError } from "zod";
import { createSimulationSchema } from "./simulation.schema.js";
import {
  createSimulation,
  previewSimulation,
  listSimulations,
  CustomerNotFoundError,
} from "./simulation.service.js";

export const simulationRouter = Router();

simulationRouter.post("/preview", async (req, res) => {
  try {
    const simulationInput = createSimulationSchema.parse(req.body);

    const preview = await previewSimulation(simulationInput);

    res.status(200).json(preview);
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

  // Primera página por defecto.
  const skipParam = req.query.skip;

  let skip = 0;

  if (skipParam !== undefined) {
    if (typeof skipParam !== "string" || !/^(0|[1-9]\d*)$/.test(skipParam)) {
      res.status(400).json({
        error: "ValidationError",
        message: "Skip must be a non-negative integer",
      });
      return;
    }

    skip = Number(skipParam);

    // Rechazar offsets no representables con exactitud evita paginación imprecisa.
    if (!Number.isSafeInteger(skip)) {
      res.status(400).json({
        error: "ValidationError",
        message: "Skip must be a non-negative integer",
      });
      return;
    }
  }

  const simulations = await listSimulations(customerId, skip, 10);

  res.status(200).json(simulations);
});
