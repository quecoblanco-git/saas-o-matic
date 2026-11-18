// Verifica carga, paginación, cambio de cliente y estados del historial.
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

vi.mock("../../api/customers", () => ({
  getCustomers: vi.fn().mockResolvedValue([]),
}));

vi.mock("../../api/simulations", () => ({
  getSimulations: vi.fn().mockResolvedValue([]),
}));

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

  activeUsers: 10,
  storageGb: 100,
  apiCalls: 5000,

  planSnapshot: "Starter",
  countrySnapshot: "ES",
  taxRateSnapshot: "21",

  usersCostCents: 10000,
  subtotalCents: 10000,
  taxCents: 2100,
  totalCents: 12100,
}));

const mockSimulationsCustomer2 = Array.from({ length: 3 }, (_, index) => ({
  id: `customer-2-simulation-${index + 1}`,
  customerId: mockCustomer2.id,
  createdAt: new Date(Date.now() - index * 60_000).toISOString(),

  activeUsers: 20,
  storageGb: 250,
  apiCalls: 12000,

  planSnapshot: "Professional",
  countrySnapshot: "FR",
  taxRateSnapshot: "20",

  usersCostCents: 18000,
  subtotalCents: 18000,
  taxCents: 3600,
  totalCents: 21600,
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

    const customerSelect = await screen.findByRole("combobox");

    expect(customerSelect).toBeInTheDocument();
  });

  it("requests the first 10 simulations when a customer is selected", async () => {
    vi.mocked(getCustomers).mockResolvedValueOnce([
      mockCustomer,
    ] as unknown as Awaited<ReturnType<typeof getCustomers>>);

    vi.mocked(getSimulations).mockImplementationOnce(
      async (_customerId, skip = 0) =>
        mockSimulations.slice(skip, skip + 10) as unknown as Awaited<
          ReturnType<typeof getSimulations>
        >,
    );

    render(<SimulationHistory />);

    const customerOption = await screen.findByRole("option", {
      name: "Empresa de pruebas",
    });

    expect(customerOption).toBeInTheDocument();

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: mockCustomer.id },
    });

    await waitFor(() => {
      expect(getSimulations).toHaveBeenCalledWith(mockCustomer.id, 0);
    });

    expect(await screen.findAllByText("Selector de divisas")).toHaveLength(10);

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

    fireEvent.change(customerSelect, {
      target: { value: mockCustomer.id },
    });

    expect(await screen.findAllByText("Selector de divisas")).toHaveLength(10);

    fireEvent.change(customerSelect, {
      target: { value: mockCustomer2.id },
    });

    await waitFor(() => {
      expect(getSimulations).toHaveBeenCalledWith(mockCustomer2.id, 0);
      expect(screen.getAllByText("Selector de divisas")).toHaveLength(3);
    });

    expect(screen.queryByText("121,00 €")).not.toBeInTheDocument();
  });

  it("ignores an outdated load-more response after switching customers", async () => {
    // Mantener pendiente la respuesta antigua mientras se cambia de cliente.
    const delayedResponse =
      createDeferredPromise<Awaited<ReturnType<typeof getSimulations>>>();

    vi.mocked(getCustomers).mockResolvedValueOnce([
      mockCustomer,
      mockCustomer2,
    ] as unknown as Awaited<ReturnType<typeof getCustomers>>);

    vi.mocked(getSimulations).mockImplementation(
      async (customerId, skip = 0) => {
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

    fireEvent.change(customerSelect, {
      target: { value: mockCustomer.id },
    });

    expect(await screen.findAllByText("Selector de divisas")).toHaveLength(10);

    fireEvent.click(screen.getByRole("button", { name: "Mostrar más" }));

    await waitFor(() => {
      expect(getSimulations).toHaveBeenCalledWith(mockCustomer.id, 10);
    });

    fireEvent.change(customerSelect, {
      target: { value: mockCustomer2.id },
    });

    await waitFor(() => {
      expect(getSimulations).toHaveBeenCalledWith(mockCustomer2.id, 0);
      expect(screen.getAllByText("Selector de divisas")).toHaveLength(3);
    });

    await act(async () => {
      delayedResponse.resolve(
        mockSimulations.slice(10, 11) as unknown as Awaited<
          ReturnType<typeof getSimulations>
        >,
      );

      await delayedResponse.promise;
    });

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

  it("shows the original inputs and billing breakdown in simulation details", async () => {
    vi.mocked(getCustomers).mockResolvedValueOnce([
      mockCustomer,
    ] as unknown as Awaited<ReturnType<typeof getCustomers>>);

    vi.mocked(getSimulations).mockResolvedValueOnce([
      mockSimulations[0],
    ] as unknown as Awaited<ReturnType<typeof getSimulations>>);

    render(<SimulationHistory />);

    await screen.findByRole("option", {
      name: "Empresa de pruebas",
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: mockCustomer.id },
    });

    const detailsButton = await screen.findByText("Ver detalles");

    fireEvent.click(detailsButton);

    expect(screen.getByText("Almacenamiento")).toBeVisible();
    expect(screen.getByText("100 GB")).toBeVisible();

    expect(screen.getByText("Llamadas a la API")).toBeVisible();
    expect(screen.getByText("5.000")).toBeVisible();

    expect(screen.getByText("Coste de usuarios")).toBeVisible();
    expect(screen.getByText("Subtotal")).toBeVisible();
    expect(screen.getByText("Impuestos (21%)")).toBeVisible();

    expect(screen.getAllByText("100,00 €")).toHaveLength(2);
    expect(screen.getByText("21,00 €")).toBeVisible();

    expect(screen.getAllByText("121,00 €")).toHaveLength(2);
  });
});
