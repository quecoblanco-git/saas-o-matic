import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "./prisma.js";

describe("Prisma database connection", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("connects to SQLite and queries customers", async () => {
    const customers = await prisma.customer.findMany();

    expect(Array.isArray(customers)).toBe(true);
  });
  it("uses the dedicated SQLite test database", () => {
    expect(process.env.DATABASE_URL).toBe("file:./test.db");
  });
});
