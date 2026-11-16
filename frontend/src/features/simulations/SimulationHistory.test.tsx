import { describe, expect, it, vi } from "vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { SimulationHistory } from "./SimulationHistory";
import { getCustomers } from "../../api/customers";
import { getSimulations } from "../../api/simulations";

// Simular las peticiones HTTP para no depender del backend.
vi.mock("../../api/customers", () => ({
  getCustomers: vi.fn().mockResolvedValue([]),
}));

vi.mock("../../api/simulations", () => ({
  getSimulations: vi.fn().mockResolvedValue([]),
}));

// Evitar peticiones de divisas durante las pruebas del historial.
vi.mock("../currency/CurrencySelector", () => ({
  CurrencySelector: () => <div>Selector de divisas</div>,
}));

const mockCustomer = {
  id: "customer-test-1",
  name: "Empresa de pruebas",
  companyName: "Empresa de pruebas",
  country: "ES",
};

const mockCustomer2 = {
  id: "customer-test-2",
  name: "Segunda empresa",
  companyName: "Segunda empresa",
  country: "FR",
};

const mockSimulations = Array.from({ length: 11 }, (_, index) => ({
  id: `simulation-${index + 1}`,
  customerId: mockCustomer.id,
  createdAt: new Date(Date.now() - index * 60_000).toISOString(),
  totalCents: 12100,
  activeUsers: 10,
  plan: "Starter",
  country: "ES",
}));

const mockSimulationsCustomer2 = Array.from({ length: 3 }, (_, index) => ({
  id: `customer-2-simulation-${index + 1}`,
  customerId: mockCustomer2.id,
  createdAt: new Date(Date.now() - index * 60_000).toISOString(),
  totalCents: 24200,
  activeUsers: 20,
  plan: "Professional",
  country: "FR",
}));

function createDeferredPromise<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });

  return { promise, resolve, reject };
}

describe("SimulationHistory", () => {
  it("shows a message when no customer is selected", async () => {
    render(<SimulationHistory />);

    expect(
      screen.getByText("Selecciona un cliente para consultar su historial."),
    ).toBeInTheDocument();

    // Esperar a que termine la carga asíncrona de clientes.
    const customerSelect = await screen.findByRole("combobox");

    expect(customerSelect).toBeInTheDocument();
  });

  it("requests the first 10 simulations when a customer is selected", async () => {
    // Preparar el cliente ficticio.
    vi.mocked(getCustomers).mockResolvedValueOnce([
      mockCustomer,
    ] as unknown as Awaited<ReturnType<typeof getCustomers>>);

    // Simular la paginación del backend: 10 elementos por petición.
    vi.mocked(getSimulations).mockImplementationOnce(
      async (_customerId, skip = 0) =>
        mockSimulations.slice(skip, skip + 10) as unknown as Awaited<
          ReturnType<typeof getSimulations>
        >,
    );

    render(<SimulationHistory />);

    // Esperar a que aparezca el cliente en el selector.
    const customerOption = await screen.findByRole("option", {
      name: "Empresa de pruebas",
    });

    expect(customerOption).toBeInTheDocument();

    // Seleccionar el cliente ficticio.
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: mockCustomer.id },
    });

    // Comprobar que se solicita la primera página del historial.
    await waitFor(() => {
      expect(getSimulations).toHaveBeenCalledWith(mockCustomer.id, 0);
    });

    // Comprobar que aparecen las 10 simulaciones iniciales.
    expect(await screen.findAllByText("Selector de divisas")).toHaveLength(10);

    // Debe existir el botón para cargar la simulación restante.
    expect(
      screen.getByRole("button", { name: "Mostrar más" }),
    ).toBeInTheDocument();
  });

  it("loads more simulations without duplicates", async () => {
    vi.mocked(getCustomers).mockResolvedValueOnce([
      mockCustomer,
    ] as unknown as Awaited<ReturnType<typeof getCustomers>>);

    vi.mocked(getSimulations).mockImplementation(
      async (_customerId, skip = 0) =>
        mockSimulations.slice(skip, skip + 10) as unknown as Awaited<
          ReturnType<typeof getSimulations>
        >,
    );

    render(<SimulationHistory />);

    await screen.findByRole("option", {
      name: "Empresa de pruebas",
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: mockCustomer.id },
    });

    expect(await screen.findAllByText("Selector de divisas")).toHaveLength(10);

    const loadMoreButton = screen.getByRole("button", {
      name: "Mostrar más",
    });

    fireEvent.click(loadMoreButton);

    await waitFor(() => {
      expect(getSimulations).toHaveBeenCalledWith(mockCustomer.id, 10);
    });

    await waitFor(() => {
      expect(screen.getAllByText("Selector de divisas")).toHaveLength(11);
    });

    expect(
      screen.queryByRole("button", { name: "Mostrar más" }),
    ).not.toBeInTheDocument();
  });

  it("does not mix simulations when switching customers", async () => {
    vi.mocked(getCustomers).mockResolvedValueOnce([
      mockCustomer,
      mockCustomer2,
    ] as unknown as Awaited<ReturnType<typeof getCustomers>>);

    vi.mocked(getSimulations).mockImplementation(
      async (customerId, skip = 0) => {
        const simulations =
          customerId === mockCustomer.id
            ? mockSimulations
            : mockSimulationsCustomer2;

        return simulations.slice(skip, skip + 10) as unknown as Awaited<
          ReturnType<typeof getSimulations>
        >;
      },
    );

    render(<SimulationHistory />);

    await screen.findByRole("option", {
      name: "Empresa de pruebas",
    });

    const customerSelect = screen.getByRole("combobox");

    // Seleccionar la primera empresa.
    fireEvent.change(customerSelect, {
      target: { value: mockCustomer.id },
    });

    // La primera empresa tiene 10 simulaciones visibles.
    expect(await screen.findAllByText("Selector de divisas")).toHaveLength(10);

    // Cambiar a la segunda empresa.
    fireEvent.change(customerSelect, {
      target: { value: mockCustomer2.id },
    });

    await waitFor(() => {
      expect(getSimulations).toHaveBeenCalledWith(mockCustomer2.id, 0);
      expect(screen.getAllByText("Selector de divisas")).toHaveLength(3);
    });

    // Ninguna simulación de la primera empresa debe seguir visible.
    expect(screen.queryByText("121,00 €")).not.toBeInTheDocument();
  });

  it("ignores an outdated load-more response after switching customers", async () => {
    // Esta promesa representa la segunda página del primer cliente.
    const delayedResponse =
      createDeferredPromise<Awaited<ReturnType<typeof getSimulations>>>();

    vi.mocked(getCustomers).mockResolvedValueOnce([
      mockCustomer,
      mockCustomer2,
    ] as unknown as Awaited<ReturnType<typeof getCustomers>>);

    vi.mocked(getSimulations).mockImplementation(
      async (customerId, skip = 0) => {
        // Retrasar únicamente la segunda página del primer cliente.
        if (customerId === mockCustomer.id && skip === 10) {
          return delayedResponse.promise;
        }

        const simulations =
          customerId === mockCustomer.id
            ? mockSimulations
            : mockSimulationsCustomer2;

        return simulations.slice(skip, skip + 10) as unknown as Awaited<
          ReturnType<typeof getSimulations>
        >;
      },
    );

    render(<SimulationHistory />);

    await screen.findByRole("option", {
      name: "Empresa de pruebas",
    });

    const customerSelect = screen.getByRole("combobox");

    // 1. Seleccionar el primer cliente.
    fireEvent.change(customerSelect, {
      target: { value: mockCustomer.id },
    });

    expect(await screen.findAllByText("Selector de divisas")).toHaveLength(10);

    // 2. Solicitar una segunda página que todavía no responderá.
    fireEvent.click(screen.getByRole("button", { name: "Mostrar más" }));

    await waitFor(() => {
      expect(getSimulations).toHaveBeenCalledWith(mockCustomer.id, 10);
    });

    // 3. Cambiar al segundo cliente antes de recibir la respuesta.
    fireEvent.change(customerSelect, {
      target: { value: mockCustomer2.id },
    });

    await waitFor(() => {
      expect(getSimulations).toHaveBeenCalledWith(mockCustomer2.id, 0);
      expect(screen.getAllByText("Selector de divisas")).toHaveLength(3);
    });

    // 4. Completar la petición antigua del primer cliente.
    await act(async () => {
      delayedResponse.resolve(
        mockSimulations.slice(10, 11) as unknown as Awaited<
          ReturnType<typeof getSimulations>
        >,
      );

      await delayedResponse.promise;
    });

    // 5. El historial debe seguir mostrando solo el segundo cliente.
    expect(screen.getAllByText("Selector de divisas")).toHaveLength(3);

    expect(
      screen.queryByRole("button", { name: "Mostrar más" }),
    ).not.toBeInTheDocument();
  });

  it("automatically selects a customer received from the parent", async () => {
    vi.mocked(getCustomers).mockResolvedValueOnce([
      {
        id: "customer-auto-123",
        companyName: "Empresa Automática SL",
        taxId: "B12345674",
        email: "automatica@example.es",
        country: "ES",
        plan: "Professional",
        createdAt: "2026-11-16T10:00:00.000Z",
      },
    ]);

    vi.mocked(getSimulations).mockResolvedValueOnce([]);

    render(<SimulationHistory selectedCustomerId="customer-auto-123" />);

    const customerSelector = await screen.findByRole("combobox", {
      name: "Seleccionar cliente",
    });

    await waitFor(() => {
      expect(customerSelector).toHaveValue("customer-auto-123");
    });

    await waitFor(() => {
      expect(getSimulations).toHaveBeenCalledWith("customer-auto-123", 0);
    });
  });
});
