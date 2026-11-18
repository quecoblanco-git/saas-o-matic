// Declara los países, planes y estructuras de datos de los clientes.
export type CustomerCountry = "ES" | "FR" | "DE";

export type CustomerPlan = "Starter" | "Professional" | "Enterprise";

export interface Customer {
  id: string;
  companyName: string;
  taxId: string;
  email: string;
  country: CustomerCountry;
  plan: CustomerPlan;
  createdAt: string;
}

export interface CreateCustomerInput {
  companyName: string;
  taxId: string;
  email: string;
  country: CustomerCountry;
  plan: CustomerPlan;
}
