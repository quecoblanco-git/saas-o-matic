// Configura las pruebas del backend para usar la base SQLite aislada.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: "file:./test.db",
    },
  },
});
