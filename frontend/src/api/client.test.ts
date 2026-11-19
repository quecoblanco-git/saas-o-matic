// Comprueba el parseo seguro de errores HTTP del cliente de API.
import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiRequest } from "./client";

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockErrorResponse(body: unknown, status = 400) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: false,
      status,
      json: vi.fn().mockResolvedValue(body),
    }),
  );
}

describe("apiRequest error handling", () => {
  it("preserves valid validation details and the existing status and message", async () => {
    mockErrorResponse({
      message: "Invalid customer data",
      details: [{ path: ["taxId"], message: "Invalid tax ID for country ES" }],
    });

    await expect(apiRequest("/customers", { method: "POST" })).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      message: "Invalid customer data",
      details: [{ path: ["taxId"], message: "Invalid tax ID for country ES" }],
    });
  });

  it("keeps errors without details compatible", async () => {
    mockErrorResponse({ message: "Service unavailable" }, 503);

    await expect(apiRequest("/customers")).rejects.toMatchObject({
      status: 503,
      message: "Service unavailable",
      details: [],
    });
  });

  it("ignores malformed validation details without throwing a parsing error", async () => {
    mockErrorResponse({
      message: "Invalid customer data",
      details: [
        { path: ["email"], message: "Invalid email address" },
        { path: "taxId", message: "Malformed path" },
        { path: ["plan"], message: 42 },
        null,
      ],
    });

    await expect(apiRequest("/customers")).rejects.toMatchObject({
      status: 400,
      message: "Invalid customer data",
      details: [{ path: ["email"], message: "Invalid email address" }],
    });
  });

  it("retains the two-argument ApiError constructor", () => {
    const error = new ApiError(418, "Unexpected response");

    expect(error.status).toBe(418);
    expect(error.message).toBe("Unexpected response");
    expect(error.details).toEqual([]);
  });

  it("returns undefined for a successful 204 response without parsing JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 204,
        json: vi.fn().mockRejectedValue(new Error("No response body")),
      }),
    );

    await expect(apiRequest<void>("/customers/customer-1", { method: "DELETE" })).resolves.toBeUndefined();
  });
});
