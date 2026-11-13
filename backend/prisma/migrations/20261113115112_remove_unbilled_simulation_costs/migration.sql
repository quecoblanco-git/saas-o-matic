/*
  Warnings:

  - You are about to drop the column `apiCostCents` on the `Simulation` table. All the data in the column will be lost.
  - You are about to drop the column `planCostCents` on the `Simulation` table. All the data in the column will be lost.
  - You are about to drop the column `storageCostCents` on the `Simulation` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Simulation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerId" TEXT NOT NULL,
    "activeUsers" INTEGER NOT NULL,
    "storageGb" INTEGER NOT NULL,
    "apiCalls" INTEGER NOT NULL,
    "planSnapshot" TEXT NOT NULL,
    "countrySnapshot" TEXT NOT NULL,
    "taxRateSnapshot" TEXT NOT NULL,
    "usersCostCents" INTEGER NOT NULL,
    "subtotalCents" INTEGER NOT NULL,
    "taxCents" INTEGER NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Simulation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Simulation" ("activeUsers", "apiCalls", "countrySnapshot", "createdAt", "customerId", "id", "planSnapshot", "storageGb", "subtotalCents", "taxCents", "taxRateSnapshot", "totalCents", "usersCostCents") SELECT "activeUsers", "apiCalls", "countrySnapshot", "createdAt", "customerId", "id", "planSnapshot", "storageGb", "subtotalCents", "taxCents", "taxRateSnapshot", "totalCents", "usersCostCents" FROM "Simulation";
DROP TABLE "Simulation";
ALTER TABLE "new_Simulation" RENAME TO "Simulation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
