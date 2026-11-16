import { describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { SimulationForm } from "./SimulationForm";
import { getCustomers } from "../../api/customers";
import type { Customer } from "../../types/customer";
import { createSimulation, previewSimulation } from "../../api/simulations";

vi.mock("../../api/customers", () => ({
  getCustomers: vi.fn(),
}));

vi.mock("../../api/simulations", () => ({
  createSimulation: vi.fn(),
  previewSimulation: vi.fn(),
}));

const mockCustomer: Customer = {
  id: "customer-test-fr",
  companyName: "Empresa de pruebas Francia",
  taxId: "123456789",
  email: "pruebas@example.fr",
  country: "FR",
  plan: "Enterprise",
  createdAt: "2026-11-16T10:00:00.000Z",
};

const mockCustomerES: Customer = {
  id: "customer-test-es",
  companyName: "Empresa de pruebas España",
  taxId: "B12345674",
  email: "pruebas@example.es",
  country: "ES",
  plan: "Professional",
  createdAt: "2026-11-16T10:00:00.000Z",
};

const mockPreview = {
  customerId: mockCustomer.id,
  activeUsers: 20,
  storageGb: 100,
  apiCalls: 1000,
  plan: "Enterprise",
  country: "FR",
  taxRate: "0.20",
  usersCostCents: 18000,
  subtotalCents: 18000,
  taxCents: 3600,
  totalCents: 21600,
};

function createDeferredPromise<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

describe("SimulationForm", () => {
  it("shows 10 active users by default", async () => {
    vi.mocked(getCustomers).mockResolvedValue([mockCustomer]);

    render(<SimulationForm onSimulationCreated={vi.fn()} />);

    const activeUsersInput = screen.getByRole("spinbutton", {
      name: "Usuarios activos",
    });

    expect(activeUsersInput).toHaveValue(10);

    const slider = screen.getByRole("slider", {
      name: "Ajustar usuarios con el deslizador (0–500)",
    });

    expect(slider).toHaveValue("10");

    // Esperar a que finalice la carga asíncrona de clientes.
    expect(
      await screen.findByRole("option", {
        name: "Empresa de pruebas Francia",
      }),
    ).toBeInTheDocument();
  });

  it("keeps the slider and numeric input synchronized", async () => {
    vi.mocked(getCustomers).mockResolvedValue([mockCustomer]);

    render(<SimulationForm onSimulationCreated={vi.fn()} />);

    await screen.findByRole("option", {
      name: "Empresa de pruebas Francia",
    });

    const activeUsersInput = screen.getByRole("spinbutton", {
      name: "Usuarios activos",
    });

    const slider = screen.getByRole("slider", {
      name: "Ajustar usuarios con el deslizador (0–500)",
    });

    // Mover el slider debe actualizar el campo numérico.
    fireEvent.change(slider, {
      target: { value: "150" },
    });

    expect(activeUsersInput).toHaveValue(150);
    expect(slider).toHaveValue("150");

    // Modificar el campo numérico debe actualizar el slider.
    fireEvent.change(activeUsersInput, {
      target: { value: "300" },
    });

    expect(activeUsersInput).toHaveValue(300);
    expect(slider).toHaveValue("300");

    // El campo admite más de 500 usuarios.
    fireEvent.change(activeUsersInput, {
      target: { value: "750" },
    });

    expect(activeUsersInput).toHaveValue(750);

    // El slider permanece limitado a 500.
    expect(slider).toHaveValue("500");
  });

  it("updates the cost preview without creating a simulation", async () => {
    vi.mocked(getCustomers).mockResolvedValue([mockCustomer]);
    vi.mocked(previewSimulation).mockResolvedValue(mockPreview);

    render(<SimulationForm onSimulationCreated={vi.fn()} />);

    // Esperar a que se cargue el cliente.
    await screen.findByRole("option", {
      name: "Empresa de pruebas Francia",
    });

    // Seleccionar el cliente.
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: mockCustomer.id },
    });

    // Completar los datos de la simulación.
    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Usuarios activos" }),
      { target: { value: "20" } },
    );

    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Almacenamiento (GB)" }),
      { target: { value: "100" } },
    );

    fireEvent.change(screen.getByRole("spinbutton", { name: "Llamadas API" }), {
      target: { value: "1000" },
    });

    const expectedInput = {
      customerId: mockCustomer.id,
      activeUsers: 20,
      storageGb: 100,
      apiCalls: 1000,
    };

    // Esperar a la petición automática de vista previa.
    await waitFor(() => {
      expect(previewSimulation).toHaveBeenCalledWith(expectedInput);
    });

    // Comprobar el total calculado por el backend simulado.
    expect(await screen.findByText("216,00 €")).toBeInTheDocument();

    // La vista previa no debe crear ninguna simulación.
    expect(createSimulation).not.toHaveBeenCalled();
  });

  it("recalculates the preview when active users change", async () => {
    vi.mocked(getCustomers).mockResolvedValue([mockCustomer]);

    vi.mocked(previewSimulation).mockImplementation(async (input) => {
      const totalCents = input.activeUsers === 20 ? 21600 : 50400;

      return {
        ...mockPreview,
        ...input,
        usersCostCents: input.activeUsers === 20 ? 18000 : 42000,
        subtotalCents: input.activeUsers === 20 ? 18000 : 42000,
        taxCents: input.activeUsers === 20 ? 3600 : 8400,
        totalCents,
      };
    });

    render(<SimulationForm onSimulationCreated={vi.fn()} />);

    await screen.findByRole("option", {
      name: "Empresa de pruebas Francia",
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: mockCustomer.id },
    });

    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Usuarios activos" }),
      { target: { value: "20" } },
    );

    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Almacenamiento (GB)" }),
      { target: { value: "100" } },
    );

    fireEvent.change(screen.getByRole("spinbutton", { name: "Llamadas API" }), {
      target: { value: "1000" },
    });

    // Primera estimación: 20 usuarios.
    expect(await screen.findByText("216,00 €")).toBeInTheDocument();

    // Cambiar a 50 usuarios mediante el slider.
    fireEvent.change(screen.getByRole("slider"), {
      target: { value: "50" },
    });

    // Segunda estimación: 50 usuarios.
    await waitFor(() => {
      expect(previewSimulation).toHaveBeenCalledWith({
        customerId: mockCustomer.id,
        activeUsers: 50,
        storageGb: 100,
        apiCalls: 1000,
      });
    });

    expect(await screen.findByText("504,00 €")).toBeInTheDocument();

    // No se ha guardado ninguna simulación.
    expect(createSimulation).not.toHaveBeenCalled();
  });

  it("recalculates the preview when switching customers", async () => {
    vi.mocked(getCustomers).mockResolvedValue([mockCustomer, mockCustomerES]);

    vi.mocked(previewSimulation).mockImplementation(async (input) => {
      const isSpain = input.customerId === mockCustomerES.id;

      return {
        ...mockPreview,
        ...input,
        plan: isSpain ? "Professional" : "Enterprise",
        country: isSpain ? "ES" : "FR",
        taxRate: isSpain ? "0.21" : "0.20",
        taxCents: isSpain ? 3780 : 3600,
        totalCents: isSpain ? 21780 : 21600,
      };
    });

    render(<SimulationForm onSimulationCreated={vi.fn()} />);

    await screen.findByRole("option", {
      name: "Empresa de pruebas Francia",
    });

    const customerSelect = screen.getByRole("combobox");

    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Usuarios activos" }),
      { target: { value: "20" } },
    );

    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Almacenamiento (GB)" }),
      { target: { value: "100" } },
    );

    fireEvent.change(screen.getByRole("spinbutton", { name: "Llamadas API" }), {
      target: { value: "1000" },
    });

    // Primera estimación: cliente francés.
    fireEvent.change(customerSelect, {
      target: { value: mockCustomer.id },
    });

    expect(await screen.findByText("216,00 €")).toBeInTheDocument();

    // Cambiar al cliente español.
    fireEvent.change(customerSelect, {
      target: { value: mockCustomerES.id },
    });

    // Debe solicitar una nueva estimación para el cliente español.
    await waitFor(() => {
      expect(previewSimulation).toHaveBeenCalledWith({
        customerId: mockCustomerES.id,
        activeUsers: 20,
        storageGb: 100,
        apiCalls: 1000,
      });
    });

    // El total debe incluir el 21 % de impuestos de España.
    expect(await screen.findByText("217,80 €")).toBeInTheDocument();

    // No debe mantenerse el importe anterior.
    expect(screen.queryByText("216,00 €")).not.toBeInTheDocument();

    // Ninguna vista previa debe crear simulaciones.
    expect(createSimulation).not.toHaveBeenCalled();
  });

  it("does not request a preview with invalid active users", async () => {
    vi.mocked(getCustomers).mockResolvedValue([mockCustomer]);
    vi.mocked(previewSimulation).mockResolvedValue(mockPreview);

    render(<SimulationForm onSimulationCreated={vi.fn()} />);

    await screen.findByRole("option", {
      name: "Empresa de pruebas Francia",
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: mockCustomer.id },
    });

    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Almacenamiento (GB)" }),
      { target: { value: "100" } },
    );

    fireEvent.change(screen.getByRole("spinbutton", { name: "Llamadas API" }), {
      target: { value: "1000" },
    });

    // Introducir un número de usuarios superior al permitido.
    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Usuarios activos" }),
      { target: { value: "100001" } },
    );

    // Esperar más que los 300 ms del debounce.
    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(previewSimulation).not.toHaveBeenCalled();
    expect(createSimulation).not.toHaveBeenCalled();

    expect(
      screen.getByText(
        "Selecciona un cliente y completa los campos para consultar el coste.",
      ),
    ).toBeInTheDocument();
  });

  it("shows an error when the preview request fails", async () => {
    vi.mocked(getCustomers).mockResolvedValue([mockCustomer]);

    vi.mocked(previewSimulation).mockRejectedValue(
      new Error("No se pudo conectar con el servidor"),
    );

    render(<SimulationForm onSimulationCreated={vi.fn()} />);

    await screen.findByRole("option", {
      name: "Empresa de pruebas Francia",
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: mockCustomer.id },
    });

    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Usuarios activos" }),
      { target: { value: "20" } },
    );

    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Almacenamiento (GB)" }),
      { target: { value: "100" } },
    );

    fireEvent.change(screen.getByRole("spinbutton", { name: "Llamadas API" }), {
      target: { value: "1000" },
    });

    // Esperar a que falle la petición de vista previa.
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "No se pudo conectar con el servidor",
    );

    expect(previewSimulation).toHaveBeenCalledWith({
      customerId: mockCustomer.id,
      activeUsers: 20,
      storageGb: 100,
      apiCalls: 1000,
    });

    // El error de la vista previa no debe guardar una simulación.
    expect(createSimulation).not.toHaveBeenCalled();
  });

  it("ignores an outdated preview response when active users change", async () => {
    vi.mocked(getCustomers).mockResolvedValue([mockCustomer]);

    const delayedResponse =
      createDeferredPromise<Awaited<ReturnType<typeof previewSimulation>>>();

    vi.mocked(previewSimulation).mockImplementation(async (input) => {
      if (input.activeUsers === 20) {
        return delayedResponse.promise;
      }

      return {
        ...mockPreview,
        ...input,
        usersCostCents: 42000,
        subtotalCents: 42000,
        taxCents: 8400,
        totalCents: 50400,
      };
    });

    render(<SimulationForm onSimulationCreated={vi.fn()} />);

    await screen.findByRole("option", {
      name: "Empresa de pruebas Francia",
    });

    const activeUsersInput = screen.getByRole("spinbutton", {
      name: "Usuarios activos",
    });

    // Completar el formulario.
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: mockCustomer.id },
    });

    fireEvent.change(
      screen.getByRole("spinbutton", { name: "Almacenamiento (GB)" }),
      { target: { value: "100" } },
    );

    fireEvent.change(screen.getByRole("spinbutton", { name: "Llamadas API" }), {
      target: { value: "1000" },
    });

    // Primera petición: 20 usuarios. Dejaremos su respuesta pendiente.
    fireEvent.change(activeUsersInput, {
      target: { value: "20" },
    });

    await waitFor(() => {
      expect(previewSimulation).toHaveBeenCalledWith({
        customerId: mockCustomer.id,
        activeUsers: 20,
        storageGb: 100,
        apiCalls: 1000,
      });
    });

    // Segunda petición: 50 usuarios.
    fireEvent.change(activeUsersInput, {
      target: { value: "50" },
    });

    expect(await screen.findByText("504,00 €")).toBeInTheDocument();

    // La petición antigua de 20 usuarios termina después.
    await act(async () => {
      delayedResponse.resolve(mockPreview);
      await delayedResponse.promise;
    });

    // La respuesta antigua no debe reemplazar la estimación actual.
    expect(screen.getByText("504,00 €")).toBeInTheDocument();
    expect(screen.queryByText("216,00 €")).not.toBeInTheDocument();

    // Ninguna petición de vista previa debe guardar simulaciones.
    expect(createSimulation).not.toHaveBeenCalled();
  });
});
