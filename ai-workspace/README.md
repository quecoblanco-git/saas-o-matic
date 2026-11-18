# SaaS-O-Matic — Espacio de trabajo con IA

## 1. Objetivo

Esta carpeta reúne la planificación, las decisiones técnicas, el registro de iteraciones y las verificaciones del proyecto **SaaS-O-Matic**. La IA se utilizó como apoyo; las decisiones y la aceptación de resultados permanecieron bajo supervisión humana.

## 2. Metodología de desarrollo

El proceso se organizó en cinco fases:

1. **Análisis de requisitos:** identificar las funcionalidades obligatorias, las reglas de negocio, las restricciones y las posibles ambigüedades del enunciado.
2. **Planificación y arquitectura:** definir la estructura de la aplicación, el diseño de la base de datos, los contratos de la API y las etapas de implementación.
3. **Desarrollo asistido por IA:** utilizar prompts estructurados para apoyar la implementación de las funcionalidades.
4. **Revisión e iteración:** analizar el código generado, detectar posibles problemas y realizar las correcciones necesarias.
5. **Validación y entrega:** comprobar el funcionamiento mediante pruebas y documentar los pasos necesarios para ejecutar la aplicación.

Los documentos enlazados registran el plan inicial y los resultados observados durante el desarrollo. Las secciones sobre el estado inicial son históricas.

## 3. Índice de documentación

Estos documentos recogen el proceso de desarrollo:

| Documento                                              | Contenido                                                      |
| ------------------------------------------------------ | -------------------------------------------------------------- |
| [01-planning.md](01-planning.md)                       | Planificación inicial, objetivos y desglose de tareas.         |
| [02-ai-prompts.md](02-ai-prompts.md)                   | Prompts relevantes utilizados y sus objetivos.                 |
| [03-technical-decisions.md](03-technical-decisions.md) | Decisiones técnicas, alternativas y justificaciones.           |
| [04-development-log.md](04-development-log.md)         | Registro cronológico de iteraciones, problemas y validaciones. |
| [05-quality-review.md](05-quality-review.md)           | Revisión del código, pruebas y controles de calidad.           |
| [ai-development-log.md](ai-development-log.md)         | Casos prácticos del uso de IA durante el desarrollo.           |
| [Requisitos](../docs/requirements.md)                   | Especificación funcional y técnica vigente.                   |
| [Arquitectura](../docs/architecture.md)                 | Componentes, datos y comunicación entre frontend y backend.   |

El registro `04-development-log.md` conserva la evolución
cronológica del proyecto y los resultados de cada fase.

El documento `ai-development-log.md` complementa ese registro
con explicaciones detalladas de casos prácticos de desarrollo
asistido por inteligencia artificial.

Las secciones que describen la preparación inicial del entorno
representan el estado histórico del proyecto en ese momento,
no necesariamente su estado actual.

Las especificaciones funcionales y la documentación técnica de la aplicación se mantienen por separado en la carpeta `docs/`.

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

En esa fase inicial todavía no se habían implementado las funcionalidades, los modelos de datos ni las reglas de negocio. El desarrollo posterior se registra en `04-development-log.md`.

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

Durante el desarrollo se documentaron las interacciones más relevantes con herramientas de inteligencia artificial, prestando especial atención a:

- El objetivo y el contexto de cada prompt importante.
- Las soluciones o recomendaciones propuestas por la IA.
- Las decisiones técnicas tomadas por el desarrollador.
- Los cambios aceptados, descartados o modificados.
- Las comprobaciones realizadas para verificar el resultado.

La responsabilidad sobre la arquitectura, la corrección del código, la seguridad y la calidad de la solución final permaneció bajo supervisión humana.

---

_El índice identifica la documentación vigente del espacio de trabajo; los estados y resultados de verificación se consultan en `04-development-log.md` y `05-quality-review.md`._
