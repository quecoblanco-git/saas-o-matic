# 05 — Calidad y verificación

## Propósito

Este documento reúne la estrategia de calidad y los resultados comprobados. Distingue las ejecuciones completas de las pruebas focalizadas; una prueba solo se declara superada si se ejecutó.

## Estrategia

- **Unitarias:** reglas de facturación, validación fiscal, precisión monetaria y conversión de divisas.
- **Integración:** rutas HTTP, validación, persistencia, relaciones y eliminación de clientes y simulaciones.
- **Frontend:** gestión de clientes, estados de carga y error, vista previa, divisas, historial y acciones de eliminación.
- **Comprobaciones estáticas:** TypeScript, lint y builds de producción.
- Las pruebas de servicios externos usan respuestas simuladas y no dependen de la disponibilidad de Internet.

Verificación completa desde la raíz:

```bash
npm run verify
```

Para comprobaciones individuales, usar los scripts de cada paquete (`backend/` y `frontend/`).

## Verificación completa — 18/11/2026

| Comprobación                 | Resultado           | Alcance                                                                                                    |
| ---------------------------- | ------------------- | ---------------------------------------------------------------------------------------------------------- |
| Backend: pruebas             | Superada: 460/460   | Suite completa de Vitest; 18 archivos.                                                                     |
| Backend: TypeScript          | Superada            | `npm run typecheck`.                                                                                       |
| Backend: build               | Superada            | `npm run build`.                                                                                           |
| Frontend: pruebas            | Superada: 52/52     | Suite completa de Vitest; 5 archivos.                                                                      |
| Frontend: lint               | Superada con avisos | `npm run lint`; dos avisos `react(set-state-in-effect)` en `SimulationHistory.tsx` y `SimulationForm.tsx`. |
| Frontend: TypeScript y build | Superada            | `npm run build` ejecuta `tsc -b` y `vite build`.                                                           |

Se eliminó el import `act` sin uso de `frontend/src/features/customers/CustomerList.test.tsx`. La verificación del frontend ya no presenta el error `TS6133`.

## Situación registrada al 19/11/2026

- En esa fecha, `npm run setup` ya se había ejecutado desde un clon limpio.
- En esa fecha se completó la prueba manual de todos los flujos. En el intento posterior al rediseño, el navegador integrado se consiguió cargar `localhost:5173`.
- El 19/11/2026 se revisaron estáticamente las clases responsive, las etiquetas, los estados de foco y la semántica de los controles modificados.
- El lint terminó con código satisfactorio, aunque conserva los dos avisos indicados en la tabla de resultados.

Este bloque conserva el estado de la revisión del 19/11. Las comprobaciones manuales comunicadas después y el estado vigente se registran en la siguiente sección.

## Criterios de calidad cubiertos

La ejecución de `npm run verify` del 19/11/2026, realizada después del rediseño, comprobó las suites completas de backend y frontend, el tipado, el lint y los builds. Las pruebas existentes cubren reglas de facturación, validación fiscal, rutas principales, persistencia, conversiones de divisas y componentes de interfaz.

Se completó manualmente la revisión de todas las características de la aplicación y los flujos funcionan correctamente. También se realizó una instalación limpia desde un clon de GitHub, se ejecutó `npm run setup` y `npm run dev`, y se comprobó el arranque y el uso de la aplicación.

La revisión abarcó la gestión y validación de clientes, simulación y guardado de facturas, historial y paginación, conversión de divisas, así como confirmación, cancelación y resultado de la eliminación de clientes y simulaciones. También se revisaron los estados y la presentación general de la aplicación.

## Verificación completa actualizada — 19/11/2026

Después de implementar la eliminación de clientes y simulaciones se ejecutó de nuevo `npm run verify` desde la raíz:

| Comprobación                 | Resultado           | Alcance                                                                                                                  |
| ---------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Backend: pruebas             | Superada: 460/460   | Suite completa de Vitest; 18 archivos. Incluye pruebas de rutas e integración SQLite para los endpoints `DELETE`.        |
| Backend: TypeScript          | Superada            | `npm run typecheck`.                                                                                                     |
| Backend: build               | Superada            | `npm run build`.                                                                                                         |
| Frontend: pruebas            | Superada: 52/52     | Suite completa de Vitest; 7 archivos. Incluye cancelación, confirmación, actualización, paginación y errores de borrado. |
| Frontend: lint               | Superada con avisos | Dos avisos `react(set-state-in-effect)` en `SimulationForm.tsx` y `SimulationHistory.tsx`.                               |
| Frontend: TypeScript y build | Superada            | `npm run build`; `tsc -b` y `vite build`.                                                                                |

Las pruebas de integración confirmaron que borrar un cliente elimina sus simulaciones dentro de la transacción y no deja registros huérfanos; borrar una simulación conserva su cliente y las demás simulaciones. También se verificaron IDs inexistentes con HTTP 404 y respuestas exitosas HTTP 204 sin cuerpo.

La verificación automatizada se complementó con la revisión manual completa. Las capturas visuales del dashboard y la vista previa (`dashboard.png` y `billing-preview.png`) se consideran actualizadas y adecuadas para mostrar la versión revisada. Las capturas `backend-tests.png` y `frontend-tests.png` conservan la ejecución del 19/11/2026 (460 pruebas de backend y 52 de frontend); son evidencia de esa ejecución.

## Revisión documental — guías de instalación y uso (19/11/2026)

- Se contrastaron los pasos de instalación con `scripts/setup.mjs`, los puertos y el proxy con `scripts/dev.mjs` y la verificación opcional con `scripts/verify.mjs`. No se ejecutó de nuevo la instalación porque el script aplica migraciones a la base apuntada por `backend/.env`.
- Se revisaron las reglas y los ejemplos de identificadores, correo y nombre de empresa contra los esquemas y pruebas existentes. Las pruebas focalizadas de `tax-id`, `customer.schema` y facturación finalizaron correctamente: 3 archivos y 262 pruebas superadas.
- Los enlaces de archivos locales, las rutas de imágenes y los bloques Markdown de las guías se verificaron estáticamente. Se reutilizan las capturas existentes del dashboard y la vista previa; no hay capturas actuales de los errores de validación, el historial o los diálogos de eliminación.
- No se modificó código, configuración, scripts ni base de datos. La verificación completa `npm run verify` no se volvió a ejecutar en esta tarea documental.
