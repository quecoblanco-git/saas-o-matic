// Presenta el resultado guardado de una simulación y su conversión de divisa.
import { CheckCircle2, Database, Globe2, UsersRound, Activity } from "lucide-react";
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
      className="mt-6 overflow-hidden rounded-2xl border border-emerald-400/25 bg-slate-900/80 shadow-xl shadow-emerald-950/10"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 bg-emerald-400/[0.06] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
            <CheckCircle2 size={20} aria-hidden="true" />
          </span>
          <div>
            <h4 id="simulationResultTitle" className="font-semibold text-white">
              Simulación creada correctamente
            </h4>
            <p className="mt-0.5 text-xs text-slate-400">
              Registro guardado con los datos confirmados
            </p>
          </div>
        </div>
        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-200">
          Guardada
        </span>
      </div>

      <div className="space-y-5 p-5">
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-700/70 bg-slate-950/40 px-3 py-2.5 text-sm">
            <UsersRound size={16} aria-hidden="true" className="text-blue-300" />
            <span className="text-slate-400">Usuarios</span>
            <strong className="ml-auto tabular-nums text-slate-100">{simulation.activeUsers.toLocaleString("es-ES")}</strong>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-700/70 bg-slate-950/40 px-3 py-2.5 text-sm">
            <Database size={16} aria-hidden="true" className="text-blue-300" />
            <span className="text-slate-400">Almacenamiento</span>
            <strong className="ml-auto tabular-nums text-slate-100">{simulation.storageGb} GB</strong>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-700/70 bg-slate-950/40 px-3 py-2.5 text-sm">
            <Activity size={16} aria-hidden="true" className="text-blue-300" />
            <span className="text-slate-400">Llamadas API</span>
            <strong className="ml-auto tabular-nums text-slate-100">{simulation.apiCalls.toLocaleString("es-ES")}</strong>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-700/70 bg-slate-950/40 px-3 py-2.5 text-sm">
            <Globe2 size={16} aria-hidden="true" className="text-blue-300" />
            <span className="text-slate-400">Ubicación</span>
            <strong className="ml-auto text-right text-slate-100">{simulation.countrySnapshot}</strong>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-700/70 bg-slate-950/40 px-3.5 py-3 text-sm">
          <span className="text-slate-400">Plan registrado</span>
          <span className="font-medium text-slate-100">{simulation.planSnapshot}</span>
        </div>

        <div className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-4">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="text-sm text-slate-400">Coste de usuarios</span>
            <span className="font-medium tabular-nums text-slate-200">{formatEuros(simulation.usersCostCents)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-slate-700/70 pt-2.5 text-sm">
            <span className="text-slate-400">Subtotal</span>
            <span className="tabular-nums text-slate-200">{formatEuros(simulation.subtotalCents)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-4 text-sm">
            <span className="text-slate-400">Impuestos ({Number(simulation.taxRateSnapshot) * 100}%)</span>
            <span className="tabular-nums text-slate-200">{formatEuros(simulation.taxCents)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3 rounded-xl border border-emerald-400/20 bg-gradient-to-br from-emerald-400/10 to-slate-950/50 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total mensual</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-emerald-200 tabular-nums">
              {formatEuros(simulation.totalCents)}
            </p>
          </div>
          <span className="pb-1 text-xs text-slate-400">Impuestos incluidos</span>
        </div>
      </div>

      <p className="px-5 pb-2 text-xs leading-5 text-slate-400">
        El almacenamiento y las llamadas API son informativos y no generan
        cargos adicionales.
      </p>

      <div className="px-5 pb-5">
        <CurrencySelector amountCents={simulation.totalCents} />
      </div>
    </section>
  );
}
