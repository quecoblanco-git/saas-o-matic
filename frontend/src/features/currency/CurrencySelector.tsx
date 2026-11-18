import { useEffect, useState } from "react";

import { convertCurrency, getAvailableCurrencies } from "../../api/currency";
import type { CurrencyCode, CurrencyConversion } from "../../types/currency";

interface CurrencySelectorProps {
  amountCents: number;
}

const currencyLabels: Record<string, string> = {
  EUR: "Euro (EUR)",
  USD: "Dólar estadounidense (USD)",
  GBP: "Libra esterlina (GBP)",
};

const currencyLocales: Record<string, string> = {
  EUR: "es-ES",
  USD: "en-US",
  GBP: "en-GB",
};

export function CurrencySelector({ amountCents }: CurrencySelectorProps) {
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [currencies, setCurrencies] = useState<string[]>(["EUR"]);
  const [ratesError, setRatesError] = useState(false);
  const [conversion, setConversion] = useState<CurrencyConversion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAvailableCurrencies() {
      try {
        const response = await getAvailableCurrencies();
        if (!cancelled) {
          const available = [
            "EUR",
            ...Object.keys(response.rates)
              .filter((code) => code !== "EUR")
              .sort(),
          ];
          setCurrencies(available);
          setCurrency((selected) =>
            available.includes(selected) ? selected : "EUR",
          );
        }
      } catch {
        if (!cancelled) setRatesError(true);
      }
    }

    void loadAvailableCurrencies();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadConversion() {
      setLoading(true);
      setError(null);
      setConversion(null);

      try {
        const result = await convertCurrency({
          amountCents,
          currency,
        });

        if (!cancelled) {
          setConversion(result);
        }
      } catch {
        if (!cancelled) {
          setError("No se ha podido obtener la conversión de divisas.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadConversion();

    return () => {
      cancelled = true;
    };
  }, [amountCents, currency]);

  const originalAmount = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(amountCents / 100);

  const convertedAmount = conversion
    ? new Intl.NumberFormat(currencyLocales[currency] ?? "es-ES", {
        style: "currency",
        currency,
      }).format(Number(conversion.convertedAmount))
    : null;

  return (
    <section className="mt-4 space-y-3 rounded-lg border border-slate-700 p-4">
      <h3 className="text-lg font-semibold">Conversión de divisas</h3>

      <label className="block space-y-2">
        <span className="text-sm text-slate-300">Divisa de visualización</span>

        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-white"
        >
          {currencies.map((code) => (
            <option key={code} value={code}>
              {currencyLabels[code] ?? code}
            </option>
          ))}
        </select>
      </label>

      {ratesError && (
        <p role="alert" className="text-sm text-amber-400">
          No se ha podido cargar la lista de divisas disponibles.
        </p>
      )}

      <p className="text-sm text-slate-400">
        Importe original: {originalAmount}
      </p>

      {loading && (
        <p className="text-sm text-slate-300">Convirtiendo importe...</p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error} El importe original sigue siendo {originalAmount}.
        </p>
      )}

      {conversion && convertedAmount && (
        <div className="space-y-2">
          <p className="text-2xl font-bold text-emerald-400">
            {convertedAmount}
          </p>

          {currency !== "EUR" && (
            <>
              <p className="text-xs text-slate-400">
                Tipo de cambio: {conversion.exchangeRate}
              </p>

              {conversion.ratesUpdatedAt && (
                <p className="text-xs text-slate-400">
                  Tasas obtenidas:{" "}
                  {new Date(conversion.ratesUpdatedAt).toLocaleString("es-ES")}
                </p>
              )}

              {conversion.isStale && (
                <p role="status" className="text-sm text-amber-400">
                  Atención: se están utilizando tipos de cambio desactualizados.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
