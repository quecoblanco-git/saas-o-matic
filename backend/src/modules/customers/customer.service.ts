// Implementa el registro y la búsqueda de clientes mediante Prisma.
import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateCustomerInput } from "./customer.schema.js";

export class DuplicateCustomerError extends Error {
  constructor() {
    super("A customer with this tax ID already exists in this country");
    this.name = "DuplicateCustomerError";
  }
}

export class CustomerNotFoundError extends Error {
  constructor() {
    super("Customer not found");
    this.name = "CustomerNotFoundError";
  }
}

export async function createCustomer(input: CreateCustomerInput) {
  try {
    return await prisma.customer.create({
      data: {
        companyName: input.companyName,
        taxId: input.taxId,
        email: input.email,
        country: input.country,
        plan: input.plan,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes("country") &&
      error.meta.target.includes("taxId")
    ) {
      throw new DuplicateCustomerError();
    }

    throw error;
  }
}

export async function deleteCustomer(customerId: string) {
  return prisma.$transaction(async (transaction) => {
    const customer = await transaction.customer.findUnique({
      where: { id: customerId },
      select: { id: true },
    });

    if (!customer) {
      throw new CustomerNotFoundError();
    }

    await transaction.simulation.deleteMany({
      where: { customerId },
    });

    await transaction.customer.delete({
      where: { id: customerId },
    });
  });
}

export async function listCustomers(
  search?: string,
  db: Pick<typeof prisma, "customer"> = prisma,
) {
  const normalizedSearch = search?.trim();

  if (!normalizedSearch) {
    return db.customer.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });
  }

  return db.customer.findMany({
    where: {
      OR: [
        {
          companyName: {
            contains: normalizedSearch,
          },
        },
        {
          taxId: {
            contains: normalizedSearch.toUpperCase(),
          },
        },
      ],
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}
