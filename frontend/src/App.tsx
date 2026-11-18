// Compone el dashboard y coordina clientes, simulaciones e historial.
import { Calculator, History, LayoutDashboard, UsersRound } from "lucide-react";
import "./App.css";
import { useState } from "react";
import { CustomerList } from "./features/customers/CustomerList";
import { CustomerForm } from "./features/customers/CustomerForm";
import { SimulationForm } from "./features/simulations/SimulationForm";
import type { Simulation } from "./types/simulation";
import { SimulationResult } from "./features/simulations/SimulationResult";
import { SimulationHistory } from "./features/simulations/SimulationHistory";

function App() {
  const [customerRefreshKey, setCustomerRefreshKey] = useState(0);

  const [selectedHistoryCustomerId, setSelectedHistoryCustomerId] =
    useState<string>("");

  const [latestSimulation, setLatestSimulation] = useState<Simulation | null>(
    null,
  );

  const [simulationRefreshKey, setSimulationRefreshKey] = useState(0);

  function handleCustomerCreated() {
    setCustomerRefreshKey((current) => current + 1);
  }

  function handleViewCustomerHistory(customerId: string) {
    setSelectedHistoryCustomerId(customerId);

    document.getElementById("simulation-history")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleSimulationCreated(simulation: Simulation) {
    setLatestSimulation(simulation);
    setSimulationRefreshKey((current) => current + 1);
  }

  return (
    <div className="app-shell min-h-screen text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="brand-mark grid size-11 shrink-0 place-items-center rounded-xl text-white"
            >
              <LayoutDashboard size={21} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
                SaaS-O-Matic
              </h1>
              <p className="text-xs text-slate-400 sm:text-sm">
                Dynamic Billing &amp; Subscription Optimizer
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <section
          aria-labelledby="dashboard-title"
          className="dashboard-intro flex flex-col justify-between gap-5 rounded-2xl border border-blue-400/10 px-5 py-6 sm:px-8 sm:py-8 lg:flex-row lg:items-end"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-200">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-blue-400"
              />
              FACTURACIÓN SAAS
            </div>
            <h2
              id="dashboard-title"
              className="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              Panel de control
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Gestiona clientes, calcula costes mensuales y consulta las
              simulaciones guardadas.
            </p>
          </div>

          <p className="text-sm font-medium text-slate-300 lg:pb-1">
            Tarifas progresivas <span className="px-1 text-slate-600">·</span>
            EUR como moneda base
          </p>
        </section>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12 xl:gap-6">
          <section
            aria-labelledby="customers-title"
            className="dashboard-panel min-w-0 rounded-2xl border p-5 sm:p-6 xl:col-span-7"
          >
            <div className="mb-6 flex items-start gap-3">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-300"
              >
                <UsersRound size={19} />
              </span>
              <div>
                <h3
                  id="customers-title"
                  className="text-lg font-semibold text-white"
                >
                  Clientes
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Registra empresas y consulta sus datos e historial.
                </p>
              </div>
            </div>

            <div className="grid min-w-0 gap-7">
              <div className="min-w-0">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
                  Registrar cliente
                </h4>
                <CustomerForm onCustomerCreated={handleCustomerCreated} />
              </div>

              <div className="min-w-0 border-t border-slate-700/80 pt-6">
                <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
                  Clientes registrados
                </h4>
                <CustomerList
                  refreshKey={customerRefreshKey}
                  onViewHistory={handleViewCustomerHistory}
                />
              </div>
            </div>
          </section>

          <section
            aria-labelledby="simulations-title"
            className="dashboard-panel min-w-0 rounded-2xl border p-5 sm:p-6 xl:col-span-5"
          >
            <div className="mb-6 flex items-start gap-3">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-300"
              >
                <Calculator size={19} />
              </span>
              <div>
                <h3
                  id="simulations-title"
                  className="text-lg font-semibold text-white"
                >
                  Simulador de facturación
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Calcula el coste mensual antes de guardar.
                </p>
              </div>
            </div>
            <SimulationForm
              onSimulationCreated={handleSimulationCreated}
              customerRefreshKey={customerRefreshKey}
            />

            {latestSimulation && (
              <SimulationResult simulation={latestSimulation} />
            )}
          </section>

          <section
            id="simulation-history"
            aria-labelledby="history-title"
            className="dashboard-panel scroll-mt-6 min-w-0 rounded-2xl border p-5 sm:p-6 xl:col-span-12"
          >
            <div className="mb-6 flex items-start gap-3">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-300"
              >
                <History size={19} />
              </span>
              <div>
                <h3
                  id="history-title"
                  className="text-lg font-semibold text-white"
                >
                  Historial de simulaciones
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Consulta y compara los resultados guardados por cliente.
                </p>
              </div>
            </div>

            <SimulationHistory
              refreshKey={simulationRefreshKey}
              customerRefreshKey={customerRefreshKey}
              selectedCustomerId={selectedHistoryCustomerId}
            />
          </section>
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        SaaS-O-Matic <span className="px-1 text-slate-700">·</span> Roams
        Technical Challenge
      </footer>
    </div>
  );
}

export default App;
