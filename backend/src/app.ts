// Configura Express, registra las rutas y expone la comprobación de salud.
import express from "express";
import { customerRouter } from "./modules/customers/customer.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { simulationRouter } from "./modules/simulations/simulation.routes.js";
import { currencyRouter } from "./modules/currency/currency.routes.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "saas-o-matic-api",
  });
});

app.use("/customers", customerRouter);
app.use("/simulations", simulationRouter);
app.use("/currency", currencyRouter);

app.use(errorHandler);

export default app;
