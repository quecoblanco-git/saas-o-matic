import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

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

    vi.mocked(getCustomers)
      .mockRejectedValueOnce(new Error("Error de conexión"))
      .mockResolvedValueOnce([mockCustomer]);

    render(<CustomerList />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Error de conexión",
    );

    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(await screen.findByText("Empresa de pruebas")).toBeInTheDocument();

    await waitFor(() => {
      expect(getCustomers).toHaveBeenCalledTimes(2);
    });

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

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

  it("displays the required customer information in each card", async () => {
    const mockCustomers = [
      {
        id: "customer-card-1",
        companyName: "Tecnología Palencia SL",
        taxId: "B12345674",
        email: "contacto@tecnologia.es",
        country: "ES" as const,
        plan: "Professional" as const,
        createdAt: "2026-11-16T10:00:00.000Z",
      },
      {
        id: "customer-card-2",
        companyName: "Empresa Francia",
        taxId: "123456789",
        email: "contact@entreprise.fr",
        country: "FR" as const,
        plan: "Starter" as const,
        createdAt: "2026-11-16T11:00:00.000Z",
      },
    ];

    vi.mocked(getCustomers).mockResolvedValueOnce(mockCustomers);

    render(<CustomerList />);

    const firstCustomer = await screen.findByText("Tecnología Palencia SL");
    const secondCustomer = screen.getByText("Empresa Francia");

    expect(firstCustomer).toBeVisible();
    expect(secondCustomer).toBeVisible();

    expect(screen.getByText("B12345674")).toBeVisible();
    expect(screen.getByText("ES")).toBeVisible();
    expect(screen.getByText("Professional")).toBeVisible();

    expect(screen.getByText("123456789")).toBeVisible();
    expect(screen.getByText("FR")).toBeVisible();
    expect(screen.getByText("Starter")).toBeVisible();

    expect(getCustomers).toHaveBeenCalledWith("");
  });
});
