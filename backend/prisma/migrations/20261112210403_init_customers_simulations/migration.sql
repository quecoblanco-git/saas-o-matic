-- Crear tabla
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyName" TEXT NOT NULL,
    "taxId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla
CREATE TABLE "Simulation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "storageGb" INTEGER NOT NULL,
    "apiCalls" INTEGER NOT NULL,
    "planSnapshot" TEXT NOT NULL,
    "countrySnapshot" TEXT NOT NULL,
    "taxRateSnapshot" TEXT NOT NULL,
    "usersCostCents" INTEGER NOT NULL,
    "planCostCents" INTEGER NOT NULL,
    "storageCostCents" INTEGER NOT NULL,
    "apiCostCents" INTEGER NOT NULL,
    "subtotalCents" INTEGER NOT NULL,
    "taxCents" INTEGER NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Simulation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Crear índice
CREATE UNIQUE INDEX "Customer_country_taxId_key" ON "Customer"("country", "taxId");
