// Ejecuta en secuencia las pruebas, los chequeos estáticos y los builds.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npmCli = process.env.npm_execpath;
const checks = [
  ["Backend: pruebas", "backend", ["test"]],
  ["Backend: TypeScript", "backend", ["run", "typecheck"]],
  ["Backend: build", "backend", ["run", "build"]],
  ["Frontend: pruebas", "frontend", ["test"]],
  ["Frontend: lint", "frontend", ["run", "lint"]],
  ["Frontend: TypeScript y build", "frontend", ["run", "build"]],
];

if (!npmCli) {
  console.error("Ejecuta este script mediante `npm run verify`.");
  process.exit(1);
}

for (const [label, packageDirectory, args] of checks) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(process.execPath, [npmCli, ...args], {
    cwd: resolve(projectRoot, packageDirectory),
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`No se pudo ejecutar npm: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`\nVerificación interrumpida: falló ${label}.`);
    process.exit(result.status ?? 1);
  }
}

console.log("\nVerificación completa superada.");
