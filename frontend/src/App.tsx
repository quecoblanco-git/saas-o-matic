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
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-3xl font-bold tracking-tight">SaaS-O-Matic</h1>

          <p className="mt-2 text-sm text-slate-400">
            Dynamic Billing & Subscription Optimizer
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <section>
          <h2 className="text-2xl font-semibold">Panel de control</h2>

          <p className="mt-2 text-slate-400">
            Gestiona clientes, calcula facturas y consulta el historial de
            simulaciones.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-3">
          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold">Clientes</h3>

            <p className="mt-3 mb-5 text-sm text-slate-400">
              Registra empresas y consulta los clientes existentes.
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="mb-4 text-lg font-medium">
                  Registrar nuevo cliente
                </h4>

                <CustomerForm onCustomerCreated={handleCustomerCreated} />
              </div>

              <div className="border-t border-slate-700 pt-6">
                <h4 className="mb-4 text-lg font-medium">
                  Clientes registrados
                </h4>

                <CustomerList
                  refreshKey={customerRefreshKey}
                  onViewHistory={handleViewCustomerHistory}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h3 className="text-xl font-semibold">Simulaciones</h3>

            <p className="mt-3 mb-5 text-sm text-slate-400">
              Calcula la facturación mensual de los clientes.
            </p>

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
            className="scroll-mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <h3 className="text-xl font-semibold">Historial</h3>

            <p className="mt-3 mb-5 text-sm text-slate-400">
              Consulta las simulaciones guardadas de cada cliente.
            </p>

            <SimulationHistory
              refreshKey={simulationRefreshKey}
              customerRefreshKey={customerRefreshKey}
              selectedCustomerId={selectedHistoryCustomerId}
            />
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-500">
        SaaS-O-Matic · Roams Technical Challenge
      </footer>
    </div>
  );
}

export default App;
