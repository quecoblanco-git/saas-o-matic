# 04 — Registro de desarrollo e iteraciones

## 1. Objetivo

Este documento registra la evolución real de SaaS-O-Matic durante su desarrollo.

Su finalidad es mostrar las tareas realizadas, las propuestas de la inteligencia artificial, las comprobaciones efectuadas y las modificaciones introducidas como resultado de la revisión humana.

El registro refleja los hitos comprobables del desarrollo y distingue los resultados históricos de la verificación vigente.

## 2. Metodología aplicada

Las iteraciones se realizaron, cuando correspondía, mediante este proceso:

1. Definir el objetivo y los criterios de aceptación.
2. Preparar las instrucciones para la IA.
3. Revisar la solución propuesta.
4. Aplicar los cambios necesarios.
5. Ejecutar las comprobaciones correspondientes.
6. Registrar los resultados, errores y decisiones.
7. Registrar el commit cuando se creó un avance verificable.

Las interacciones relevantes con IA se registran también en `02-ai-prompts.md`.

## 3. Estado inicial del proyecto — 12/11/2026

**Fase:** Preparación inicial del entorno
**Estado en esa fecha:** Preparación técnica completada; desarrollo funcional aún no iniciado.

### Trabajo realizado

- Creación del repositorio Git y su correspondiente repositorio en GitHub.
- Inicialización del frontend con React, Vite y TypeScript.
- Preparación del backend con Express y TypeScript.
- Configuración inicial de Prisma y SQLite.
- Instalación de herramientas de desarrollo y pruebas.
- Organización de las carpetas `frontend/`, `backend/`, `docs/` y `ai-workspace/`.
- Inicio de la documentación del proceso asistido por IA.

### Comprobaciones realizadas

| Comprobación                             | Resultado  |
| ---------------------------------------- | ---------- |
| Compilación inicial del frontend         | Correcta   |
| Validación del esquema inicial de Prisma | Correcta   |
| Creación del repositorio y primer commit | Correcta   |
| Implementación de la API REST            | Pendiente  |
| Modelos funcionales de la base de datos  | Pendiente  |
| Interfaz del dashboard                   | Pendiente  |
| Pruebas funcionales y de integración     | Pendientes |

Esta tabla es una fotografía histórica de la preparación inicial; no describe el estado actual. Las verificaciones vigentes se registran en `05-quality-review.md`.

### Evidencias

- [Estructura inicial del proyecto](evidence/01-project-structure.png)
- [Repositorio GitHub](evidence/02-github-repository.png)
- [Compilación inicial del frontend](evidence/03-frontend-build.png)
- [Validación del esquema Prisma](evidence/04-prisma-validation.png)

**Primer commit:** `1e95975`

### Observaciones

La compilación inicial del frontend y la validación del esquema Prisma verifican únicamente aspectos de la configuración del entorno.

No demuestran todavía que las funcionalidades solicitadas estén implementadas ni que la aplicación funcione de extremo a extremo.

---

## 4. Seguimiento de problemas

Los problemas significativos se documentan dentro de la iteración en la que aparecen.

Cuando un problema afecta a varias iteraciones, se mantiene una referencia a su estado hasta su resolución.

La revisión consideró especialmente:

- Errores en los cálculos de facturación.
- Validaciones fiscales incorrectas.
- Problemas de persistencia.
- Inconsistencias entre frontend y backend.
- Errores en la conversión de divisas.
- Problemas de seguridad y validación de entradas.
- Regresiones detectadas mediante pruebas.

## 5. Criterios para cerrar una iteración

Una iteración se considerará completada cuando:

- Se hayan implementado los requisitos definidos para esa tarea.
- Se haya revisado el código o la solución propuesta.
- Se hayan ejecutado las comprobaciones aplicables.
- Se hayan documentado los errores pendientes, si existen.
- El registro refleje el resultado real de la tarea.

La existencia de código generado no será suficiente, por sí sola, para considerar completada una funcionalidad.

## 6. Registro cronológico de iteraciones

Las entradas siguientes resumen los hitos principales en orden cronológico. Los resultados históricos se conservan tal como se registraron; la verificación vigente se detalla en la entrada del 18/11/2026 y en `05-quality-review.md`.

## 13/11/2026 — Adaptación a las aclaraciones oficiales de Roams

### Contexto

Se recibió una respuesta del equipo de Roams aclarando tres cuestiones del enunciado:

- La documentación puede redactarse en español.
- Los planes de suscripción son informativos y no modifican el precio.
- El almacenamiento y las llamadas a la API deben registrarse y mostrarse, pero no generan costes adicionales.

También se confirmó que las decisiones sobre aspectos no especificados deben justificarse y documentarse en `/ai-workspace`.

### Cambios realizados

**1. Actualización de requisitos y decisiones**

Se incorporaron las aclaraciones a `docs/requirements.md` y se documentó su impacto en `ai-workspace/03-technical-decisions.md`, conservando la trazabilidad de las decisiones originales.

**2. Modificación del motor de facturación**

Se actualizó `backend/src/modules/billing/billing.ts` para que el coste base mensual dependa exclusivamente de los tramos acumulativos de usuarios activos.

Los planes Starter, Professional y Enterprise mantienen su función informativa, sin cuota adicional. El almacenamiento y las llamadas a la API continúan sujetos a validación, pero no generan costes.

Se mantuvo la aplicación posterior de impuestos por país como decisión propia documentada del proyecto.

**3. Actualización de pruebas automatizadas**

Se adaptaron las pruebas anteriores y se añadió una prueba específica para las aclaraciones oficiales.

Se siguió un proceso de TDD:

- Se añadió una prueba con el nuevo resultado esperado.
- Se ejecutó y falló porque el motor todavía aplicaba las tarifas anteriores.
- Se modificó el código de facturación.
- Se actualizaron las pruebas afectadas.
- Se volvió a ejecutar la batería de pruebas hasta obtener resultados correctos.

**4. Simplificación del modelo de datos**

Se eliminaron del modelo `Simulation` los campos:

- `planCostCents`
- `storageCostCents`
- `apiCostCents`

Se conservaron los datos de consumo, los valores históricos y los importes necesarios para las simulaciones.

Se creó la migración `20261113115112_remove_unbilled_simulation_costs` y se aplicó correctamente a las bases de datos `dev.db` y `test.db`. Posteriormente, se regeneró el cliente de Prisma.

### Verificaciones realizadas

| Comprobación                  | Resultado              |
| ----------------------------- | ---------------------- |
| Pruebas de facturación        | 75/75 superadas        |
| Pruebas completas del backend | 287/287 superadas      |
| Archivos de pruebas           | 9                      |
| Comprobación TypeScript       | Sin errores            |
| Compilación del backend       | Correcta               |
| Migración en `dev.db`         | Aplicada correctamente |
| Migración en `test.db`        | Aplicada correctamente |

### Resultado y aprendizaje

El proyecto se ha adaptado a las aclaraciones oficiales sin necesidad de rehacer su arquitectura.

La separación entre el motor de facturación, las rutas HTTP y la persistencia ha permitido modificar las reglas de negocio de forma localizada.

Las pruebas automatizadas han servido para identificar la diferencia entre el comportamiento anterior y el esperado, y para verificar que los cambios no introducen regresiones.

Este proceso refleja la importancia de validar las hipótesis iniciales, incorporar nuevas indicaciones y mantener la documentación sincronizada con la implementación.

---

---

## 16/11/2026 — Vista previa de facturación y mejoras del dashboard

### Objetivo

Mejorar la experiencia de usuario de SaaS-O-Matic,
incorporando una vista previa de facturación en tiempo real,
facilitando la consulta de clientes y mejorando la navegación
entre las secciones del dashboard.

### Funcionalidades implementadas

**1. Vista previa de facturación**

- Incorporación de un control deslizante para usuarios activos.
- Sincronización con el campo numérico del formulario.
- Actualización automática de importes al modificar parámetros.
- Implementación del endpoint `POST /simulations/preview`.
- Reutilización de las reglas de facturación del backend.
- Cálculo sin guardar automáticamente simulaciones.

**2. Mejoras del listado de clientes**

- Presentación de clientes en una lista vertical.
- Corrección del desbordamiento de textos largos.
- Incorporación del botón "Reintentar" ante errores de carga.
- Incorporación del botón "Ver historial" en cada cliente.

**3. Navegación al historial**

- Selección automática del cliente desde su tarjeta.
- Desplazamiento hasta la sección de historial.
- Conservación de la selección manual y la paginación.

**4. Revisión responsive**

Se comprobó manualmente el comportamiento de la interfaz
en pantallas móviles y de tableta.

Se mantuvo la distribución actual del dashboard tras
verificar que resultaba funcional en los tamaños revisados.

### Validación

Se ejecutaron pruebas automatizadas de backend y frontend,
además de compilaciones y comprobaciones manuales.

Resultados registrados:

- Backend: 402 pruebas superadas en la última ejecución
  completa registrada.
- Frontend: 16 pruebas superadas en una ejecución completa,
  seguidas de pruebas específicas de los componentes
  modificados.
- CustomerList: 3 pruebas superadas.
- SimulationHistory: 6 pruebas superadas.
- Compilación del frontend: correcta.

Las pruebas específicas posteriores incorporaron nuevos
casos que todavía deben verificarse conjuntamente mediante
una nueva ejecución de toda la batería del frontend.

La verificación completa del 18/11, registrada más adelante,
actualizó este estado histórico.

### Commits relacionados

- `e4dd098` — feat: add real-time billing preview and active users slider
- `f4db9c2` — feat: improve customer list and history navigation

Ambos commits fueron enviados a la rama `main` de GitHub.

### Uso de IA

ChatGPT se utilizó para apoyar la implementación incremental,
la preparación de pruebas automatizadas, la revisión de errores
y el análisis de los requisitos funcionales.

Cada cambio se incorporó y verificó progresivamente mediante
el entorno de desarrollo, las pruebas y la revisión visual
de la aplicación.

## 17/11/2026 — Desglose de facturación y monedas dinámicas

**Herramienta de IA:** Codex Desktop.

### Objetivo

Mejorar el detalle de la vista previa de facturación y permitir seleccionar las divisas que devuelve el servicio de tasas.

### Cambios realizados

1. Se añadió el selector de divisa a la vista previa de simulaciones.
2. La respuesta de vista previa incorporó el desglose por tramos de usuarios.
3. La interfaz muestra los tramos con usuarios activos en EUR.
4. El backend expone las tasas válidas en `GET /currency/rates` y acepta códigos de moneda de tres letras para la conversión.
5. El selector carga las divisas desde la API, conserva nombres conocidos y muestra el código de otras monedas.
6. Se añadió cobertura para el fallo al cargar la lista; EUR permanece disponible y la interfaz informa del error.

### Validación

- Backend: 86 pruebas focalizadas de facturación y simulaciones; 49 pruebas focalizadas de divisas; TypeScript sin errores.
- Frontend: 17 pruebas focalizadas de `CurrencySelector` y `SimulationForm`; después, 9 pruebas de `CurrencySelector` tras añadir el caso de error de carga.
- `git diff --check` no informó errores de espacios en los cambios revisados.
- El chequeo TypeScript del frontend señaló `TS6133` por el import `act` sin uso en `frontend/src/features/customers/CustomerList.test.tsx:3`. No se modificó ese archivo en esta iteración.
- No se ejecutaron las baterías completas ni el build de producción del frontend durante esta iteración.

Estas limitaciones corresponden a la revisión del 17/11. El import sin uso se retiró y las baterías completas se ejecutaron el 18/11; véase la entrada de esa fecha.

### Resultado

Las monedas disponibles se obtienen del backend y el importe original permanece en EUR. Los resultados anteriores son pruebas focalizadas; no representan una nueva ejecución completa del proyecto.

## 18/11/2026 — Verificación completa y preparación de la entrega

**Herramienta de IA:** Codex Desktop.

### Cambios realizados

- Se eliminó el import `act` sin uso de `frontend/src/features/customers/CustomerList.test.tsx`.
- Se añadieron comandos desde la raíz para preparar dependencias y base de datos (`npm run setup`), iniciar ambos servidores (`npm run dev`) y ejecutar la verificación completa (`npm run verify`).
- Se añadió `backend/.env.example`; la preparación conserva cualquier archivo `backend/.env` existente.
- Se revisaron las instrucciones de instalación, arquitectura, calidad y uso de IA. Se incorporaron los dos prompts originales con la ruta local anonimizada.

### Verificación

- `npm run verify`: backend 450/450 pruebas y frontend 30/30; chequeos de tipos y builds superados.
- El lint del frontend finalizó correctamente con dos avisos `react(set-state-in-effect)` en `SimulationHistory.tsx` y `SimulationForm.tsx`.
- Prueba de arranque de `npm run dev`: `/health` respondió `ok` y el frontend devolvió HTTP 200.
- `git diff --check` no detectó errores.
- No se ejecutó `npm run setup` sobre un clon limpio; este comando instala dependencias con `npm ci`.

Los resultados completos se detallan en `05-quality-review.md`.

## 18/11/2026 — Rediseño progresivo de la interfaz principal

**Herramienta de IA:** Codex Desktop, siguiendo el prompt de rediseño facilitado para el proyecto.

### Objetivo

Mejorar la claridad visual y la consistencia del dashboard, conservando las funcionalidades, las reglas de negocio y la arquitectura existentes.

### Cambios realizados

- Se unificaron la identidad visual, la cabecera, los paneles y los estilos globales.
- Se mejoraron el formulario, el buscador y las tarjetas verticales de clientes.
- Se reorganizaron los controles del simulador y se destacaron el total mensual, el desglose y la diferencia entre vista previa y simulación guardada.
- Se rediseñaron las tarjetas del historial y el desplegable «Ver detalles», y se integró visualmente el selector de divisas.
- No se modificaron endpoints, reglas de negocio, persistencia ni dependencias.

### Verificación y límites

- `npm run verify`: backend 450/450 pruebas y frontend 30/30; TypeScript y builds superados.
- El lint terminó correctamente con dos avisos `react(set-state-in-effect)` en `SimulationHistory.tsx` y `SimulationForm.tsx`.
- `git diff --check`: correcto.
- Se revisaron estáticamente la estructura semántica, las etiquetas y los puntos de adaptación responsive. No se completó una inspección visual en varios tamaños ni una prueba manual integral.
- `npm run dev` mostró el inicio de los servidores, pero el navegador integrado no logró cargar `localhost:5174` (`ERR_CONNECTION_TIMED_OUT`). No se tomó ni se presenta una captura nueva como evidencia visual.

El resumen y los resultados vigentes constan en `05-quality-review.md`.

---

_Registro cronológico del desarrollo; las verificaciones vigentes se resumen en `05-quality-review.md`._
