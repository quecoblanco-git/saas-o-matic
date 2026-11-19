// Carga y pagina el historial del cliente seleccionado y muestra sus importes.
import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronDown, Clock3, LoaderCircle, Trash2 } from "lucide-react";
import { getCustomers } from "../../api/customers";
import { deleteSimulation, getSimulations } from "../../api/simulations";
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
  const [deletingSimulationId, setDeletingSimulationId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const historyVersionRef = useRef(0);

  useEffect(() => {
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
          setCustomerId((current) => {
            if (current && !result.some((customer) => customer.id === current)) {
              return "";
            }
            return current;
          });
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

  async function handleDeleteSimulation(simulation: Simulation) {
    const createdAt = new Date(simulation.createdAt).toLocaleString("es-ES");
    const confirmed = window.confirm(
      `¿Eliminar la simulación del ${createdAt} (${simulation.activeUsers} usuarios)? Esta acción no se puede deshacer.`,
    );

    if (!confirmed || deletingSimulationId) return;

    setDeletingSimulationId(simulation.id);
    setDeleteError(null);
    try {
      await deleteSimulation(simulation.id);
      const remaining = simulations.filter((item) => item.id !== simulation.id);
      setSimulations(remaining);
      setVisibleCount(remaining.length);
      if (remaining.length === 0) setHasMore(false);
    } catch {
      setDeleteError("No se pudo eliminar la simulación. Sigue disponible en el historial; inténtalo de nuevo.");
    } finally {
      setDeletingSimulationId(null);
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
          className="min-h-11 w-full rounded-xl border border-slate-700/90 bg-slate-900/70 px-3.5 py-2.5 text-sm text-white transition hover:border-slate-600 focus:border-blue-400/80 focus:bg-slate-900"
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
        <p className="rounded-xl border border-dashed border-slate-700 px-4 py-5 text-sm leading-5 text-slate-400">
          Selecciona un cliente para consultar su historial.
        </p>
      ) : loading ? (
        <p role="status" className="flex items-center gap-2 rounded-xl border border-slate-700/70 bg-slate-900/40 px-4 py-4 text-sm text-slate-300">
          <LoaderCircle size={16} aria-hidden="true" className="animate-spin text-blue-300" />
          Cargando simulaciones...
        </p>
      ) : error ? (
        <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
          Error al cargar el historial: {error}
        </p>
      ) : simulations.length === 0 ? (
        <div className="space-y-3">
          {deleteError && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{deleteError}</p>}
          <p className="rounded-xl border border-dashed border-slate-700 px-4 py-5 text-sm leading-5 text-slate-400">
            Este cliente todavía no tiene simulaciones.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {deleteError && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">{deleteError}</p>}
          {simulations.map((simulation) => (
            <article
              key={simulation.id}
              className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/80 shadow-sm shadow-slate-950/20"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/70 px-4 py-3">
                <p className="flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays size={14} aria-hidden="true" className="text-slate-500" />
                  {new Date(simulation.createdAt).toLocaleString("es-ES")}
                </p>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-slate-700 bg-slate-900/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-300">
                    Guardada
                  </span>
                  <button
                    type="button"
                    aria-label={`Eliminar simulación del ${new Date(simulation.createdAt).toLocaleString("es-ES")}`}
                    onClick={() => void handleDeleteSimulation(simulation)}
                    disabled={deletingSimulationId !== null}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-200 transition hover:border-rose-300/60 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deletingSimulationId === simulation.id ? <LoaderCircle size={14} aria-hidden="true" className="animate-spin" /> : <Trash2 size={14} aria-hidden="true" />}
                    <span className="sr-only sm:not-sr-only">Eliminar simulación</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Total mensual
                    </p>
                    <strong className="mt-1 block text-2xl font-semibold tracking-tight text-emerald-200 tabular-nums">
                      {formatEuros(simulation.totalCents)}
                    </strong>
                  </div>
                  <div className="flex items-center gap-1.5 pb-1 text-xs text-slate-400">
                    <Clock3 size={14} aria-hidden="true" className="text-blue-300" />
                    <span>{simulation.activeUsers.toLocaleString("es-ES")} usuarios</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Plan <span className="font-medium text-slate-200">{simulation.planSnapshot}</span>
                  <span className="px-2 text-slate-600" aria-hidden="true">·</span>
                  País <span className="font-medium text-slate-200">{simulation.countrySnapshot}</span>
                </p>

                <CurrencySelector amountCents={simulation.totalCents} />

                <details className="group rounded-xl border border-slate-700/80 bg-slate-900/40">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-200 outline-none transition hover:bg-slate-800/70 hover:text-white focus-visible:ring-2 focus-visible:ring-blue-400/80 [&::-webkit-details-marker]:hidden">
                  <span>Ver detalles</span>
                  <ChevronDown size={16} aria-hidden="true" className="text-slate-400 transition-transform group-open:rotate-180" />
                </summary>

                <div className="space-y-2.5 border-t border-slate-700/70 px-3.5 py-3 text-sm">
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

                  <div className="border-t border-slate-700/70 pt-2.5">
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
                      Impuestos ({Number(simulation.taxRateSnapshot) * 100}%)
                    </span>
                    <span>{formatEuros(simulation.taxCents)}</span>
                  </div>

                  <div className="flex justify-between gap-4 border-t border-slate-700/70 pt-2.5 font-semibold">
                    <span>Total mensual</span>
                    <span className="text-emerald-400">
                      {formatEuros(simulation.totalCents)}
                    </span>
                  </div>
                </div>
                </details>
              </div>
            </article>
          ))}

          {loadMoreError && (
            <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              Error al cargar más simulaciones: {loadMoreError}
            </p>
          )}

          {hasMore && (
            <button
              type="button"
              onClick={() => void handleLoadMore()}
              disabled={loadingMore}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-600/80 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingMore ? <><LoaderCircle size={16} aria-hidden="true" className="animate-spin" />Cargando más...</> : "Mostrar más"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
