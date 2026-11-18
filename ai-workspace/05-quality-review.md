# 05 — Calidad y verificación

## Propósito

Este documento reúne la estrategia de calidad y los resultados comprobados. Distingue las ejecuciones completas de las pruebas focalizadas; una prueba solo se declara superada si se ejecutó.

## Estrategia

- **Unitarias:** reglas de facturación, validación fiscal, precisión monetaria y conversión de divisas.
- **Integración:** rutas HTTP, validación, persistencia y relaciones entre clientes y simulaciones.
- **Frontend:** interacciones, estados de carga y error, vista previa, divisas e historial.
- **Comprobaciones estáticas:** TypeScript, lint y builds de producción.
- Las pruebas de servicios externos usan respuestas simuladas y no dependen de la disponibilidad de Internet.

Verificación completa desde la raíz:

```bash
npm run verify
```

Para comprobaciones individuales, usar los scripts de cada paquete (`backend/` y `frontend/`).

## Verificación completa — 18/11/2026

| Comprobación | Resultado | Alcance |
| ------------ | --------- | ------- |
| Backend: pruebas | Superada: 450/450 | Suite completa de Vitest; 18 archivos. |
| Backend: TypeScript | Superada | `npm run typecheck`. |
| Backend: build | Superada | `npm run build`. |
| Frontend: pruebas | Superada: 30/30 | Suite completa de Vitest; 5 archivos. |
| Frontend: lint | Superada con avisos | `npm run lint`; dos avisos `react(set-state-in-effect)` en `SimulationHistory.tsx` y `SimulationForm.tsx`. |
| Frontend: TypeScript y build | Superada | `npm run build` ejecuta `tsc -b` y `vite build`. |

Se eliminó el import `act` sin uso de `frontend/src/features/customers/CustomerList.test.tsx`. La verificación del frontend ya no presenta el error `TS6133`.

## Alcance no cubierto por esta verificación

- `npm run setup` no se ejecutó desde un clon limpio; se verificó la sintaxis del script y el comando `npm run dev`, pero no se reinstalaron las dependencias con `npm ci`.
- No se realizó una prueba manual completa de todos los flujos de usuario. En el intento posterior al rediseño, los servidores de desarrollo indicaron que habían iniciado, pero el navegador integrado no consiguió cargar `localhost:5174` y devolvió `ERR_CONNECTION_TIMED_OUT`.
- El 18/11/2026 se revisaron estáticamente las clases responsive, las etiquetas, los estados de foco y la semántica de los controles modificados. La revisión visual en varios tamaños no pudo completarse; la última comprobación responsive visual registrada es del 16/11/2026.
- El lint terminó con código satisfactorio, aunque conserva los dos avisos indicados en la tabla de resultados.

Las capturas de `docs/evidence/` son históricas y no representan la ejecución del 18/11/2026.

## Criterios de calidad cubiertos

La ejecución de `npm run verify` del 18/11/2026, realizada después del rediseño, comprobó las suites completas de backend y frontend, el tipado, el lint y los builds. Las pruebas existentes cubren reglas de facturación, validación fiscal, rutas principales, persistencia, conversiones de divisas y componentes de interfaz. La revisión estática de responsive y accesibilidad no sustituye a una inspección visual en navegador. La prueba manual integral y la instalación desde un clon limpio siguen pendientes.

## Comprobaciones manuales pendientes

Al realizar la revisión en un navegador, preferiblemente con una base de datos local desechable, comprobar:

- Dashboard a 320–375 px, 768 px y 1280 px o más: sin desbordamiento horizontal; tarjetas de clientes siempre en columna.
- Registro de cliente con datos de prueba, validación visible y búsqueda por empresa e identificador fiscal.
- Sincronización del campo y deslizador de usuarios; cambios de vista previa sin persistencia y guardado solo al confirmar.
- Acceso al historial desde una tarjeta, desplegable «Ver detalles» y botón «Mostrar más».
- Conversión entre EUR, USD y GBP, importe original, tasa y fecha; estados de carga, error y tasa desactualizada.
- Navegación por teclado, foco visible y apertura del desplegable con teclado.
