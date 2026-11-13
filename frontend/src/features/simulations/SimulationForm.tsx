import { useEffect, useState } from "react";
import { getCustomers } from "../../api/customers";
import { createSimulation } from "../../api/simulations";
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

  const [form, setForm] = useState({
    customerId: "",
    activeUsers: "",
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

      <div>
        <label htmlFor="activeUsers" className="mb-1 block text-sm">
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
