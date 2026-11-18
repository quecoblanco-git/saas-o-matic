// Inicia frontend y backend juntos y detiene ambos con una sola señal.
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const children = [];
let stopping = false;

function resolvePackageBin(packageDirectory, packageName, binName) {
  const packageRoot = resolve(projectRoot, packageDirectory, "node_modules", packageName);
  const packageJson = JSON.parse(
    readFileSync(resolve(packageRoot, "package.json"), "utf8"),
  );
  const bin = typeof packageJson.bin === "string"
    ? packageJson.bin
    : packageJson.bin?.[binName];

  if (!bin) {
    throw new Error(`No se encontró el ejecutable ${binName} de ${packageName}.`);
  }

  return resolve(packageRoot, bin);
}

function stopAll(exitCode = 0) {
  if (stopping) return;

  stopping = true;
  process.exitCode = exitCode;

  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill("SIGTERM");
    }
  }

  const forceStop = setTimeout(() => {
    for (const child of children) {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill("SIGKILL");
      }
    }
  }, 3000);
  forceStop.unref();
}

function startService(label, cwd, executable, args) {
  const child = spawn(process.execPath, [executable, ...args], {
    cwd,
    stdio: ["inherit", "pipe", "pipe"],
  });

  children.push(child);

  for (const streamName of ["stdout", "stderr"]) {
    let pending = "";
    child[streamName].on("data", (chunk) => {
      pending += chunk.toString();
      const lines = pending.split(/\r?\n/);
      pending = lines.pop() ?? "";

      for (const line of lines) {
        process[streamName].write(`[${label}] ${line}\n`);
      }
    });
    child[streamName].on("end", () => {
      if (pending) process[streamName].write(`[${label}] ${pending}\n`);
    });
  }

  child.on("error", (error) => {
    console.error(`[${label}] ${error.message}`);
    stopAll(1);
  });
  child.on("exit", (code) => {
    if (!stopping) {
      console.error(`[${label}] El proceso terminó${code === 0 ? "" : ` con código ${code ?? 1}`}.`);
      stopAll(code === 0 ? 0 : code ?? 1);
    }
  });
}

try {
  const backendDir = resolve(projectRoot, "backend");
  const frontendDir = resolve(projectRoot, "frontend");
  const backendEnv = resolve(backendDir, ".env");

  if (!existsSync(backendEnv)) {
    console.error("Falta backend/.env. Ejecuta primero `npm run setup`.");
    process.exit(1);
  }

  const tsx = resolvePackageBin("backend", "tsx", "tsx");
  const vite = resolvePackageBin("frontend", "vite", "vite");

  process.on("SIGINT", () => stopAll(0));
  process.on("SIGTERM", () => stopAll(0));

  console.log("Iniciando SaaS-O-Matic. Pulsa Ctrl+C para detener los dos servidores.");
  console.log("Frontend: http://localhost:5173  |  API: http://localhost:3001/health\n");

  startService("API", backendDir, tsx, ["watch", "src/server.ts"]);
  startService("Web", frontendDir, vite, []);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
