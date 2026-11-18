// Permite elegir una divisa y muestra el importe convertido y su estado.
import { ArrowRightLeft, Coins, LoaderCircle, TriangleAlert } from "lucide-react";
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
    <section className="mt-4 space-y-3 rounded-xl border border-slate-700/70 bg-slate-950/35 p-3.5 sm:p-4">
      <div className="flex items-center gap-2.5">
        <span className="grid size-8 place-items-center rounded-lg bg-blue-400/10 text-blue-200">
          <Coins size={16} aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Conversión de divisas</h3>
          <p className="mt-0.5 text-xs text-slate-500">Solo cambia la visualización del importe</p>
        </div>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium text-slate-400">Divisa de visualización</span>
        <select
          value={currency}
          onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
          className="min-h-10 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white transition hover:border-slate-600 focus:border-blue-400/80"
        >
          {currencies.map((code) => (
            <option key={code} value={code}>
              {currencyLabels[code] ?? code}
            </option>
          ))}
        </select>
      </label>

      {ratesError && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-amber-300/20 bg-amber-300/[0.07] px-3 py-2 text-xs leading-5 text-amber-200">
          <TriangleAlert size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
          No se ha podido cargar la lista de divisas disponibles.
        </p>
      )}

      <p className="flex items-center justify-between gap-3 rounded-lg border border-slate-700/60 bg-slate-900/55 px-3 py-2.5 text-xs text-slate-400">
        Importe original: {originalAmount}
      </p>

      {loading && (
        <p aria-live="polite" className="flex items-center gap-2 text-xs text-slate-300">
          <LoaderCircle size={14} aria-hidden="true" className="animate-spin text-blue-300" />
          Convirtiendo importe...
        </p>
      )}

      {error && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2.5 text-xs leading-5 text-rose-200">
          <TriangleAlert size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
          {error} El importe original sigue siendo {originalAmount}.
        </p>
      )}

      {conversion && convertedAmount && (
        <div className="space-y-2.5 rounded-lg border border-blue-400/15 bg-blue-400/[0.045] p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <ArrowRightLeft size={13} aria-hidden="true" className="text-blue-300" />
              Importe convertido
            </span>
            <p className="text-xl font-semibold tracking-tight text-white tabular-nums">
              {convertedAmount}
            </p>
          </div>

          {currency !== "EUR" && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-slate-700/70 pt-2 text-[11px] text-slate-400">
                <span>Tipo de cambio: {conversion.exchangeRate}</span>
                {conversion.ratesUpdatedAt && (
                  <span>
                    Tasas obtenidas:{" "}
                    {new Date(conversion.ratesUpdatedAt).toLocaleString("es-ES")}
                  </span>
                )}
              </div>

              {conversion.isStale && (
                <p role="status" className="flex items-start gap-2 rounded-lg border border-amber-300/20 bg-amber-300/[0.07] px-3 py-2 text-xs leading-5 text-amber-200">
                  <TriangleAlert size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
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
