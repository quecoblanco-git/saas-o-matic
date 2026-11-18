// Recoge y envía los datos necesarios para registrar un cliente.
import { CheckCircle2, LoaderCircle, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { createCustomer } from "../../api/customers";
import type { CreateCustomerInput, Customer } from "../../types/customer";

interface CustomerFormProps {
  onCustomerCreated: (customer: Customer) => void;
}

const initialForm: CreateCustomerInput = {
  companyName: "",
  taxId: "",
  email: "",
  country: "ES",
  plan: "Starter",
};

const labelClassName = "mb-1.5 block text-sm font-medium text-slate-300";
const fieldClassName =
  "min-h-11 w-full rounded-xl border border-slate-700/90 bg-slate-900/70 px-3.5 py-2.5 text-sm text-white transition placeholder:text-slate-500 hover:border-slate-600 focus:border-blue-400/80 focus:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60";

export function CustomerForm({ onCustomerCreated }: CustomerFormProps) {
  const [form, setForm] = useState<CreateCustomerInput>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const customer = await createCustomer(form);

      onCustomerCreated(customer);
      setForm({ ...initialForm });
      setSuccess(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo registrar el cliente",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="companyName" className={labelClassName}>
          Nombre de la empresa
        </label>
        <input
          id="companyName"
          autoComplete="organization"
          required
          value={form.companyName}
          onChange={(event) =>
            setForm({ ...form, companyName: event.target.value })
          }
          placeholder="Ej. Tecnología Palencia SL"
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="taxId" className={labelClassName}>
          Identificación fiscal
        </label>
        <input
          id="taxId"
          required
          value={form.taxId}
          onChange={(event) => setForm({ ...form, taxId: event.target.value })}
          placeholder="NIF, SIREN o USt-IdNr."
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClassName}>
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="nombre@empresa.com"
          className={fieldClassName}
        />
      </div>

      <div>
        <label htmlFor="country" className={labelClassName}>
          País
        </label>
        <select
          id="country"
          value={form.country}
          onChange={(event) =>
            setForm({
              ...form,
              country: event.target.value as CreateCustomerInput["country"],
            })
          }
          className={fieldClassName}
        >
          <option value="ES">España</option>
          <option value="FR">Francia</option>
          <option value="DE">Alemania</option>
        </select>
      </div>

      <div>
        <label htmlFor="plan" className={labelClassName}>
          Plan
        </label>
        <select
          id="plan"
          value={form.plan}
          onChange={(event) =>
            setForm({
              ...form,
              plan: event.target.value as CreateCustomerInput["plan"],
            })
          }
          className={fieldClassName}
        >
          <option value="Starter">Starter</option>
          <option value="Professional">Professional</option>
          <option value="Enterprise">Enterprise</option>
        </select>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3.5 py-3 text-sm text-rose-200"
        >
          {error}
        </p>
      )}

      {success && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3.5 py-3 text-sm text-emerald-200"
        >
          <CheckCircle2 size={17} aria-hidden="true" />
          <span>Cliente registrado correctamente.</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
            Registrando…
          </>
        ) : (
          <>
            <UserRoundPlus size={17} aria-hidden="true" />
            Registrar cliente
          </>
        )}
      </button>
    </form>
  );
}
