import { useEffect, useState } from "react";
import { getCustomers } from "../../api/customers";
import type { Customer } from "../../types/customer";

interface CustomerListProps {
  refreshKey?: number;
}

export function CustomerList({ refreshKey = 0 }: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [refreshKey, search]);

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
        <p role="alert" className="text-sm text-red-400">
          Error al cargar clientes: {error}
        </p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-slate-400">
          {search.trim()
            ? "No se encontraron clientes con esa búsqueda."
            : "Todavía no hay clientes registrados."}
        </p>
      ) : (
        <div className="space-y-3">
          {customers.map((customer) => (
            <article
              key={customer.id}
              className="rounded-lg border border-slate-700 bg-slate-800 p-4"
            >
              <h4 className="font-semibold text-white">
                {customer.companyName}
              </h4>

              <p className="mt-1 text-sm text-slate-400">{customer.email}</p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded bg-slate-700 px-2 py-1">
                  {customer.country}
                </span>

                <span className="rounded bg-slate-700 px-2 py-1">
                  {customer.plan}
                </span>

                <span className="rounded bg-slate-700 px-2 py-1">
                  {customer.taxId}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
