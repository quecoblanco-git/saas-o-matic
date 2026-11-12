# 02 — Registro de interacciones con inteligencia artificial

## 1. Objetivo

Este documento recoge las interacciones relevantes con herramientas de inteligencia artificial utilizadas durante el desarrollo de SaaS-O-Matic.

Su finalidad es mostrar cómo se han planteado las tareas, qué propuestas ha realizado la IA, qué decisiones se han tomado y cómo se han comprobado los resultados.

No se pretende registrar cada mensaje intercambiado, sino conservar las interacciones que aporten información significativa sobre la planificación, la arquitectura, la implementación y el control de calidad.

## 2. Herramientas utilizadas

| Herramienta | Uso                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------- |
| ChatGPT     | Asistencia en la preparación del entorno, planificación inicial y organización de la documentación |

Se añadirán otras herramientas únicamente si se utilizan realmente durante el proyecto.

## 3. Formato de registro

Cada interacción relevante se documentará siguiendo esta estructura:

### Interacción XX — Título

**Fecha:** AAAA-MM-DD  
**Fase:** Planificación / Arquitectura / Implementación / Validación  
**Herramienta:** ChatGPT / Claude / Otra

**Objetivo**

Descripción del problema que se pretende resolver.

**Prompt utilizado**

Texto original del prompt o referencia a su transcripción completa.

**Respuesta o propuesta de la IA**

Resumen de la solución propuesta.

**Revisión y decisión humana**

Explicación de los elementos aceptados, modificados o descartados.

**Resultado y verificación**

Archivos modificados, pruebas realizadas y resultados obtenidos.

**Evidencias**

Referencias a capturas, documentación o commits, cuando existan.

---

## 4. Interacciones previas al desarrollo funcional

### Interacción 01 — Preparación del entorno de desarrollo

**Fecha:** Noviembre de 2026  
**Fase:** Preparación del entorno  
**Herramienta:** ChatGPT

**Objetivo**

Preparar un entorno de desarrollo para SaaS-O-Matic utilizando tecnologías compatibles con los requisitos del ejercicio y una estructura que facilite el mantenimiento del proyecto.

**Registro de la interacción**

Resumen retrospectivo de las conversaciones de configuración. No constituye una transcripción literal de un único prompt.

**Resultado**

Se preparó un proyecto con frontend React y TypeScript, backend Express y TypeScript, SQLite y Prisma, herramientas de pruebas y control de versiones mediante Git y GitHub.

**Revisión y decisiones**

Durante la configuración se realizaron comprobaciones de las herramientas instaladas y se optó por mantener Prisma 7.10.1 en lugar de actualizar a una versión 8 candidata a lanzamiento.

**Verificación**

- Compilación inicial del frontend completada correctamente.
- Validación inicial del esquema Prisma satisfactoria.
- Repositorio local sincronizado con GitHub.

**Evidencias**

- [Estructura del proyecto](evidence/01-project-structure.png)
- [Repositorio inicial](evidence/02-github-repository.png)
- [Compilación del frontend](evidence/03-frontend-build.png)
- [Validación de Prisma](evidence/04-prisma-validation.png)

**Commit relacionado:** `1e95975`

### Interacción 02 — Organización de la documentación

**Fecha:** 2026-11-12  
**Fase:** Planificación  
**Herramienta:** ChatGPT

**Objetivo**

Diseñar una estructura documental que permita presentar el proceso de ingeniería asistido por IA y las evidencias solicitadas en el reto técnico.

**Registro de la interacción**

Resumen de las conversaciones de planificación documental. Los mensajes originales se conservan en el historial de conversación.

**Propuesta de la IA**

Separar la documentación técnica de la aplicación (`docs/`) de la documentación del proceso asistido por IA (`ai-workspace/`), incluyendo planificación, prompts, decisiones técnicas, iteraciones y control de calidad.

**Revisión y decisión humana**

Se decidió redactar la documentación en español para facilitar su comprensión y revisión, manteniendo los nombres de archivos y los identificadores del código en inglés.

También se revisaron y seleccionaron cuatro capturas reales de la preparación inicial del proyecto.

**Resultado**

Se inició la documentación con un índice del espacio de trabajo y un plan inicial basado en los requisitos del ejercicio.

**Evidencias**

- `README.md`
- `01-planning.md`
- Carpeta `evidence/`

---

## 5. Interacciones durante el desarrollo

Las nuevas interacciones se añadirán cronológicamente a medida que se realicen.

Para las tareas de implementación se conservarán los prompts originales relevantes, junto con las propuestas de la IA, las decisiones tomadas y los resultados de las comprobaciones.

Cuando una propuesta genere errores o requiera modificaciones, se documentará también la corrección realizada.

---

_Este registro se ampliará durante el desarrollo real de SaaS-O-Matic._
