import { useEffect, useState } from "react";
import { getCustomers } from "../../api/customers";
import { createSimulation, previewSimulation } from "../../api/simulations";
import type { SimulationPreview } from "../../api/simulations";
import type { Customer } from "../../types/customer";
import type { CreateSimulationInput, Simulation } from "../../types/simulation";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="simulationCustomer" className="mb-1 block text-sm">
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

      <div className="space-y-3">
        <label htmlFor="activeUsers" className="block text-sm">
          Usuarios activos
        </label>

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
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />

        <div>
          <label
            htmlFor="activeUsersSlider"
            className="mb-2 block text-sm text-slate-400"
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

          <div className="flex justify-between text-xs text-slate-400">
            <span>0 usuarios</span>
            <span>500 usuarios</span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="storageGb" className="mb-1 block text-sm">
          Almacenamiento (GB)
        </label>

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
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div>
        <label htmlFor="apiCalls" className="mb-1 block text-sm">
          Llamadas API
        </label>

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
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <p className="text-xs text-slate-400">
        El coste depende de los usuarios activos. El almacenamiento y las
        llamadas API son informativos y no generan cargos.
      </p>

      <div
        className="space-y-3 rounded-lg border border-slate-700 bg-slate-800/50 p-4"
        aria-live="polite"
      >
        <h3 className="text-lg font-semibold">
          Vista previa del coste mensual
        </h3>

        {previewLoading ? (
          <p className="text-sm text-slate-400">Calculando estimación...</p>
        ) : previewError ? (
          <p role="alert" className="text-sm text-red-400">
            {previewError}
          </p>
        ) : preview ? (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Coste de usuarios</span>
              <span>
                {(preview.usersCostCents / 100).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {(preview.subtotalCents / 100).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Impuestos ({Number(preview.taxRate) * 100} %)</span>
              <span>
                {(preview.taxCents / 100).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-600 pt-3 text-lg font-bold">
              <span>Total mensual</span>
              <span>
                {(preview.totalCents / 100).toLocaleString("es-ES", {
                  style: "currency",
                  currency: "EUR",
                })}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Estimación orientativa. No se guardará hasta pulsar «Crear
              simulación».
            </p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">
            Selecciona un cliente y completa los campos para consultar el coste.
          </p>
        )}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || loadingCustomers || customers.length === 0}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {submitting ? "Calculando..." : "Crear simulación"}
      </button>
    </form>
  );
}
