import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import { CurrencySelector } from "./CurrencySelector";
import { convertCurrency, getAvailableCurrencies } from "../../api/currency";

vi.mock("../../api/currency", () => ({
  convertCurrency: vi.fn(),
  getAvailableCurrencies: vi.fn(),
}));

describe("CurrencySelector", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.mocked(getAvailableCurrencies).mockResolvedValue({
      baseCurrency: "EUR",
      rates: { USD: "1.15", GBP: "0.85", JPY: "163.4" },
      ratesUpdatedAt: "2026-11-17T12:00:00.000Z",
      isStale: false,
    });
  });

  it("shows the original EUR amount and available currencies", async () => {
    vi.mocked(convertCurrency).mockResolvedValue({
      originalAmountCents: 16800,
      originalCurrency: "EUR",
      convertedAmount: "168.00",
      targetCurrency: "EUR",
      exchangeRate: "1",
      ratesUpdatedAt: null,
      isStale: false,
    });

    render(<CurrencySelector amountCents={16800} />);

    expect(screen.getByText(/Importe original:/)).toHaveTextContent("168,00 €");

    // Incluye divisas conocidas y códigos recibidos dinámicamente.
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Dólar estadounidense (USD)" })).toBeInTheDocument();
    });
    expect(
      screen.getByRole("option", { name: "Euro (EUR)" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Dólar estadounidense (USD)" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Libra esterlina (GBP)" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("option", { name: "JPY" })).toBeInTheDocument();

    await waitFor(() => {
      expect(convertCurrency).toHaveBeenCalledWith({
        amountCents: 16800,
        currency: "EUR",
      });
    });
  });

  it("keeps EUR available and shows a notice when rates cannot be loaded", async () => {
    vi.mocked(getAvailableCurrencies).mockRejectedValueOnce(
      new Error("Currency rates service unavailable"),
    );

    render(<CurrencySelector amountCents={16800} />);

    expect(
      await screen.findByText(
        "No se ha podido cargar la lista de divisas disponibles.",
      ),
    ).toBeVisible();
    expect(screen.getByRole("option", { name: "Euro (EUR)" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "Dólar estadounidense (USD)" }),
    ).not.toBeInTheDocument();
  });

  it("converts the amount to USD when the selected currency changes", async () => {
    vi.mocked(convertCurrency).mockImplementation(async ({ currency }) => {
      if (currency === "USD") {
        return {
          originalAmountCents: 16800,
          originalCurrency: "EUR",
          convertedAmount: "193.20",
          targetCurrency: "USD",
          exchangeRate: "1.15",
          ratesUpdatedAt: "2026-11-17T12:00:00.000Z",
          isStale: false,
        };
      }

      return {
        originalAmountCents: 16800,
        originalCurrency: "EUR",
        convertedAmount: "168.00",
        targetCurrency: "EUR",
        exchangeRate: "1",
        ratesUpdatedAt: null,
        isStale: false,
      };
    });

    render(<CurrencySelector amountCents={16800} />);

    await screen.findByRole("option", { name: "Dólar estadounidense (USD)" });
    const currencySelector = screen.getByRole("combobox");

    fireEvent.change(currencySelector, {
      target: { value: "USD" },
    });

    await waitFor(() => {
      expect(convertCurrency).toHaveBeenCalledWith({
        amountCents: 16800,
        currency: "USD",
      });
    });

    expect(await screen.findByText("$193.20")).toBeVisible();

    expect(screen.getByText(/Importe original:/)).toHaveTextContent("168,00 €");

    expect(screen.getByText("Tipo de cambio: 1.15")).toBeVisible();
  });

  it("converts the amount to GBP when the selected currency changes", async () => {
    vi.mocked(convertCurrency).mockImplementation(async ({ currency }) => {
      if (currency === "GBP") {
        return {
          originalAmountCents: 16800,
          originalCurrency: "EUR",
          convertedAmount: "142.80",
          targetCurrency: "GBP",
          exchangeRate: "0.85",
          ratesUpdatedAt: "2026-11-17T12:00:00.000Z",
          isStale: false,
        };
      }

      return {
        originalAmountCents: 16800,
        originalCurrency: "EUR",
        convertedAmount: "168.00",
        targetCurrency: "EUR",
        exchangeRate: "1",
        ratesUpdatedAt: null,
        isStale: false,
      };
    });

    render(<CurrencySelector amountCents={16800} />);

    await screen.findByRole("option", { name: "Libra esterlina (GBP)" });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "GBP" },
    });

    await waitFor(() => {
      expect(convertCurrency).toHaveBeenCalledWith({
        amountCents: 16800,
        currency: "GBP",
      });
    });

    expect(await screen.findByText("£142.80")).toBeVisible();

    expect(screen.getByText(/Importe original:/)).toHaveTextContent("168,00 €");

    expect(screen.getByText("Tipo de cambio: 0.85")).toBeVisible();
    expect(screen.getByText(/Tasas obtenidas:/)).toBeVisible();
  });

  it("converts to a currency returned dynamically by the rates API", async () => {
    vi.mocked(convertCurrency).mockImplementation(async ({ currency }) => ({
      originalAmountCents: 16800,
      originalCurrency: "EUR",
      convertedAmount: currency === "JPY" ? "27451.20" : "168.00",
      targetCurrency: currency,
      exchangeRate: currency === "JPY" ? "163.4" : "1",
      ratesUpdatedAt: "2026-11-17T12:00:00.000Z",
      isStale: false,
    }));

    render(<CurrencySelector amountCents={16800} />);

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "JPY" })).toBeInTheDocument();
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "JPY" },
    });

    await waitFor(() => {
      expect(convertCurrency).toHaveBeenCalledWith({
        amountCents: 16800,
        currency: "JPY",
      });
    });
    expect(await screen.findByText(/27\.451/)).toBeVisible();
  });

  it("warns the user when exchange rates are outdated", async () => {
    vi.mocked(convertCurrency).mockImplementation(async ({ currency }) => {
      if (currency === "USD") {
        return {
          originalAmountCents: 16800,
          originalCurrency: "EUR",
          convertedAmount: "193.20",
          targetCurrency: "USD",
          exchangeRate: "1.15",
          ratesUpdatedAt: "2026-11-13T12:00:00.000Z",
          isStale: true,
        };
      }

      return {
        originalAmountCents: 16800,
        originalCurrency: "EUR",
        convertedAmount: "168.00",
        targetCurrency: "EUR",
        exchangeRate: "1",
        ratesUpdatedAt: null,
        isStale: false,
      };
    });

    render(<CurrencySelector amountCents={16800} />);

    await screen.findByRole("option", { name: "Dólar estadounidense (USD)" });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "USD" },
    });

    const warning = await screen.findByRole("status");

    expect(warning).toHaveTextContent(
      "Atención: se están utilizando tipos de cambio desactualizados.",
    );

    expect(screen.getByText("$193.20")).toBeVisible();

    expect(screen.getByText(/Importe original:/)).toHaveTextContent("168,00 €");

    expect(screen.getByText(/Tasas obtenidas:/)).toBeVisible();
  });

  it("keeps the original EUR amount visible when currency conversion fails", async () => {
    vi.mocked(convertCurrency).mockImplementation(async ({ currency }) => {
      if (currency === "USD") {
        throw new Error("Currency conversion service unavailable");
      }

      return {
        originalAmountCents: 16800,
        originalCurrency: "EUR",
        convertedAmount: "168.00",
        targetCurrency: "EUR",
        exchangeRate: "1",
        ratesUpdatedAt: null,
        isStale: false,
      };
    });

    render(<CurrencySelector amountCents={16800} />);

    await screen.findByRole("option", { name: "Dólar estadounidense (USD)" });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "USD" },
    });

    const errorMessage = await screen.findByRole("alert");

    expect(errorMessage).toHaveTextContent(
      "No se ha podido obtener la conversión de divisas.",
    );

    expect(errorMessage).toHaveTextContent(
      "El importe original sigue siendo 168,00 €.",
    );

    expect(screen.getByText(/Importe original:/)).toHaveTextContent("168,00 €");

    expect(screen.queryByText("$193.20")).not.toBeInTheDocument();
  });

  it("shows a loading message while the conversion request is pending", async () => {
    let resolveConversion!: (
      value: Awaited<ReturnType<typeof convertCurrency>>,
    ) => void;

    const pendingConversion = new Promise<
      Awaited<ReturnType<typeof convertCurrency>>
    >((resolve) => {
      resolveConversion = resolve;
    });

    vi.mocked(convertCurrency).mockReturnValue(pendingConversion);

    render(<CurrencySelector amountCents={16800} />);

    expect(screen.getByText("Convirtiendo importe...")).toBeVisible();

    expect(screen.getByText(/Importe original:/)).toHaveTextContent("168,00 €");

    await act(async () => {
      resolveConversion({
        originalAmountCents: 16800,
        originalCurrency: "EUR",
        convertedAmount: "168.00",
        targetCurrency: "EUR",
        exchangeRate: "1",
        ratesUpdatedAt: null,
        isStale: false,
      });

      await pendingConversion;
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Convirtiendo importe..."),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Importe original:/)).toHaveTextContent("168,00 €");
  });

  it("ignores outdated conversion responses after changing currency", async () => {
    type ConversionResult = Awaited<ReturnType<typeof convertCurrency>>;

    let resolveUsd!: (value: ConversionResult) => void;

    const pendingUsd = new Promise<ConversionResult>((resolve) => {
      resolveUsd = resolve;
    });

    vi.mocked(convertCurrency).mockImplementation(async ({ currency }) => {
      if (currency === "USD") {
        return pendingUsd;
      }

      if (currency === "GBP") {
        return {
          originalAmountCents: 16800,
          originalCurrency: "EUR",
          convertedAmount: "142.80",
          targetCurrency: "GBP",
          exchangeRate: "0.85",
          ratesUpdatedAt: "2026-11-17T12:00:00.000Z",
          isStale: false,
        };
      }

      return {
        originalAmountCents: 16800,
        originalCurrency: "EUR",
        convertedAmount: "168.00",
        targetCurrency: "EUR",
        exchangeRate: "1",
        ratesUpdatedAt: null,
        isStale: false,
      };
    });

    render(<CurrencySelector amountCents={16800} />);

    await screen.findByRole("option", { name: "Dólar estadounidense (USD)" });
    const selector = screen.getByRole("combobox");

    // Mantener pendiente USD para verificar que su respuesta tardía no sobrescriba GBP.
    fireEvent.change(selector, {
      target: { value: "USD" },
    });

    await waitFor(() => {
      expect(convertCurrency).toHaveBeenCalledWith({
        amountCents: 16800,
        currency: "USD",
      });
    });

    fireEvent.change(selector, {
      target: { value: "GBP" },
    });

    expect(await screen.findByText("£142.80")).toBeVisible();

    await act(async () => {
      resolveUsd({
        originalAmountCents: 16800,
        originalCurrency: "EUR",
        convertedAmount: "193.20",
        targetCurrency: "USD",
        exchangeRate: "1.15",
        ratesUpdatedAt: "2026-11-17T12:00:00.000Z",
        isStale: false,
      });

      await pendingUsd;
    });

    expect(screen.getByText("£142.80")).toBeVisible();
    expect(screen.queryByText("$193.20")).not.toBeInTheDocument();
    expect(selector).toHaveValue("GBP");
  });
});
