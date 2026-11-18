# Casos de desarrollo asistido por IA

Este documento resume dos casos representativos. La cronología y las verificaciones actuales se mantienen en [04-development-log.md](04-development-log.md) y [05-quality-review.md](05-quality-review.md); aquí no se duplican conteos de pruebas ni estados de implementación.

## Motor de facturación y vista previa

- **Periodo:** 16–17/11/2026
- **Herramientas:** ChatGPT (16/11) y Codex Desktop (17/11), según los registros de `02-ai-prompts.md` y `04-development-log.md`.

La IA apoyó el desglose de los requisitos, la identificación de límites de los tramos y la preparación de pruebas para cálculos e impuestos. La lógica de facturación se mantuvo en el backend y la vista previa reutiliza las reglas empleadas al guardar una simulación, sin persistir los cambios antes de la confirmación.

Las aclaraciones de Roams llevaron a descartar las cuotas de plan y los cargos por almacenamiento y llamadas a la API. La decisión vigente y su impacto se documentan en [DT-020](03-technical-decisions.md) y en la especificación funcional.

## Historial paginado

- **Periodo registrado:** 14–16/11/2026, según los commits `ab52fc6` y `f4db9c2`.
- **Herramienta:** El registro original no identifica la herramienta concreta para este caso.

La IA apoyó el análisis de la paginación por bloques, los cambios de cliente durante peticiones pendientes y la preparación de pruebas para respuestas asíncronas antiguas y duplicados.

La implementación reinicia la paginación al cambiar de cliente, ignora respuestas que ya no corresponden a la selección vigente y evita incorporar registros repetidos. El historial detallado de cambios y verificaciones se mantiene en el registro de desarrollo.

## Supervisión

Las propuestas asistidas por IA se revisaron antes de incorporarse. El desarrollador mantuvo la responsabilidad sobre las decisiones, los cambios aceptados y la interpretación de los resultados de verificación.
