# SaaS-O-Matic

Dynamic Billing & Subscription Optimizer

## Vista general de la aplicación

La siguiente captura muestra el panel principal de SaaS-O-Matic,
incluyendo la gestión de clientes, la simulación de facturación
con vista previa en tiempo real y el historial de resultados.

![Panel principal de SaaS-O-Matic](docs/evidence/dashboard.png)

Aplicación full-stack desarrollada como prueba técnica para el proceso de selección Full-Stack AI-Augmented de Roams.

## Descripción

SaaS-O-Matic permite gestionar clientes empresariales, realizar simulaciones de facturación mensual y consultar el historial de simulaciones.

La aplicación incluye:

- Registro y consulta de clientes.
- Búsqueda de clientes por nombre de empresa.
- Simulación de facturación con tarifas por tramos de usuarios.
- Vista previa de costes en tiempo real.
- Aplicación de impuestos según el país del cliente.
- Historial de simulaciones con paginación.
- Visualización de importes en diferentes divisas.
- Interfaz responsive.

## Tecnologías

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Vitest
- React Testing Library

### Backend

- Node.js
- Express
- TypeScript
- Prisma
- SQLite
- Zod
- Vitest

## Documentación

Los requisitos funcionales y técnicos se encuentran en `docs/requirements.md`.

Las instrucciones de instalación, ejecución, pruebas y la documentación de arquitectura se completarán en las siguientes secciones.

## Instalación y ejecución

### Requisitos previos

- Node.js
- npm
- Git

### Configuración del backend

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/quecoblanco-git/saas-o-matic.git
   cd saas-o-matic
   ```

2. Instalar las dependencias:

   ```bash
   cd backend
   npm install
   ```

3. Crear un archivo `.env` dentro de `backend` con el siguiente contenido:

   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. Aplicar las migraciones de SQLite:

   ```bash
   npx prisma migrate deploy --config prisma7.config.ts
   ```

5. Generar el cliente de Prisma:

   ```bash
   npx prisma generate --config prisma7.config.ts
   ```

6. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

El backend se ejecuta en `http://localhost:3001`.

### Comandos adicionales del backend

Desde la carpeta `backend`:

```bash
npm run build
npm start
npm run typecheck
npm test
```

### Configuración del frontend

El frontend está desarrollado con React, TypeScript, Vite y Tailwind CSS.

Para ejecutarlo, abre una segunda terminal desde la raíz del proyecto.

1. Acceder a la carpeta del frontend:

   ```bash
   cd frontend
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

La aplicación estará disponible en:

http://localhost:5173

Para utilizar todas las funcionalidades, el backend debe estar ejecutándose simultáneamente en `http://localhost:3001`.

### Comandos adicionales del frontend

Desde la carpeta `frontend`:

```bash
# Compilar para producción
npm run build

# Visualizar la compilación de producción
npm run preview

# Ejecutar el análisis estático
npm run lint

# Ejecutar las pruebas automatizadas
npx vitest run
```

### Ejecución conjunta

Durante el desarrollo deben mantenerse abiertas dos terminales:

- **Terminal 1 — Backend:** ejecutar `npm run dev` desde `backend`.
- **Terminal 2 — Frontend:** ejecutar `npm run dev` desde `frontend`.

Después, abrir `http://localhost:5173` en el navegador.

## Comunicación entre frontend y backend

El frontend utiliza un cliente HTTP compartido situado en
`frontend/src/api/client.ts`.

Todas las peticiones a la API utilizan el prefijo `/api`.

Durante el desarrollo, Vite utiliza un proxy configurado en
`frontend/vite.config.ts` para redirigir las peticiones al
servidor Express.

Por ejemplo:

1. React solicita `GET /api/customers`.
2. El proxy de Vite elimina el prefijo `/api`.
3. La petición se envía a `http://localhost:3001/customers`.
4. Express procesa la solicitud y devuelve la respuesta.

Esta configuración permite ejecutar frontend y backend en
servidores independientes durante el desarrollo, evitando
configurar manualmente una URL absoluta para cada petición.

### Configuración para producción

El proxy de Vite se utiliza únicamente durante el desarrollo.

Para desplegar la aplicación en producción, será necesario
configurar un servidor o proxy inverso que sirva el frontend
compilado y redirija las solicitudes `/api` al backend Express.

El repositorio incluye la configuración de desarrollo local,
pero no una configuración de despliegue en producción.
