// Muestra y filtra los clientes y permite abrir el historial de cada uno.
import { ArrowRight, Building2, LoaderCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { getCustomers } from "../../api/customers";
import type { Customer } from "../../types/customer";

interface CustomerListProps {
  refreshKey?: number;
  onViewHistory?: (customerId: string) => void;
}

export function CustomerList({
  refreshKey = 0,
  onViewHistory,
}: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadCustomers() {
      setLoading(true);
      setError(null);

      try {
        const result = await getCustomers(search);

        if (active) {
          setCustomers(result);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "No se pudieron cargar los clientes",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCustomers();

    return () => {
      active = false;
    };
  }, [refreshKey, search, retryKey]);

  return (
    <div className="space-y-4" aria-busy={loading}>
      <div>
        <label
          htmlFor="customerSearch"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Buscar clientes
        </label>

        <div className="relative">
          <Search
            size={17}
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            id="customerSearch"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por empresa o identificación fiscal…"
            className="min-h-11 w-full rounded-xl border border-slate-700/90 bg-slate-900/70 py-2.5 pl-10 pr-3.5 text-sm text-white transition placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-400/80 focus:bg-slate-900"
          />
        </div>
      </div>

      {loading ? (
        <p role="status" className="flex items-center gap-2 py-3 text-sm text-slate-400">
          <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
          Cargando clientes…
        </p>
      ) : error ? (
        <div className="space-y-3 rounded-xl border border-rose-400/20 bg-rose-400/5 p-4">
          <p role="alert" className="text-sm text-rose-200">
            Error al cargar clientes: {error}
          </p>

          <button
            type="button"
            onClick={() => setRetryKey((previous) => previous + 1)}
            className="min-h-10 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:border-slate-500 hover:bg-slate-700"
          >
            Reintentar
          </button>
        </div>
      ) : customers.length === 0 ? (
        <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/35 px-4 py-6 text-center">
          <Building2 size={22} aria-hidden="true" className="mb-2 text-slate-500" />
          <p className="text-sm font-medium text-slate-300">
            {search.trim()
              ? "No se encontraron clientes con esa búsqueda."
              : "Todavía no hay clientes registrados."}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {search.trim()
              ? "Prueba con otro nombre o identificador fiscal."
              : "Los clientes que registres aparecerán aquí."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {customers.map((customer) => (
            <article
              key={customer.id}
              className="flex min-w-0 flex-col gap-4 rounded-xl border border-slate-700/80 bg-slate-800/65 p-4 transition duration-200 hover:border-slate-600 hover:bg-slate-800 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-xl border border-blue-400/15 bg-blue-400/10 text-sm font-semibold text-blue-200"
                >
                  {customer.companyName.trim().charAt(0).toUpperCase() || "C"}
                </span>

                <div className="min-w-0 flex-1">
                  <h4 className="break-words text-sm font-semibold text-white sm:text-base">
                    {customer.companyName}
                  </h4>
                  <p className="mt-0.5 break-all text-xs text-slate-400 sm:text-sm">
                    {customer.email}
                  </p>

                  <div className="mt-2.5 flex min-w-0 flex-wrap items-center gap-2">
                    <span
                      aria-label={`País: ${customer.country}`}
                      className="rounded-md border border-slate-600/70 bg-slate-700/70 px-2 py-1 text-xs font-medium text-slate-200"
                    >
                      {customer.country}
                    </span>
                    <span className="rounded-md border border-blue-400/15 bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-200">
                      {customer.plan}
                    </span>
                    <span className="min-w-0 break-all text-xs text-slate-400">
                      ID fiscal <strong className="font-medium text-slate-300">{customer.taxId}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {onViewHistory && (
                <button
                  type="button"
                  onClick={() => onViewHistory(customer.id)}
                  className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-700/70 px-3.5 py-2 text-sm font-medium text-slate-100 transition hover:border-blue-400/50 hover:bg-blue-500/10 hover:text-blue-100 sm:min-w-36"
                >
                  Ver historial
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
