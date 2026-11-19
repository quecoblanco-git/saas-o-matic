// Verifica los mensajes de validación y los estados del registro de clientes.
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ApiError } from "../../api/client";
import { createCustomer } from "../../api/customers";
import type { Customer } from "../../types/customer";
import { CustomerForm } from "./CustomerForm";

vi.mock("../../api/customers", () => ({
  createCustomer: vi.fn(),
}));

const validCustomer: Customer = {
  id: "customer-1",
  companyName: "Empresa de prueba",
  taxId: "12345678Z",
  email: "contacto@empresa.test",
  country: "ES",
  plan: "Starter",
  createdAt: "2026-11-18T10:00:00.000Z",
};

function fillRequiredFields(country = "ES") {
  fireEvent.change(screen.getByLabelText("Nombre de la empresa"), {
    target: { value: "Empresa de prueba" },
  });
  fireEvent.change(screen.getByLabelText("Identificación fiscal"), {
    target: { value: "12345678Z" },
  });
  fireEvent.change(screen.getByLabelText("Correo electrónico"), {
    target: { value: "contacto@empresa.test" },
  });
  fireEvent.change(screen.getByLabelText("País"), {
    target: { value: country },
  });
}

async function submitForm() {
  fireEvent.submit(screen.getByRole("button", { name: "Registrar cliente" }).closest("form")!);
  await waitFor(() => expect(createCustomer).toHaveBeenCalled());
}

describe("CustomerForm validation feedback", () => {
  it.each([
    ["ES", "La identificación fiscal no es válida para España."],
    ["FR", "La identificación fiscal no es válida para Francia."],
    ["DE", "La identificación fiscal no es válida para Alemania."],
  ])("shows a localized tax ID error for %s", async (country, expectedMessage) => {
    vi.mocked(createCustomer).mockRejectedValueOnce(
      new ApiError(400, "Invalid customer data", [
        { path: ["taxId"], message: `Invalid tax ID for country ${country}` },
      ]),
    );
    render(<CustomerForm onCustomerCreated={vi.fn()} />);
    fillRequiredFields(country);

    await submitForm();

    expect(screen.getByRole("alert")).toHaveTextContent("Revisa los campos indicados.");
    expect(screen.getByLabelText("Identificación fiscal")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText(new RegExp(expectedMessage))).toBeInTheDocument();
    expect(screen.getByText(/caracteres de control|9 dígitos|formato DE/)).toBeInTheDocument();
  });

  it.each([
    ["email", "Introduce una dirección de correo electrónico válida."],
    ["companyName", "Comprueba el nombre de la empresa."],
    ["country", "Selecciona un país válido."],
    ["plan", "Selecciona un plan válido."],
  ])("identifies an invalid %s field", async (field, message) => {
    vi.mocked(createCustomer).mockRejectedValueOnce(
      new ApiError(400, "Invalid customer data", [
        { path: [field], message: "Internal validation message" },
      ]),
    );
    render(<CustomerForm onCustomerCreated={vi.fn()} />);
    fillRequiredFields();

    await submitForm();

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Revisa los campos indicados.");
  });

  it("shows a Spanish message for an existing tax ID", async () => {
    vi.mocked(createCustomer).mockRejectedValueOnce(new ApiError(409, "DuplicateCustomerError"));
    render(<CustomerForm onCustomerCreated={vi.fn()} />);
    fillRequiredFields();

    await submitForm();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Ya existe un cliente con esa identificación fiscal en el país seleccionado.",
    );
  });

  it("falls back safely when validation details are absent or malformed", async () => {
    vi.mocked(createCustomer).mockRejectedValueOnce(
      new ApiError(400, "Invalid customer data", [{ path: ["unknown"], message: "Unknown" }]),
    );
    render(<CustomerForm onCustomerCreated={vi.fn()} />);
    fillRequiredFields();

    await submitForm();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No se pudieron validar los datos del cliente.",
    );
    expect(screen.queryByText("Invalid customer data")).not.toBeInTheDocument();
  });

  it("communicates a connection failure without exposing a technical message", async () => {
    vi.mocked(createCustomer).mockRejectedValueOnce(new TypeError("Failed to fetch"));
    render(<CustomerForm onCustomerCreated={vi.fn()} />);
    fillRequiredFields();

    await submitForm();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No se pudo conectar con el servidor.",
    );
    expect(screen.queryByText("Failed to fetch")).not.toBeInTheDocument();
  });

  it("preserves the successful registration and success state", async () => {
    const onCustomerCreated = vi.fn();
    vi.mocked(createCustomer).mockResolvedValueOnce(validCustomer);
    render(<CustomerForm onCustomerCreated={onCustomerCreated} />);
    fillRequiredFields();

    await submitForm();

    await waitFor(() => expect(onCustomerCreated).toHaveBeenCalledWith(validCustomer));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Cliente registrado correctamente.",
    );
    expect(screen.getByLabelText("Nombre de la empresa")).toHaveValue("");
  });
});
