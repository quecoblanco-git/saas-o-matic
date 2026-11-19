# SaaS-O-Matic

_Dynamic Billing & Subscription Optimizer_

Aplicación full-stack para gestionar clientes empresariales y simular su facturación mensual. Se desarrolló como prueba técnica para el proceso Full-Stack AI-Augmented de Roams.

## Funcionalidad

- Registro, búsqueda y consulta de clientes.
- Eliminación confirmada de clientes y de todas sus simulaciones asociadas.
- Simulaciones con precios progresivos por usuarios: 10 € para los primeros 10, 8 € del 11 al 50 y 5 € a partir del 51.
- Impuestos simplificados según país. Los planes, el almacenamiento y las llamadas a la API son informativos y no añaden costes.
- Vista previa de facturación que no guarda datos hasta confirmar la simulación.
- Historial paginado por cliente y visualización de importes en las divisas disponibles.
- Eliminación individual confirmada de simulaciones desde el historial.

## Tecnologías

- **Frontend:** React, TypeScript, Vite y Tailwind CSS.
- **Backend:** Node.js, Express, TypeScript, Zod y Prisma.
- **Persistencia:** SQLite.
- **Calidad:** Vitest, React Testing Library y Supertest.

## Requisitos

Node.js, npm y Git. La primera preparación necesita acceso al registro de paquetes de npm.

## Instalación y ejecución local

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/quecoblanco-git/saas-o-matic.git
cd saas-o-matic
```

Prepara dependencias y base de datos, y después inicia el backend y el frontend:

```bash
npm run setup
npm run dev
```

El comando de preparación instala las dependencias según los archivos de bloqueo, crea `backend/.env` a partir de `backend/.env.example` si aún no existe y prepara Prisma y SQLite. No reemplaza un `.env` existente. El comando de desarrollo inicia ambos servidores en una terminal; pulsa `Ctrl+C` para detenerlos.

Abre `http://localhost:5173`. La API está disponible en `http://localhost:3001` y su comprobación de salud en `http://localhost:3001/health`. Vite reenvía las solicitudes `/api` a la API local.

## Comprobaciones

Ejecuta la verificación completa desde la raíz:

```bash
npm run verify
```

Este comando ejecuta las pruebas, el chequeo de tipos, el lint y los builds de backend y frontend. Para ejecutar una comprobación individual, consulta los scripts de `backend/package.json` y `frontend/package.json`.

## Documentación

- [Guía de instalación y ejecución](docs/installation-guide.md)
- [Guía de uso de SaaS-O-Matic](docs/user-guide.md)
- [Requisitos funcionales y técnicos](docs/requirements.md)
- [Arquitectura y modelo de datos](docs/architecture.md)
- [Planificación y decisiones del desarrollo asistido por IA](ai-workspace/README.md)

El repositorio está preparado para desarrollo y evaluación local. No incluye configuración de despliegue en producción.
