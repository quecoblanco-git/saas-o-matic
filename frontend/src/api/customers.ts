import { apiRequest } from "./client";
import type { Customer, CreateCustomerInput } from "../types/customer";

export async function getCustomers(search?: string): Promise<Customer[]> {
  const params = new URLSearchParams();

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  const query = params.toString();

  return apiRequest<Customer[]>(`/customers${query ? `?${query}` : ""}`);
}

export async function createCustomer(
  input: CreateCustomerInput,
): Promise<Customer> {
  return apiRequest<Customer>("/customers", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
