// Verifica la respuesta del endpoint de salud de la API.
import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "./app.js";

describe("GET /health", () => {
  it("returns HTTP 200 and the expected service status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "saas-o-matic-api",
    });
  });
});
