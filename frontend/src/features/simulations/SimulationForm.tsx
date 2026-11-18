// Gestiona los datos de simulación, la vista previa y su guardado explícito.
import {
  Activity,
  Database,
  Eye,
  Info,
  LoaderCircle,
  Save,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getCustomers } from "../../api/customers";
import { createSimulation, previewSimulation } from "../../api/simulations";
import type { SimulationPreview } from "../../api/simulations";
import type { Customer } from "../../types/customer";
import type { CreateSimulationInput, Simulation } from "../../types/simulation";
import { CurrencySelector } from "../currency/CurrencySelector";

const labelClassName = "mb-1.5 block text-sm font-medium text-slate-300";
const fieldClassName =
  "min-h-11 w-full rounded-xl border border-slate-700/90 bg-slate-900/70 px-3.5 py-2.5 text-sm text-white transition hover:border-slate-600 focus:border-blue-400/80 focus:bg-slate-900";

function formatEuros(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

interface SimulationFormProps {
  onSimulationCreated: (simulation: Simulation) => void;
  customerRefreshKey?: number;
}

export function SimulationForm({
  onSimulationCreated,
  customerRefreshKey = 0,
}: SimulationFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<SimulationPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerId: "",
    activeUsers: "10",
    storageGb: "",
    apiCalls: "",
  });

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
      } finally {
        if (active) {
          setLoadingCustomers(false);
        }
      }
    }

    void loadCustomers();

    return () => {
      active = false;
    };
  }, [customerRefreshKey]);

  useEffect(() => {
    // Limpiar la estimación anterior cuando cambien los datos.
    setPreview(null);
    setPreviewError(null);

    const activeUsers = Number(form.activeUsers);
    const storageGb = Number(form.storageGb);
    const apiCalls = Number(form.apiCalls);

    // No calcular hasta tener un formulario válido.
    if (
      !form.customerId ||
      form.activeUsers === "" ||
      form.storageGb === "" ||
      form.apiCalls === "" ||
      !Number.isInteger(activeUsers) ||
      activeUsers < 0 ||
      activeUsers > 100000 ||
      !Number.isInteger(storageGb) ||
      storageGb < 0 ||
      storageGb > 1000000 ||
      !Number.isInteger(apiCalls) ||
      apiCalls < 0 ||
      apiCalls > 100000000
    ) {
      setPreviewLoading(false);
      return;
    }

    let active = true;

    setPreviewLoading(true);

    const timeout = setTimeout(() => {
      void (async () => {
        try {
          const result = await previewSimulation({
            customerId: form.customerId,
            activeUsers,
            storageGb,
            apiCalls,
          });

          if (active) {
            setPreview(result);
          }
        } catch (error) {
          if (active) {
            setPreviewError(
              error instanceof Error
                ? error.message
                : "No se pudo calcular la vista previa",
            );
          }
        } finally {
          if (active) {
            setPreviewLoading(false);
          }
        }
      })();
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [form.customerId, form.activeUsers, form.storageGb, form.apiCalls]);

  const selectedCustomer = customers.find(
    (customer) => customer.id === form.customerId,
  );

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const input: CreateSimulationInput = {
        customerId: form.customerId,
        activeUsers: Number(form.activeUsers),
        storageGb: Number(form.storageGb),
        apiCalls: Number(form.apiCalls),
      };

      const simulation = await createSimulation(input);
      onSimulationCreated(simulation);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo crear la simulación",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="simulationCustomer" className={labelClassName}>
          Cliente
        </label>

        <select
          id="simulationCustomer"
          required
          value={form.customerId}
          onChange={(event) =>
            setForm({ ...form, customerId: event.target.value })
          }
          disabled={loadingCustomers}
          className={fieldClassName}
        >
          <option value="">Selecciona un cliente</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.companyName}
            </option>
          ))}
        </select>
      </div>

      {selectedCustomer && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-slate-700/70 bg-slate-900/45 px-3.5 py-2.5 text-xs text-slate-400">
          <span>
            Plan: <strong className="font-medium text-slate-200">{selectedCustomer.plan}</strong>
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>
            País: <strong className="font-medium text-slate-200">{selectedCustomer.country}</strong>
          </span>
          <span className="text-slate-500">El plan es informativo.</span>
        </div>
      )}

      <section className="rounded-xl border border-slate-700/80 bg-slate-900/45 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <label htmlFor="activeUsers" className="text-sm font-medium text-slate-200">
            Usuarios activos
          </label>
          <div className="flex items-center gap-2">
            <input
              id="activeUsers"
              type="number"
              min="0"
              max="100000"
              step="1"
              required
              value={form.activeUsers}
              onChange={(event) =>
                setForm({
                  ...form,
                  activeUsers: event.target.value,
                })
              }
              className="min-h-10 w-24 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-right text-sm font-semibold tabular-nums text-white focus:border-blue-400/80"
            />
            <span className="text-xs text-slate-500">usuarios</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="activeUsersSlider"
            className="mb-2 block text-xs text-slate-400"
          >
            Ajustar usuarios con el deslizador (0–500)
          </label>

          <input
            id="activeUsersSlider"
            type="range"
            min="0"
            max="500"
            step="1"
            value={Math.min(500, Math.max(0, Number(form.activeUsers) || 0))}
            onChange={(event) =>
              setForm({
                ...form,
                activeUsers: event.target.value,
              })
            }
            className="w-full cursor-pointer accent-blue-500"
          />

          <div className="mt-1 flex justify-between text-[11px] text-slate-500">
            <span>0 usuarios</span>
            <span>500 usuarios</span>
          </div>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="storageGb" className={labelClassName}>
            Almacenamiento (GB)
          </label>
          <div className="relative">
            <Database
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              id="storageGb"
              type="number"
              min="0"
              max="1000000"
              step="1"
              required
              value={form.storageGb}
              onChange={(event) =>
                setForm({
                  ...form,
                  storageGb: event.target.value,
                })
              }
              className={`${fieldClassName} pl-10`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="apiCalls" className={labelClassName}>
            Llamadas API
          </label>
          <div className="relative">
            <Activity
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              id="apiCalls"
              type="number"
              min="0"
              max="100000000"
              step="1"
              required
              value={form.apiCalls}
              onChange={(event) =>
                setForm({
                  ...form,
                  apiCalls: event.target.value,
                })
              }
              className={`${fieldClassName} pl-10`}
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-slate-700/70 bg-slate-900/40 px-3.5 py-3 text-xs leading-5 text-slate-400">
        <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-blue-300" />
        <p>
          El coste se calcula por usuarios activos. El plan, el almacenamiento y
          las llamadas API se guardan como datos informativos y no añaden cargos.
        </p>
      </div>

      <div
        className="rounded-2xl border border-blue-400/20 bg-slate-950/55 p-4 shadow-inner shadow-blue-950/10 sm:p-5"
        aria-live="polite"
        aria-busy={previewLoading}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-400/10 text-blue-200"
            >
              <Eye size={17} />
            </span>
            <div>
              <h4 className="text-sm font-semibold text-white sm:text-base">
                Vista previa
              </h4>
              <p className="mt-0.5 text-xs text-slate-400">
                Estimación calculada sin guardar
              </p>
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-blue-400/20 bg-blue-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-200">
            No guardada
          </span>
        </div>

        {previewLoading ? (
          <p role="status" className="flex items-center gap-2 py-4 text-sm text-slate-300">
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
            Calculando estimación…
          </p>
        ) : previewError ? (
          <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-200">
            {previewError}
          </p>
        ) : preview ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-blue-400/15 bg-gradient-to-br from-blue-500/10 to-slate-900/60 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Total mensual estimado
              </p>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-white tabular-nums sm:text-4xl">
                {formatEuros(preview.totalCents)}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {preview.activeUsers.toLocaleString("es-ES")} usuarios
                <span className="px-1.5 text-slate-600">·</span>
                Impuestos incluidos
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Desglose por tramos
              </p>
              {preview.tierBreakdown
                .filter((tier) => tier.userCount > 0)
                .map((tier) => (
                  <div
                    key={tier.tier}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="min-w-0 text-slate-400">
                      Tramo {tier.tier}: {tier.userCount} × {formatEuros(tier.unitPriceCents)}/usuario
                    </span>
                    <span className="shrink-0 font-medium tabular-nums text-slate-200">
                      {formatEuros(tier.totalCents)}
                    </span>
                  </div>
                ))}
            </div>

            <div className="space-y-2 border-t border-slate-700/80 pt-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Coste de usuarios</span>
                <span className="tabular-nums text-slate-200">{formatEuros(preview.usersCostCents)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Subtotal</span>
                <span className="tabular-nums text-slate-200">{formatEuros(preview.subtotalCents)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Impuestos ({Number(preview.taxRate) * 100} %)</span>
                <span className="tabular-nums text-slate-200">{formatEuros(preview.taxCents)}</span>
              </div>
            </div>

            <p className="border-t border-slate-700/80 pt-3 text-xs leading-5 text-slate-400">
              Esta estimación no crea un registro. La simulación solo se guardará
              cuando pulses «Crear simulación».
            </p>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-700 px-3.5 py-4 text-sm leading-5 text-slate-400">
            Selecciona un cliente y completa los campos para consultar el coste.
          </p>
        )}
      </div>

      {preview && <CurrencySelector amountCents={preview.totalCents} />}

      {error && (
        <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-3.5 py-3 text-sm text-rose-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || loadingCustomers || customers.length === 0}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
            Guardando simulación…
          </>
        ) : (
          <>
            <Save size={17} aria-hidden="true" />
            Crear simulación
          </>
        )}
      </button>
    </form>
  );
}
