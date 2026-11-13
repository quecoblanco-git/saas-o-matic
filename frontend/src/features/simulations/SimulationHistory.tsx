import { useEffect, useState } from "react";
import { getCustomers } from "../../api/customers";
import { getSimulations } from "../../api/simulations";
import type { Customer } from "../../types/customer";
import type { Simulation } from "../../types/simulation";

interface SimulationHistoryProps {
  refreshKey?: number;
  customerRefreshKey?: number;
}

function formatEuros(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function SimulationHistory({
  refreshKey = 0,
  customerRefreshKey = 0,
}: SimulationHistoryProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCustomers() {
      try {
        const result = await getCustomers();

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
      }
    }

    void loadCustomers();

    return () => {
      active = false;
    };
  }, [customerRefreshKey]);

  useEffect(() => {
    let active = true;

    if (!customerId) {
      return;
    }

    async function loadSimulations() {
      setLoading(true);
      setError(null);

      try {
        const result = await getSimulations(customerId);

        if (active) {
          setSimulations(result);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "No se pudo cargar el historial",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSimulations();

    return () => {
      active = false;
    };
  }, [customerId, refreshKey]);

  return (
    <div className="space-y-5">
      <div>
        <label
          htmlFor="historyCustomer"
          className="mb-2 block text-sm text-slate-300"
        >
          Seleccionar cliente
        </label>

        <select
          id="historyCustomer"
          value={customerId}
          onChange={(event) => {
            setCustomerId(event.target.value);
            setSimulations([]);
            setError(null);
          }}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="">Selecciona un cliente</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.companyName}
            </option>
          ))}
        </select>
      </div>

      {!customerId ? (
        <p className="text-sm text-slate-400">
          Selecciona un cliente para consultar su historial.
        </p>
      ) : loading ? (
        <p className="text-sm text-slate-400">Cargando simulaciones...</p>
      ) : error ? (
        <p role="alert" className="text-sm text-red-400">
          Error al cargar el historial: {error}
        </p>
      ) : simulations.length === 0 ? (
        <p className="text-sm text-slate-400">
          Este cliente todavía no tiene simulaciones.
        </p>
      ) : (
        <div className="space-y-3">
          {simulations.map((simulation) => (
            <article
              key={simulation.id}
              className="rounded-lg border border-slate-700 bg-slate-800 p-4"
            >
              <p className="text-xs text-slate-400">
                {new Date(simulation.createdAt).toLocaleString("es-ES")}
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-300">
                  {simulation.activeUsers} usuarios
                </span>

                <strong className="text-lg text-emerald-400">
                  {formatEuros(simulation.totalCents)}
                </strong>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                {simulation.planSnapshot} · {simulation.countrySnapshot}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
