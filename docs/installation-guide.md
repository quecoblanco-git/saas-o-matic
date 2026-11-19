# Guía de instalación y ejecución

Esta guía explica cómo descargar y ejecutar SaaS-O-Matic en Windows con PowerShell. No hace falta instalar Docker ni crear tablas manualmente.

## Requisitos

- Windows 10 u 11 y PowerShell.
- Git para clonar el repositorio. Si prefieres descargar el ZIP desde GitHub, puedes omitir Git.
- Node.js 24 LTS (recomendado). npm se instala junto con Node.js. Las versiones instaladas de Vitest admiten Node.js 22.12–22.x, 24.x o 26 y posteriores; Vite y Prisma también requieren versiones compatibles.
- Acceso a Internet durante la primera instalación para descargar las dependencias de npm. La conversión de divisas también consulta una API externa cuando se usa.

Descargas oficiales: [Node.js](https://nodejs.org/en/download/) y [Git para Windows](https://git-scm.com/install/win).

Comprueba que PowerShell encuentra las herramientas:

```powershell
node --version
npm --version
git --version
```

Si omitiste Git porque descargarás el ZIP, basta con que los dos primeros comandos respondan con sus versiones.

## Descargar el proyecto

Abre PowerShell y sitúate en la carpeta donde quieras guardar el proyecto. Después clona el repositorio y entra en él:

```powershell
git clone https://github.com/quecoblanco-git/saas-o-matic.git
Set-Location .\saas-o-matic
```

Si Git no está instalado, descarga el ZIP desde la página del repositorio de GitHub, extráelo y abre PowerShell en la carpeta `saas-o-matic` que contiene `package.json`.

## Preparar dependencias y bases de datos

Desde la raíz del proyecto ejecuta:

```powershell
npm run setup
```

El script realiza estas tareas:

1. Instala, usando `npm ci`, las dependencias bloqueadas del backend y del frontend.
2. Crea `backend/.env` a partir de `backend/.env.example` si todavía no existe. Si ya existe, lo conserva.
3. Genera el cliente de Prisma y aplica las migraciones a la base de desarrollo.
4. Prepara por separado el esquema de la base usada por las pruebas.

La configuración de ejemplo usa SQLite. La base de desarrollo se crea como `backend/dev.db`; la base de pruebas, como `backend/test.db`. Son archivos locales excluidos del repositorio. La ejecución normal utiliza `dev.db`; las pruebas del backend usan `test.db`. No necesitas configurar una base externa para empezar.

La preparación no elimina ni reinicia las bases. Si ya tienes `backend/.env`, revisa su `DATABASE_URL`: `npm run setup` aplica las migraciones a la base señalada por esa configuración y prepara también la base de pruebas indicada por el propio script.

## Iniciar la aplicación

Desde la raíz del proyecto ejecuta:

```powershell
npm run dev
```

El comando inicia el backend y el frontend en la misma terminal. Déjala abierta mientras uses la aplicación. Abre [http://localhost:5173](http://localhost:5173) en el navegador. El backend responde en [http://localhost:3001](http://localhost:3001) y su comprobación de salud está en [http://localhost:3001/health](http://localhost:3001/health).

Para detener ambos servidores, vuelve a la terminal y pulsa `Ctrl+C`.

## Primer inicio y conservación de datos

Una base nueva comienza sin clientes ni simulaciones. Los registros guardados anteriormente en otro equipo, otra copia del proyecto o una base SQLite distinta no se descargan desde GitHub. Los datos locales se conservan al cerrar y volver a iniciar la aplicación mientras se use el mismo archivo de base de desarrollo.

## Comprobación opcional

Para ejecutar las pruebas, las comprobaciones de TypeScript, el lint y los builds de ambos paquetes:

```powershell
npm run verify
```

Esta verificación no es necesaria para abrir la aplicación, pero resulta útil para comprobar el proyecto. El script termina cuando falla una de sus fases y muestra cuál fue.

## Solución de problemas

### `node`, `npm` o `git` no se reconoce

Instala Node.js (incluye npm) o Git para Windows, según corresponda. Cierra y vuelve a abrir PowerShell después de la instalación y repite el comando de versión.

### Falla `npm run setup` al descargar paquetes

Comprueba la conexión a Internet y vuelve a ejecutar `npm run setup`. El instalador usa `npm ci` y puede repetirse si la instalación anterior quedó incompleta. Si la salida señala un paquete concreto, conserva el error completo para diagnosticarlo.

### El puerto 3001 ya está ocupado

El backend usa el puerto 3001 por defecto. Detén el otro servidor desde la terminal en la que se inició y vuelve a ejecutar `npm run dev`. No cierres procesos que no hayas identificado.

### Vite abre el frontend en 5174 u otro puerto

Si 5173 está ocupado, Vite puede elegir otro puerto y lo mostrará en la terminal. Abre la dirección que indique Vite. El proxy del frontend sigue enviando `/api` a `localhost:3001`, por lo que el backend debe estar activo en ese puerto.

### Se ve la página, pero no cargan clientes o simulaciones

Comprueba que `npm run dev` continúa activo y que la terminal no muestra un error del backend. Abre [http://localhost:3001/health](http://localhost:3001/health); debe responder con `status: "ok"`. Revisa también que `backend/.env` apunte a la base de datos local esperada. Una base nueva estará vacía hasta registrar clientes.

### Error de Prisma o SQLite

Desde la raíz, vuelve a ejecutar `npm run setup` y revisa el primer mensaje de error. Comprueba que `backend/.env` existe y que `DATABASE_URL` tiene formato SQLite como `file:./dev.db`. No borres archivos de base de datos ni ejecutes comandos de reinicio como solución genérica, ya que podrías perder registros.

### Cerré la terminal sin querer

El cierre de la terminal detiene ambos servidores. Abre PowerShell, vuelve a la raíz del proyecto y ejecuta `npm run dev`.

---

Para aprender a registrar clientes y crear simulaciones, consulta la [guía de uso](user-guide.md).
