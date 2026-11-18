# 05 — Calidad y verificación

## Propósito

Este documento reúne la estrategia de calidad y los resultados comprobados. Distingue las ejecuciones completas de las pruebas focalizadas; una prueba solo se declara superada si se ejecutó.

## Estrategia

- **Unitarias:** reglas de facturación, validación fiscal, precisión monetaria y conversión de divisas.
- **Integración:** rutas HTTP, validación, persistencia y relaciones entre clientes y simulaciones.
- **Frontend:** interacciones, estados de carga y error, vista previa, divisas e historial.
- **Comprobaciones estáticas:** TypeScript, lint y builds de producción.
- Las pruebas de servicios externos usan respuestas simuladas y no dependen de la disponibilidad de Internet.

Comandos documentados:

```bash
# Desde backend/
npm test
npm run typecheck
npm run build

# Desde frontend/
npx vitest run
npm run lint
npm run build
```

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

## Pendiente de verificación

- Instalación limpia a partir de los archivos de bloqueo.
- Prueba manual de los flujos principales y revisión responsive actualizada.
- Evaluar y resolver los dos avisos de lint antes de establecer una política de lint sin avisos.

Las comprobaciones de esta sección se ejecutaron el 18/11/2026. Las capturas históricas de `docs/evidence/` no representan esta ejecución.

## Criterios de aceptación de calidad

Antes de la entrega final se comprobará que:

1. Las reglas de facturación y sus límites tienen pruebas automatizadas.
2. Los identificadores fiscales y las entradas inválidas se validan.
3. Los endpoints principales y la persistencia funcionan conjuntamente.
4. La interfaz completa los flujos principales y gestiona errores previsibles.
5. Las pruebas de divisas no dependen del servicio externo.
6. Los builds, pruebas y documentación reflejan los resultados realmente obtenidos.
