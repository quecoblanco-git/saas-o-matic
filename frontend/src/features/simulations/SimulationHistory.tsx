import { useEffect, useRef, useState } from "react";
import { getCustomers } from "../../api/customers";
import { getSimulations } from "../../api/simulations";
import type { Customer } from "../../types/customer";
import type { Simulation } from "../../types/simulation";
import { CurrencySelector } from "../currency/CurrencySelector";

interface SimulationHistoryProps {
  refreshKey?: number;
  customerRefreshKey?: number;
  selectedCustomerId?: string;
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
  selectedCustomerId = "",
}: SimulationHistoryProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null);
  const historyVersionRef = useRef(0);

  useEffect(() => {
    if (!selectedCustomerId) {
      return;
    }

    // Invalidar inmediatamente las peticiones anteriores.
    ++historyVersionRef.current;

    setCustomerId(selectedCustomerId);
    setSimulations([]);
    setVisibleCount(0);
    setHasMore(false);
    setLoadingMore(false);
    setLoadMoreError(null);
    setError(null);
  }, [selectedCustomerId]);

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

  // Recargar la primera página al cambiar de cliente o guardar una simulación.
  useEffect(() => {
    let active = true;

    // Cada nueva carga representa una versión distinta del historial.
    ++historyVersionRef.current;

    if (!customerId) {
      return;
    }

    async function loadSimulations() {
      setLoading(true);
      setError(null);
      setLoadMoreError(null);

      setSimulations([]);
      setVisibleCount(0);
      setHasMore(false);
      setLoadingMore(false);

      try {
        const result = await getSimulations(customerId, 0);

        if (active) {
          setSimulations(result);
          setVisibleCount(result.length);
          setHasMore(result.length === 10);
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

  async function handleLoadMore() {
    if (!customerId || loading || loadingMore || !hasMore) {
      return;
    }

    // Asociar la petición con la versión del historial que la inició.
    const requestVersion = historyVersionRef.current;

    setLoadingMore(true);
    setLoadMoreError(null);

    try {
      const nextPage = await getSimulations(customerId, visibleCount);

      // Ignorar respuestas de un cliente o historial anterior.
      if (requestVersion !== historyVersionRef.current) {
        return;
      }

      setSimulations((previous) => {
        const existingIds = new Set(
          previous.map((simulation) => simulation.id),
        );

        const newSimulations = nextPage.filter(
          (simulation) => !existingIds.has(simulation.id),
        );

        return [...previous, ...newSimulations];
      });

      setVisibleCount((previous) => previous + nextPage.length);
      setHasMore(nextPage.length === 10);
    } catch (error) {
      // No mostrar errores de peticiones que ya no corresponden
      // al historial seleccionado.
      if (requestVersion !== historyVersionRef.current) {
        return;
      }

      setLoadMoreError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar más simulaciones",
      );
    } finally {
      // No modificar el estado de carga de un historial nuevo.
      if (requestVersion === historyVersionRef.current) {
        setLoadingMore(false);
      }
    }
  }

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
            // Invalidar inmediatamente las peticiones del cliente anterior.
            ++historyVersionRef.current;

            setCustomerId(event.target.value);
            setSimulations([]);
            setVisibleCount(0);
            setHasMore(false);
            setLoadMoreError(null);
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

              <CurrencySelector amountCents={simulation.totalCents} />

              <p className="mt-2 text-xs text-slate-400">
                {simulation.planSnapshot} · {simulation.countrySnapshot}
              </p>

              <details className="mt-4 rounded-lg border border-slate-700 bg-slate-900/50">
                <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-slate-200 hover:text-white">
                  Ver detalles
                </summary>

                <div className="space-y-2 border-t border-slate-700 px-4 py-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Usuarios activos</span>
                    <span>
                      {simulation.activeUsers.toLocaleString("es-ES")}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Almacenamiento</span>
                    <span>
                      {simulation.storageGb.toLocaleString("es-ES")} GB
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Llamadas a la API</span>
                    <span>
                      {new Intl.NumberFormat("es-ES", {
                        useGrouping: "always",
                      }).format(simulation.apiCalls)}
                    </span>
                  </div>

                  <div className="border-t border-slate-700 pt-2">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-400">Coste de usuarios</span>
                      <span>{formatEuros(simulation.usersCostCents)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">Subtotal</span>
                    <span>{formatEuros(simulation.subtotalCents)}</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">
                      Impuestos ({simulation.taxRateSnapshot}%)
                    </span>
                    <span>{formatEuros(simulation.taxCents)}</span>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-slate-700 pt-2 font-semibold">
                    <span>Total mensual</span>
                    <span className="text-emerald-400">
                      {formatEuros(simulation.totalCents)}
                    </span>
                  </div>
                </div>
              </details>
            </article>
          ))}

          {loadMoreError && (
            <p role="alert" className="text-sm text-red-400">
              Error al cargar más simulaciones: {loadMoreError}
            </p>
          )}

          {hasMore && (
            <button
              type="button"
              onClick={() => void handleLoadMore()}
              disabled={loadingMore}
              className="w-full rounded-lg border border-slate-600 bg-slate-700 px-4 py-3 font-medium text-white hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingMore ? "Cargando más..." : "Mostrar más"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
