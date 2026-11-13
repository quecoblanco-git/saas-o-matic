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
        <label htmlFor="companyName" className="mb-1 block text-sm">
          Nombre de la empresa
        </label>
        <input
          id="companyName"
          required
          value={form.companyName}
          onChange={(event) =>
            setForm({ ...form, companyName: event.target.value })
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div>
        <label htmlFor="taxId" className="mb-1 block text-sm">
          Identificación fiscal
        </label>
        <input
          id="taxId"
          required
          value={form.taxId}
          onChange={(event) => setForm({ ...form, taxId: event.target.value })}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        />
      </div>

      <div>
        <label htmlFor="country" className="mb-1 block text-sm">
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
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="ES">España</option>
          <option value="FR">Francia</option>
          <option value="DE">Alemania</option>
        </select>
      </div>

      <div>
        <label htmlFor="plan" className="mb-1 block text-sm">
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
          className="w-full rounded-lg border border-slate-700 bg-slate-800 p-3"
        >
          <option value="Starter">Starter</option>
          <option value="Professional">Professional</option>
          <option value="Enterprise">Enterprise</option>
        </select>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p role="status" className="text-sm text-green-400">
          Cliente registrado correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Registrando..." : "Registrar cliente"}
      </button>
    </form>
  );
}
