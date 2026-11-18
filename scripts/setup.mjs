// Instala dependencias y prepara las bases de datos de desarrollo y pruebas.
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npmCli = process.env.npm_execpath;

function runNpm(args, cwd, env = {}) {
  if (!npmCli) {
    console.error("Ejecuta este script mediante `npm run setup`.");
    process.exit(1);
  }

  const result = spawnSync(process.execPath, [npmCli, ...args], {
    cwd,
    env: { ...process.env, ...env },
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`No se pudo ejecutar npm: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const backendDir = resolve(projectRoot, "backend");
const frontendDir = resolve(projectRoot, "frontend");
const backendEnv = resolve(backendDir, ".env");
const backendEnvExample = resolve(backendDir, ".env.example");

console.log("[1/5] Instalando dependencias del backend…");
runNpm(["ci"], backendDir);

console.log("[2/5] Instalando dependencias del frontend…");
runNpm(["ci"], frontendDir);

if (!existsSync(backendEnv)) {
  copyFileSync(backendEnvExample, backendEnv);
  console.log("[3/5] Se creó backend/.env a partir de backend/.env.example.");
} else {
  console.log("[3/5] Se conserva la configuración existente en backend/.env.");
}

console.log("[4/5] Generando Prisma y aplicando las migraciones de desarrollo…");
runNpm(["run", "db:setup"], backendDir);

console.log("[5/5] Preparando el esquema de la base de datos de pruebas…");
runNpm(["run", "db:setup"], backendDir, { DATABASE_URL: "file:./test.db" });

console.log("\nPreparación completada. Ejecuta `npm run dev` para iniciar la aplicación.");
