# SaaS-O-Matic — Espacio de trabajo con IA

## 1. Objetivo

Esta carpeta documenta el proceso de ingeniería y desarrollo asistido por inteligencia artificial seguido durante la realización del reto técnico **SaaS-O-Matic (Dynamic Billing & Subscription Optimizer)**.

El objetivo no es únicamente mostrar el resultado final de la aplicación, sino también proporcionar evidencias de la planificación, el diseño de la arquitectura, las decisiones técnicas, las iteraciones de desarrollo y las actividades de control de calidad realizadas durante el proyecto.

Se seguirá una metodología basada en **Spec-Driven Development**, definiendo los requisitos y comportamientos esperados antes de implementar las funcionalidades. La inteligencia artificial se utilizará como herramienta de apoyo, manteniendo la supervisión y el criterio técnico del desarrollador.

## 2. Metodología de desarrollo

El trabajo se organizará en cinco fases:

1. **Análisis de requisitos:** identificar las funcionalidades obligatorias, las reglas de negocio, las restricciones y las posibles ambigüedades del enunciado.
2. **Planificación y arquitectura:** definir la estructura de la aplicación, el diseño de la base de datos, los contratos de la API y las etapas de implementación.
3. **Desarrollo asistido por IA:** utilizar prompts estructurados para apoyar la implementación de las funcionalidades.
4. **Revisión e iteración:** analizar el código generado, detectar posibles problemas y realizar las correcciones necesarias.
5. **Validación y entrega:** comprobar el funcionamiento mediante pruebas y documentar los pasos necesarios para ejecutar la aplicación.

Estas fases representan la metodología prevista. Las actividades y sus resultados se documentarán conforme se vayan realizando.

## 3. Índice de documentación

Los siguientes documentos recogerán el proceso de desarrollo:

| Documento                   | Contenido                                             |
| --------------------------- | ----------------------------------------------------- |
| `01-planning.md`            | Planificación inicial, objetivos y desglose de tareas |
| `02-ai-prompts.md`          | Prompts relevantes utilizados y sus objetivos         |
| `03-technical-decisions.md` | Decisiones técnicas, alternativas y justificaciones   |
| `04-development-log.md`     | Iteraciones, problemas encontrados y mejoras          |
| `05-quality-review.md`      | Revisión del código, pruebas y validaciones           |

Las especificaciones funcionales y la documentación técnica de la aplicación se mantendrán por separado en la carpeta `docs/`.

## 4. Preparación inicial del entorno

Antes de implementar las funcionalidades, se ha preparado el entorno de desarrollo utilizando las siguientes tecnologías:

| Componente            | Tecnología                                |
| --------------------- | ----------------------------------------- |
| Frontend              | React, TypeScript y Vite                  |
| Estilos               | Tailwind CSS                              |
| Backend               | Node.js, Express y TypeScript             |
| Base de datos         | SQLite                                    |
| ORM                   | Prisma                                    |
| Pruebas               | Vitest, React Testing Library y Supertest |
| Control de versiones  | Git y GitHub                              |
| Entorno de desarrollo | Visual Studio Code                        |

Durante esta fase se han realizado las siguientes tareas:

- Creación de proyectos independientes para frontend y backend.
- Instalación y configuración de TypeScript y las dependencias iniciales.
- Inicialización de Prisma con SQLite.
- Configuración de Git y de los archivos excluidos del repositorio.
- Creación y publicación del primer commit en GitHub.
- Compilación satisfactoria del frontend inicial.
- Validación correcta del esquema inicial de Prisma.

En este punto todavía no se han implementado las funcionalidades de la aplicación, los modelos de datos ni las reglas de negocio.

## 5. Evidencias de la preparación inicial

Se han recopilado las siguientes capturas para documentar el estado inicial del proyecto:

| Evidencia                                                            | Descripción                                            |
| -------------------------------------------------------------------- | ------------------------------------------------------ |
| [Estructura inicial del proyecto](evidence/01-project-structure.png) | Organización de carpetas y configuración de TypeScript |
| [Repositorio de GitHub](evidence/02-github-repository.png)           | Estado inicial del repositorio y primer commit         |
| [Compilación del frontend](evidence/03-frontend-build.png)           | Compilación inicial completada correctamente           |
| [Validación de Prisma](evidence/04-prisma-validation.png)            | Validación satisfactoria del esquema inicial           |

**Primer commit:** `1e95975` — `chore: initialize SaaS-O-Matic development environment`

Estas evidencias corresponden exclusivamente a la preparación del entorno y no representan funcionalidades implementadas.

## 6. Uso de IA y supervisión técnica

Durante el desarrollo se documentarán las interacciones más relevantes con herramientas de inteligencia artificial, prestando especial atención a:

- El objetivo y el contexto de cada prompt importante.
- Las soluciones o recomendaciones propuestas por la IA.
- Las decisiones técnicas tomadas por el desarrollador.
- Los cambios aceptados, descartados o modificados.
- Las comprobaciones realizadas para verificar el resultado.

La responsabilidad sobre la arquitectura, la corrección del código, la seguridad y la calidad de la solución final permanecerá en todo momento bajo supervisión humana.

---

_Este documento se actualizará progresivamente a medida que avance el desarrollo del proyecto._
