import type { Simulation } from "../../types/simulation";
import { CurrencySelector } from "../currency/CurrencySelector";

interface SimulationResultProps {
  simulation: Simulation;
}

function formatEuros(cents: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function SimulationResult({ simulation }: SimulationResultProps) {
  return (
    <section
      aria-labelledby="simulationResultTitle"
      className="mt-6 rounded-xl border border-emerald-800 bg-slate-800 p-5"
    >
      <h4
        id="simulationResultTitle"
        className="text-lg font-semibold text-emerald-400"
      >
        Simulación creada correctamente
      </h4>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Plan</span>
          <span>{simulation.planSnapshot}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-400">País</span>
          <span>{simulation.countrySnapshot}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Usuarios activos</span>
          <span>{simulation.activeUsers}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Almacenamiento</span>
          <span>{simulation.storageGb} GB</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-slate-400">Llamadas API</span>
          <span>{simulation.apiCalls}</span>
        </div>

        <div className="border-t border-slate-700 pt-4">
          <div className="flex justify-between gap-4">
            <span>Coste de usuarios</span>
            <span>{formatEuros(simulation.usersCostCents)}</span>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <span>Subtotal</span>
          <span>{formatEuros(simulation.subtotalCents)}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span>Impuestos ({Number(simulation.taxRateSnapshot) * 100}%)</span>
          <span>{formatEuros(simulation.taxCents)}</span>
        </div>

        <div className="flex justify-between gap-4 border-t border-slate-700 pt-4">
          <span className="text-lg font-bold">Total mensual</span>

          <span className="text-xl font-bold text-emerald-400">
            {formatEuros(simulation.totalCents)}
          </span>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        El almacenamiento y las llamadas API son informativos y no generan
        cargos adicionales.
      </p>

      <CurrencySelector amountCents={simulation.totalCents} />
    </section>
  );
}
