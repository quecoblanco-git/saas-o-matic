# 04 — Registro de desarrollo e iteraciones

## 1. Objetivo

Este documento registra la evolución real de SaaS-O-Matic durante su desarrollo.

Su finalidad es mostrar las tareas realizadas, las propuestas de la inteligencia artificial, las comprobaciones efectuadas y las modificaciones introducidas como resultado de la revisión humana.

El registro se actualizará progresivamente, evitando documentar como completadas funcionalidades o pruebas que todavía no se hayan realizado.

## 2. Metodología de trabajo

Cada iteración seguirá, siempre que resulte aplicable, este proceso:

1. Definir el objetivo y los criterios de aceptación.
2. Preparar las instrucciones para la IA.
3. Revisar la solución propuesta.
4. Aplicar los cambios necesarios.
5. Ejecutar las comprobaciones correspondientes.
6. Registrar los resultados, errores y decisiones.
7. Crear un commit cuando exista un avance verificable.

Las interacciones relevantes con IA se recogerán también en `02-ai-prompts.md`.

## 3. Estado inicial del proyecto

**Fase:** Preparación del entorno y planificación  
**Estado:** Preparación técnica inicial completada; desarrollo funcional pendiente

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

## 4. Registro de iteraciones funcionales

Las iteraciones se incorporarán cronológicamente conforme avance el desarrollo.

Para mantener un registro consistente, utilizaremos la siguiente plantilla.

### Iteración XX — Nombre de la tarea

**Fecha:** AAAA-MM-DD  
**Fase:** Especificación / Arquitectura / Backend / Frontend / Integración / Calidad  
**Estado:** Pendiente / En curso / Completada / Bloqueada

**Objetivo**

Describir la funcionalidad o el problema que se pretende resolver.

**Criterios de aceptación**

Definir qué condiciones deben cumplirse para considerar satisfactoria la tarea.

**Asistencia de IA**

Indicar qué herramienta se utilizó y enlazar la interacción correspondiente de `02-ai-prompts.md`.

**Implementación**

Resumir los archivos creados o modificados y las principales decisiones aplicadas.

**Revisión humana**

Explicar qué aspectos de la propuesta se revisaron, aceptaron, modificaron o rechazaron.

**Validación**

Registrar los comandos, pruebas y comprobaciones ejecutados, junto con sus resultados.

**Problemas y correcciones**

Describir los errores detectados, sus causas conocidas y las correcciones realizadas. Si no se detectaron problemas, indicarlo expresamente.

**Evidencias**

Añadir referencias a capturas, resultados de pruebas o archivos relevantes, cuando existan.

**Commit relacionado**

Registrar el identificador del commit una vez creado.

---

## 5. Seguimiento de problemas

Los problemas significativos se documentarán dentro de la iteración en la que aparezcan.

Cuando un problema afecte a varias iteraciones, se mantendrá una referencia a su estado hasta su resolución.

Se prestará especial atención a:

- Errores en los cálculos de facturación.
- Validaciones fiscales incorrectas.
- Problemas de persistencia.
- Inconsistencias entre frontend y backend.
- Errores en la conversión de divisas.
- Problemas de seguridad y validación de entradas.
- Regresiones detectadas mediante pruebas.

## 6. Criterios para cerrar una iteración

Una iteración se considerará completada cuando:

- Se hayan implementado los requisitos definidos para esa tarea.
- Se haya revisado el código o la solución propuesta.
- Se hayan ejecutado las comprobaciones aplicables.
- Se hayan documentado los errores pendientes, si existen.
- El registro refleje el resultado real de la tarea.

La existencia de código generado no será suficiente, por sí sola, para considerar completada una funcionalidad.

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

_Registro iniciado durante la preparación del proyecto. Las iteraciones funcionales se añadirán conforme se desarrollen y verifiquen._
