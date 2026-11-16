import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { CustomerList } from "./CustomerList";
import { getCustomers } from "../../api/customers";

vi.mock("../../api/customers", () => ({
  getCustomers: vi.fn(),
}));

describe("CustomerList", () => {
  it("shows an error and a retry button when loading customers fails", async () => {
    vi.mocked(getCustomers).mockRejectedValue(
      new Error("No se pudo conectar con el servidor"),
    );

    render(<CustomerList />);

    const errorMessage = await screen.findByRole("alert");

    expect(errorMessage).toHaveTextContent(
      "No se pudo conectar con el servidor",
    );

    expect(
      screen.getByRole("button", { name: "Reintentar" }),
    ).toBeInTheDocument();
  });

  it("retries loading customers after a failed request", async () => {
    const mockCustomer = {
      id: "customer-test-1",
      companyName: "Empresa de pruebas",
      taxId: "B12345674",
      email: "pruebas@example.es",
      country: "ES" as const,
      plan: "Professional" as const,
      createdAt: "2026-11-16T10:00:00.000Z",
    };

    // La primera petición falla y la segunda funciona.
    vi.mocked(getCustomers)
      .mockRejectedValueOnce(new Error("Error de conexión"))
      .mockResolvedValueOnce([mockCustomer]);

    render(<CustomerList />);

    // Esperar al error inicial.
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error de conexión",
    );

    // Pulsar el botón de reintento.
    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    // Comprobar que aparece el cliente recuperado.
    expect(await screen.findByText("Empresa de pruebas")).toBeInTheDocument();

    // Comprobar que se realizaron dos peticiones.
    await waitFor(() => {
      expect(getCustomers).toHaveBeenCalledTimes(2);
    });

    // El mensaje de error debe desaparecer.
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    // El botón de reintento ya no debe mostrarse.
    expect(
      screen.queryByRole("button", { name: "Reintentar" }),
    ).not.toBeInTheDocument();
  });

  it("sends the selected customer ID when clicking View History", async () => {
    const mockCustomer = {
      id: "customer-history-123",
      companyName: "Empresa Historial SL",
      taxId: "B12345674",
      email: "historial@example.es",
      country: "ES" as const,
      plan: "Professional" as const,
      createdAt: "2026-11-16T10:00:00.000Z",
    };

    const onViewHistory = vi.fn();

    vi.mocked(getCustomers).mockResolvedValueOnce([mockCustomer]);

    render(<CustomerList onViewHistory={onViewHistory} />);

    expect(await screen.findByText("Empresa Historial SL")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ver historial" }));

    expect(onViewHistory).toHaveBeenCalledTimes(1);
    expect(onViewHistory).toHaveBeenCalledWith("customer-history-123");
  });
});
