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
    <div className="space-y-4">
      <div>
        <label
          htmlFor="customerSearch"
          className="mb-2 block text-sm text-slate-300"
        >
          Buscar clientes
        </label>

        <input
          id="customerSearch"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre de empresa..."
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-500"
        />
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Cargando clientes...</p>
      ) : error ? (
        <div className="space-y-3">
          <p role="alert" className="text-sm text-red-400">
            Error al cargar clientes: {error}
          </p>

          <button
            type="button"
            onClick={() => setRetryKey((previous) => previous + 1)}
            className="rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600"
          >
            Reintentar
          </button>
        </div>
      ) : customers.length === 0 ? (
        <p className="text-sm text-slate-400">
          {search.trim()
            ? "No se encontraron clientes con esa búsqueda."
            : "Todavía no hay clientes registrados."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {customers.map((customer) => (
            <article
              key={customer.id}
              className="min-w-0 overflow-hidden rounded-lg border border-slate-700 bg-slate-800 p-4"
            >
              <h4 className="break-words font-semibold text-white">
                {customer.companyName}
              </h4>

              <p className="mt-1 break-all text-sm text-slate-400">
                {customer.email}
              </p>

              <div className="mt-3 flex min-w-0 flex-wrap gap-2 text-xs">
                <span className="max-w-full break-all rounded bg-slate-700 px-2 py-1">
                  {customer.country}
                </span>

                <span className="max-w-full break-all rounded bg-slate-700 px-2 py-1">
                  {customer.plan}
                </span>

                <span className="max-w-full break-all rounded bg-slate-700 px-2 py-1">
                  {customer.taxId}
                </span>
              </div>

              {onViewHistory && (
                <button
                  type="button"
                  onClick={() => onViewHistory(customer.id)}
                  className="mt-4 rounded-lg border border-blue-500 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                >
                  Ver historial
                </button>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
