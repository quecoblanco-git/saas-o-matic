// Recoge y envía los datos necesarios para registrar un cliente.
import { CheckCircle2, LoaderCircle, UserRoundPlus } from "lucide-react";
import { useState } from "react";
import { ApiError } from "../../api/client";
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
type CustomerField = keyof CreateCustomerInput;
type FieldErrors = Partial<Record<CustomerField, string>>;

function getFieldErrorMessage(field: CustomerField, country: string): string {
  switch (field) {
    case "taxId":
      if (country === "ES") {
        return "La identificación fiscal no es válida para España. Comprueba el formato y los caracteres de control.";
      }
      if (country === "FR") {
        return "La identificación fiscal no es válida para Francia. Comprueba que tenga 9 dígitos.";
      }
      return "La identificación fiscal no es válida para Alemania. Comprueba que tenga el formato DE seguido de 9 dígitos.";
    case "email":
      return "Introduce una dirección de correo electrónico válida.";
    case "companyName":
      return "Comprueba el nombre de la empresa.";
    case "country":
      return "Selecciona un país válido.";
    case "plan":
      return "Selecciona un plan válido.";
  }
}

function isCustomerField(value: string | number | undefined): value is CustomerField {
  return (
    value === "taxId" ||
    value === "email" ||
    value === "companyName" ||
    value === "country" ||
    value === "plan"
  );
}

export function CustomerForm({ onCustomerCreated }: CustomerFormProps) {
  const [form, setForm] = useState<CreateCustomerInput>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);

  function updateField<K extends CustomerField>(
    field: K,
    value: CreateCustomerInput[K],
  ) {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFieldErrors((previous) => {
      const next = { ...previous };
      delete next[field];
      if (field === "country") {
        delete next.taxId;
      }
      return next;
    });
    setError(null);
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    try {
      const customer = await createCustomer(form);

      onCustomerCreated(customer);
      setForm({ ...initialForm });
      setSuccess(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError(
          "Ya existe un cliente con esa identificación fiscal en el país seleccionado.",
        );
      } else if (error instanceof ApiError && error.status === 400) {
        const nextFieldErrors: FieldErrors = {};
        for (const detail of error.details) {
          const field = detail.path[0];
          if (isCustomerField(field)) {
            nextFieldErrors[field] = getFieldErrorMessage(field, form.country);
          }
        }
        setFieldErrors(nextFieldErrors);
        setError(
          Object.keys(nextFieldErrors).length > 0
            ? "Revisa los campos indicados."
            : "No se pudieron validar los datos del cliente. Comprueba la información e inténtalo de nuevo.",
        );
      } else if (error instanceof TypeError) {
        setError(
          "No se pudo conectar con el servidor. Comprueba que la aplicación esté en marcha e inténtalo de nuevo.",
        );
      } else {
        setError(
          "No se pudo registrar el cliente. Inténtalo de nuevo más tarde.",
        );
      }
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
          onChange={(event) => updateField("companyName", event.target.value)}
          aria-invalid={Boolean(fieldErrors.companyName)}
          aria-describedby={fieldErrors.companyName ? "companyName-error" : undefined}
          placeholder="Ej. Tecnología Palencia SL"
          className={fieldClassName}
        />
        {fieldErrors.companyName && (
          <p id="companyName-error" className="mt-1.5 text-sm text-rose-200">
            {fieldErrors.companyName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="taxId" className={labelClassName}>
          Identificación fiscal
        </label>
        <input
          id="taxId"
          required
          value={form.taxId}
          onChange={(event) => updateField("taxId", event.target.value)}
          aria-invalid={Boolean(fieldErrors.taxId)}
          aria-describedby={fieldErrors.taxId ? "taxId-error" : undefined}
          placeholder="NIF, SIREN o USt-IdNr."
          className={fieldClassName}
        />
        {fieldErrors.taxId && (
          <p id="taxId-error" className="mt-1.5 text-sm text-rose-200">
            {fieldErrors.taxId}
          </p>
        )}
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
          onChange={(event) => updateField("email", event.target.value)}
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          placeholder="nombre@empresa.com"
          className={fieldClassName}
        />
        {fieldErrors.email && (
          <p id="email-error" className="mt-1.5 text-sm text-rose-200">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="country" className={labelClassName}>
          País
        </label>
        <select
          id="country"
          value={form.country}
          onChange={(event) =>
            updateField("country", event.target.value as CreateCustomerInput["country"])
          }
          aria-invalid={Boolean(fieldErrors.country)}
          aria-describedby={fieldErrors.country ? "country-error" : undefined}
          className={fieldClassName}
        >
          <option value="ES">España</option>
          <option value="FR">Francia</option>
          <option value="DE">Alemania</option>
        </select>
        {fieldErrors.country && (
          <p id="country-error" className="mt-1.5 text-sm text-rose-200">
            {fieldErrors.country}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="plan" className={labelClassName}>
          Plan
        </label>
        <select
          id="plan"
          value={form.plan}
          onChange={(event) =>
            updateField("plan", event.target.value as CreateCustomerInput["plan"])
          }
          aria-invalid={Boolean(fieldErrors.plan)}
          aria-describedby={fieldErrors.plan ? "plan-error" : undefined}
          className={fieldClassName}
        >
          <option value="Starter">Starter</option>
          <option value="Professional">Professional</option>
          <option value="Enterprise">Enterprise</option>
        </select>
        {fieldErrors.plan && (
          <p id="plan-error" className="mt-1.5 text-sm text-rose-200">
            {fieldErrors.plan}
          </p>
        )}
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
