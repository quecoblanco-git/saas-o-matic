# 02 — Registro de interacciones con inteligencia artificial

## 1. Objetivo

Este documento recoge las interacciones relevantes con herramientas de inteligencia artificial utilizadas durante el desarrollo de SaaS-O-Matic.

Su finalidad es mostrar cómo se han planteado las tareas, qué propuestas ha realizado la IA, qué decisiones se han tomado y cómo se han comprobado los resultados.

No se pretende registrar cada mensaje intercambiado, sino conservar las interacciones que aporten información significativa sobre la planificación, la arquitectura, la implementación y el control de calidad.

## 2. Herramientas utilizadas

| Herramienta   | Uso                                                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ChatGPT       | Preparación del entorno, planificación y organización documental (12/11/2026); apoyo a la implementación registrado el 16/11/2026.                                                          |
| Codex Desktop | Prompts inicial, de auditoría, rediseño, tratamiento de errores, eliminación de registros y guías de instalación/uso; implementación, verificación y documentación (13/11 y 17–19/11/2026). |

Solo se registran herramientas utilizadas durante el proyecto.

## 3. Criterio de registro

Las interacciones históricas de los apartados 4 y 5 se presentan como resúmenes retrospectivos. Los seis prompts originales se reproducen íntegros en el apartado 6, con las adaptaciones editoriales indicadas allí. Los resultados de implementación y verificación se documentan en `04-development-log.md` y `05-quality-review.md`.

---

## 4. Interacciones previas al desarrollo funcional

### Interacción 01 — Preparación del entorno de desarrollo

- **Fecha:** 2026-11-12
- **Fase:** Preparación del entorno
- **Herramienta:** ChatGPT

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

- **Fecha:** 2026-11-12
- **Fase:** Planificación
- **Herramienta:** ChatGPT

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

### Interacción 03 — Mejora incremental de facturación y divisas

- **Fecha:** 2026-11-17–18
- **Fase:** Implementación y documentación
- **Herramienta:** Codex Desktop

**Objetivo**

Aplicar mejoras autorizadas de forma secuencial, manteniendo la arquitectura y verificando cada cambio.

**Registro**

Resumen de la conversación, no transcripción literal. Se trabajó en la vista previa y el desglose de tarifas por tramos, la disponibilidad dinámica de divisas y la prueba del fallback cuando falla su carga. Después se solicitó una revisión amplia de la documentación.

**Resultado y verificación**

- Backend: 86 pruebas focalizadas de facturación/simulaciones y 49 de divisas; comprobación TypeScript satisfactoria.
- Frontend: 17 pruebas focalizadas de selector y vista previa; después, 9 pruebas del selector, incluida la carga fallida.
- La comprobación del 17/11 detectó un import `act` sin uso en `CustomerList.test.tsx`; se eliminó el 18/11.
- Verificación completa del 18/11: 460 pruebas de backend y 52 de frontend superadas; tipos y builds satisfactorios. El lint del frontend informa de dos avisos sobre `setState` dentro de efectos.
- La implementación y los resultados se registran en `04-development-log.md` y `05-quality-review.md`.

### Interacción 04 — Rediseño de la interfaz principal

- **Fecha:** 2026-11-18
- **Fase:** Mejora de interfaz y verificación
- **Herramienta:** Codex Desktop

**Objetivo**

Aplicar el prompt de rediseño facilitado para modernizar el dashboard mediante cambios visuales progresivos, preservando el comportamiento de clientes, simulaciones, historial y divisas.

**Registro**

Resumen de la interacción, no transcripción literal. El usuario autorizó los bloques de forma secuencial. Se completaron los bloques de estilos y cabecera, gestión de clientes, simulador, e historial y divisas.

**Resultado y verificación**

- Se ejecutó `npm run verify`: 460 pruebas de backend y 52 de frontend superadas; TypeScript y builds correctos.
- El lint finalizó con dos avisos existentes sobre actualizaciones de estado dentro de efectos.
- La revisión responsive y de accesibilidad fue estática. La comprobación visual en navegador quedó pendiente porque el navegador integrado no pudo cargar el servidor local.
- Los cambios, verificaciones y límites se detallan en `04-development-log.md` y `05-quality-review.md`.

### Interacción 05 — Eliminación segura de clientes y simulaciones

- **Fecha:** 2026-11-18–19
- **Fase:** Implementación, pruebas y documentación
- **Herramienta:** Codex Desktop

**Objetivo**

Añadir la eliminación confirmada de clientes y simulaciones, conservar la integridad entre ambas entidades y sincronizar los estados de la interfaz.

**Registro**

Se implementaron endpoints `DELETE` con respuestas 204/404. La eliminación de clientes borra sus simulaciones dentro de una transacción Prisma; la eliminación individual utiliza una operación acotada a la simulación solicitada. El frontend usa confirmaciones nativas accesibles, contempla errores y gestiona respuestas 204 sin intentar leer JSON. Se actualizaron requisitos, arquitectura, README y registros del proceso.

**Resultado y verificación**

- `npm run verify` (19/11/2026): 460 pruebas de backend y 52 de frontend superadas; TypeScript y compilaciones correctos.
- El lint finalizó con dos avisos `react(set-state-in-effect)` en componentes de simulaciones.
- Las pruebas de integración con SQLite verificaron el borrado de clientes con y sin simulaciones, la ausencia de huérfanos y la conservación del cliente y de otras simulaciones al borrar un único registro.
- El 19/11/2026, se revisó manualmente todas las características y se confirmó que funcionan correctamente.
- El prompt íntegro se reproduce como Prompt 5.

---

### Interacción 06 — Guías de instalación y uso

- **Fecha:** 2026-11-19
- **Fase:** Documentación y verificación editorial
- **Herramienta:** Codex Desktop

**Objetivo**

Preparar guías reproducibles de instalación y uso, contrastadas con los scripts, el código y las pruebas existentes.

**Resultado**

Se crearon `docs/installation-guide.md` y `docs/user-guide.md`, se añadieron enlaces al README y al índice documental, y se registraron las limitaciones de las validaciones fiscales, los flujos disponibles y las evidencias visuales.

**Verificación**

Se revisaron estáticamente los comandos, rutas, ejemplos, enlaces y estructura Markdown. Los ejemplos de validación se contrastaron con los esquemas y pruebas existentes; se ejecutaron las pruebas focalizadas de validadores fiscales y facturación. No se alteró código ni se realizó una instalación nueva en esta intervención.

**Prompt íntegro:** Prompt 6.

---

## 6. Prompts originales utilizados

Los siguientes bloques reproducen los seis prompts más relevantes facilitados durante el desarrollo. Se conservan su contenido e instrucciones, con espacios de presentación normalizados. Las rutas absolutas del equipo se normalizan a la ruta relativa `saas-o-matic/`.

### Prompt 1 — Desarrollo inicial de SaaS-O-Matic

- **Fecha original:** 13/11/2026
- **Herramienta:** Codex.
- **Objetivo:** Definir el alcance inicial, el stack, la metodología de desarrollo, los criterios de calidad y el plan previo a la implementación.

<details>

<summary>Mostrar el prompt completo</summary>

```text
Prompt inicial - desarrollo de saas-o-matic
1. Contexto del proyecto
Voy a desarrollar una aplicación denominada SaaS-O-Matic (Dynamic Billing & Subscription Optimizer) como parte de una prueba técnica para un proceso de selección de Desarrollador Full-Stack AI-Augmented en Roams.
El objetivo es construir una aplicación web funcional, bien estructurada, mantenible y correctamente documentada que permita gestionar clientes SaaS y realizar simulaciones de facturación.
Te proporcionaré el enunciado oficial de la prueba técnica, que deberá considerarse la principal fuente de requisitos.
Quiero que actúes como un desarrollador Full-Stack sénior, arquitecto de software y mentor técnico, ayudándome durante todo el proceso de análisis, planificación, implementación, pruebas y documentación.
El desarrollo debe demostrar tanto mis capacidades técnicas como mi habilidad para utilizar herramientas de inteligencia artificial de forma responsable y eficiente.
2. Objetivos principales
La aplicación deberá permitir, conforme al enunciado:
    • Registrar y gestionar clientes.
    • Validar los datos introducidos, incluidos sus identificadores fiscales.
    • Buscar y consultar clientes registrados.
    • Seleccionar planes SaaS.
    • Realizar simulaciones de facturación.
    • Calcular importes utilizando las reglas económicas establecidas.
    • Aplicar los impuestos correspondientes.
    • Consultar simulaciones anteriores.
    • Visualizar los resultados mediante una interfaz clara e intuitiva.
    • Incorporar las funcionalidades adicionales que exija el enunciado, como la conversión de divisas.
No debes inventar reglas de negocio ni introducir funcionalidades que contradigan el enunciado.
Si detectas ambigüedades, contradicciones o aspectos insuficientemente definidos, identifícalos y explícame sus posibles interpretaciones antes de implementar una solución.
3. Tecnologías seleccionadas
Utilizaremos el siguiente stack tecnológico:
Frontend
    • React con TypeScript.
    • Vite.
    • Tailwind CSS.
    • Componentes funcionales y hooks.
    • Vitest y React Testing Library.
Backend
    • Node.js.
    • Express.
    • TypeScript.
    • Zod para validaciones.
    • Prisma ORM.
    • SQLite.
    • Vitest y Supertest.
Herramientas
    • Visual Studio Code.
    • Git y GitHub.
    • npm.
    • Windows y PowerShell.
    • Herramientas de inteligencia artificial para apoyar el desarrollo.
Prioriza soluciones sencillas, modernas y compatibles entre sí.
Evita incorporar dependencias innecesarias o tecnologías adicionales sin justificar su utilidad.
4. Estructura del proyecto
El proyecto se desarrollará en la siguiente ubicación:
saas-o-matic/
La organización principal será:
saas-o-matic/
├── ai-workspace/
├── backend/
├── docs/
├── frontend/
├── README.md
└── .gitignore
frontend/
Contendrá la aplicación React, los componentes, las llamadas a la API, los tipos de datos, los estilos y las pruebas.
backend/
Contendrá la API REST, los módulos de negocio, los servicios, las validaciones, la configuración de Prisma y las pruebas automatizadas.
docs/
Contendrá los requisitos, la arquitectura, las decisiones de diseño y la documentación funcional y técnica.
ai-workspace/
Registrará el uso de inteligencia artificial durante el desarrollo: planificación, prompts, decisiones técnicas, evolución del proyecto y revisión de calidad.
La estructura podrá ampliarse cuando sea necesario, pero deberá mantenerse coherente y evitar una fragmentación excesiva.
5. Metodología de desarrollo
Quiero desarrollar el proyecto de forma incremental, ordenada y comprensible.
Seguiremos estas fases generales:
Fase 1. Análisis
    1. Leer íntegramente el enunciado.
    2. Identificar los requisitos funcionales y no funcionales.
    3. Detectar dudas, limitaciones y ambigüedades.
    4. Proponer una arquitectura adecuada.
    5. Justificar las tecnologías seleccionadas.
Fase 2. Preparación
    1. Comprobar el entorno de desarrollo.
    2. Crear y organizar las carpetas.
    3. Configurar el frontend y el backend.
    4. Instalar y configurar las dependencias.
    5. Preparar TypeScript, Prisma, SQLite y las herramientas de pruebas.
    6. Inicializar el repositorio Git.
Fase 3. Backend
    1. Diseñar los modelos de datos.
    2. Configurar la base de datos.
    3. Implementar las validaciones.
    4. Implementar la lógica de negocio.
    5. Crear los servicios y endpoints REST.
    6. Gestionar adecuadamente los errores.
    7. Incorporar pruebas unitarias y de integración.
Fase 4. Frontend
    1. Diseñar una interfaz sencilla, profesional y responsive.
    2. Implementar los formularios necesarios.
    3. Conectar los componentes con la API.
    4. Mostrar correctamente los resultados de las simulaciones.
    5. Implementar los listados, búsquedas e historiales.
    6. Gestionar estados de carga, errores y ausencia de datos.
    7. Incorporar pruebas de interfaz.
Fase 5. Verificación
    1. Comprobar los requisitos funcionales.
    2. Ejecutar las pruebas automatizadas.
    3. Verificar las compilaciones.
    4. Revisar casos límite.
    5. Detectar posibles errores de seguridad, validación o precisión monetaria.
    6. Comprobar la integración completa entre frontend y backend.
Fase 6. Documentación y entrega
    1. Completar el README.
    2. Documentar la arquitectura.
    3. Explicar las decisiones técnicas.
    4. Registrar cómo se ha utilizado la inteligencia artificial.
    5. Preparar las evidencias necesarias.
    6. Revisar que el repositorio pueda instalarse y ejecutarse siguiendo las instrucciones.
    7. Comprobar que se cumplen las condiciones de entrega.
6. Instrucciones sobre el código
El código deberá cumplir las siguientes características:
    • Estar escrito en TypeScript siempre que corresponda.
    • Utilizar nombres descriptivos y coherentes.
    • Mantener una separación clara de responsabilidades.
    • Evitar duplicaciones innecesarias.
    • Incorporar validaciones en los puntos adecuados.
    • Gestionar correctamente los errores.
    • Priorizar la legibilidad y la mantenibilidad.
    • Evitar soluciones excesivamente complejas para el alcance de la prueba.
    • Utilizar comentarios en español cuando aporten información útil, sin comentar innecesariamente instrucciones evidentes.
No quiero construir una arquitectura empresarial sobredimensionada, sino una aplicación sólida, proporcionada a los requisitos de una prueba técnica.
7. Pruebas y calidad
Las funcionalidades relevantes deberán contar con pruebas automatizadas.
Presta especial atención a:
    • Validaciones de formularios.
    • Identificadores fiscales.
    • Cálculos monetarios.
    • Redondeos.
    • Impuestos.
    • Límites y casos extremos.
    • Persistencia y recuperación de datos.
    • Errores de la API.
    • Integración entre componentes.
    • Funcionamiento de las simulaciones.
Cuando detectes un error, explica primero su causa probable y después propón una corrección concreta.
No afirmes que una prueba ha pasado si no existe evidencia de su ejecución.
8. Documentación del uso de inteligencia artificial
La prueba técnica está relacionada con el desarrollo asistido por inteligencia artificial, por lo que quiero documentar adecuadamente este proceso.
Registra, cuando corresponda:
    • Los prompts más relevantes utilizados.
    • Las decisiones tomadas con ayuda de IA.
    • Las alternativas técnicas consideradas.
    • Las soluciones propuestas y aceptadas.
    • Los problemas detectados.
    • Las correcciones realizadas.
    • Las comprobaciones efectuadas manualmente.
La documentación debe reflejar de forma transparente cómo se ha utilizado la IA y qué partes han sido verificadas por el desarrollador.
9. Evidencias y capturas
Durante el desarrollo, identifica los momentos en los que sería recomendable guardar capturas de pantalla como evidencia del trabajo realizado.
Por ejemplo:
    • Configuración del entorno.
    • Estructura del proyecto.
    • Modelos y relaciones de datos.
    • Diagramas de arquitectura.
    • Ejecución de pruebas.
    • Funcionamiento de la aplicación.
    • Resultados de las simulaciones.
No es necesario generar capturas continuamente. Prioriza aquellas que aporten valor a la documentación y a la presentación final.
10. Forma de trabajar conmigo
Estas instrucciones son especialmente importantes.
Quiero entender y controlar todo el proceso de desarrollo.
Por tanto:
    1. Explica con claridad qué vamos a realizar y por qué.
    2. Divide el desarrollo en pasos concretos y ordenados.
    3. Proporciona las rutas exactas de los archivos que debamos modificar.
    4. Cuando sea necesario ejecutar comandos, indícame cuáles son y desde qué directorio.
    5. Diferencia claramente el código nuevo del que debe sustituirse.
    6. Evita realizar modificaciones no solicitadas.
    7. No cambies decisiones arquitectónicas previamente acordadas sin explicarlo.
    8. No introduzcas nuevas dependencias sin justificar su necesidad.
    9. Cuando te comparta un resultado o un error, analízalo antes de continuar.
    10. No avances dando por supuesto que una acción ha funcionado si todavía no la hemos verificado.
Durante las primeras fases, prefiero avanzar paso a paso para familiarizarme con el proyecto. Más adelante podremos agrupar tareas y comprobaciones para acelerar el desarrollo.
11. Prioridades generales
Aplica el siguiente orden de prioridades:
    1. Cumplimiento del enunciado oficial.
    2. Funcionamiento correcto de la aplicación.
    3. Precisión de los cálculos y validaciones.
    4. Integridad de los datos.
    5. Calidad y mantenibilidad del código.
    6. Experiencia de usuario.
    7. Cobertura de pruebas.
    8. Documentación.
    9. Mejoras estéticas o funcionalidades adicionales.
No sacrifiques el cumplimiento de los requisitos por añadir funcionalidades visualmente atractivas pero innecesarias.
12. Primera tarea
Antes de comenzar a programar, quiero que:
    1. Analices detenidamente el enunciado que voy a proporcionarte.
    2. Resumas qué aplicación debemos construir.
    3. Identifiques todos los requisitos principales.
    4. Propongas una arquitectura técnica.
    5. Valides la idoneidad del stack tecnológico seleccionado.
    6. Propongas una estructura inicial de carpetas.
    7. Dividas el desarrollo en fases y tareas.
    8. Señales los principales riesgos técnicos.
    9. Identifiques cualquier información que debamos aclarar antes de comenzar.
No empieces a implementar código todavía.
Primero quiero revisar contigo el análisis y el plan de desarrollo. Una vez acordados, comenzaremos la implementación siguiendo la metodología indicada.

```

</details>

### Prompt 2 — Auditoría y mejora controlada

- **Fecha original:** 17/11/2026
- **Herramienta:** Codex.
- **Objetivo:** Establecer el procedimiento de auditoría, priorización, protección del proyecto y aplicación supervisada de mejoras.

<details>

<summary>Mostrar el prompt completo</summary>

```text
# Protocolo de auditoría técnica, evaluación e implementación controlada de mejoras

**Proyecto:** SaaS-O-Matic
**Destinatario:** Asistente de desarrollo de software Codex
**Ámbito:** Auditoría integral, evaluación de requisitos, planificación de mejoras y mantenimiento evolutivo supervisado
**Idioma de trabajo:** Español

---

## 1. Objetivo general

Actúa como un **arquitecto de software senior, auditor técnico y desarrollador full-stack especializado en calidad de código, testing, documentación y mantenimiento evolutivo de aplicaciones**.

Tu objetivo es realizar una revisión exhaustiva del proyecto de software proporcionado, comprender su funcionamiento real, evaluar su calidad técnica y verificar su cumplimiento respecto al enunciado original.

Una vez completada la auditoría, deberás identificar, justificar y priorizar posibles mejoras, preparando posteriormente su implementación progresiva mediante modificaciones pequeñas, seguras y supervisadas.

El proceso comprende cuatro grandes etapas:

1. **Auditoría integral:** inspección del código, arquitectura, funcionalidades, pruebas, documentación, requisitos y evidencias visuales.
2. **Evaluación y planificación:** identificación de problemas, valoración de riesgos y elaboración de un plan de mejoras priorizado.
3. **Protección del estado inicial:** creación y verificación de una copia de seguridad completa del proyecto antes de introducir cualquier modificación.
4. **Implementación controlada:** ejecución gradual de mejoras autorizadas, validando individualmente cada cambio.

El propósito no es reconstruir la aplicación ni sustituir su arquitectura, sino **perfeccionar la implementación existente, conservar sus funcionalidades y mejorar su calidad sin introducir complejidad innecesaria**.

### Principio fundamental

El proyecto debe conservar su identidad técnica, estructura general y decisiones arquitectónicas principales.

Las modificaciones deberán ser mínimas, justificadas y proporcionales al problema que pretenden resolver.

**Ninguna modificación podrá ejecutarse sin autorización explícita del responsable del proyecto.**

---

## 2. Normas generales de actuación

Durante todo el proceso deberás respetar las siguientes reglas:

1. Trabaja exclusivamente sobre el proyecto proporcionado y su documentación asociada.
2. Analiza el código real antes de formular conclusiones.
3. Considera el enunciado original como referencia principal para comprobar el cumplimiento de requisitos.
4. Distingue los defectos confirmados de los riesgos potenciales y las oportunidades de mejora.
5. No asumas que una funcionalidad existe únicamente porque aparece descrita en la documentación.
6. No declares ausente una funcionalidad sin haber examinado los módulos relacionados.
7. No propongas refactorizaciones innecesarias ni modificaciones puramente estilísticas sin beneficio tangible.
8. Mantén la compatibilidad con las tecnologías, herramientas y convenciones existentes.
9. Evita introducir dependencias nuevas salvo que exista una justificación técnica suficiente y se autorice expresamente.
10. No alteres la lógica de negocio, los modelos de datos ni los contratos de las API sin una necesidad demostrada.
11. No ejecutes operaciones destructivas.
12. No modifiques el repositorio Git sin autorización específica.
13. No expongas credenciales, variables de entorno sensibles ni datos privados.
14. Mantén un registro comprensible de las mejoras propuestas y ejecutadas.
15. Solicita autorización para cada paso y detente tras completarlo.

La auditoría inicial deberá realizarse exclusivamente mediante operaciones de lectura.

No instales dependencias, ejecutes scripts potencialmente modificadores ni generes archivos durante esta fase.

Si alguna comprobación requiere ejecutar el software o producir archivos temporales, indícalo y solicita autorización.

---

# PARTE I — AUDITORÍA INTEGRAL DEL PROYECTO

## 3. Inventario y reconocimiento del entorno

Comienza explorando recursivamente la carpeta raíz del proyecto.

Identifica los elementos relevantes y reconstruye su organización:

- Código fuente del frontend.
- Código fuente del backend.
- Módulos, componentes y servicios.
- Configuraciones generales.
- Dependencias y gestores de paquetes.
- Modelos de datos, esquemas y migraciones.
- Rutas y endpoints.
- Utilidades compartidas.
- Pruebas automatizadas.
- Documentación técnica y funcional.
- Enunciado original del proyecto.
- Capturas de pantalla y diagramas.
- Scripts de desarrollo, compilación y ejecución.
- Configuración de Git y posibles herramientas de integración continua.

No es necesario inspeccionar individualmente dependencias instaladas, archivos generados o cachés, salvo que sean relevantes para detectar problemas.

### Resultado esperado

Presenta un inventario estructurado que explique:

- Tecnologías utilizadas.
- Arquitectura general.
- Responsabilidad de cada directorio principal.
- Dependencias relevantes.
- Organización del código.
- Mecanismos de ejecución y pruebas.
- Documentación disponible.
- Elementos que no hayas podido inspeccionar.

No te limites a describir nombres de archivos: examina su contenido y las relaciones entre los principales módulos.

---

## 4. Análisis del enunciado y trazabilidad de requisitos

Localiza y lee íntegramente el enunciado original de la prueba o proyecto.

Extrae los requisitos funcionales y técnicos, diferenciando entre:

- Requisitos obligatorios.
- Restricciones técnicas.
- Requisitos de interfaz y experiencia de usuario.
- Requisitos relacionados con persistencia.
- Validaciones y reglas de negocio.
- Testing.
- Documentación y entrega.
- Criterios de evaluación explícitos.
- Funcionalidades opcionales.

Construye una matriz de trazabilidad con el siguiente formato:

| Requisito | Referencia del enunciado | Estado | Evidencia | Observaciones |
|---|---|---|---|---|

Utiliza exclusivamente los estados:

- Cumplido.
- Parcialmente cumplido.
- No cumplido.
- No verificable.

Cada conclusión debe estar fundamentada en archivos, funciones, pruebas u otras evidencias comprobables.

Cuando existan requisitos ambiguos, explica las posibles interpretaciones sin considerar automáticamente incorrecta la implementación.

No atribuyas al enunciado exigencias que no aparecen expresamente en él.

---

## 5. Reconstrucción del funcionamiento de la aplicación

Analiza la implementación para comprender el comportamiento funcional y técnico de la aplicación.

### 5.1. Propósito

Determina:

- Qué problema resuelve.
- A qué usuarios está dirigida.
- Qué funcionalidades ofrece.
- Qué información recibe.
- Qué resultados genera.
- Qué beneficios proporciona.

### 5.2. Funcionalidades

Identifica las funcionalidades realmente implementadas.

Para cada una, explica:

- Objetivo.
- Datos de entrada.
- Reglas de negocio.
- Procesamiento.
- Datos de salida.
- Persistencia, cuando corresponda.
- Validaciones.
- Tratamiento de errores.
- Limitaciones.

### 5.3. Flujos funcionales

Reconstruye los principales flujos de extremo a extremo.

Cuando proceda, sigue el recorrido completo:

1. Interacción del usuario.
2. Captura de información.
3. Validación en frontend.
4. Comunicación con backend.
5. Validación en servidor.
6. Ejecución de lógica de negocio.
7. Operaciones de persistencia.
8. Construcción de la respuesta.
9. Actualización de la interfaz.
10. Gestión de errores y casos límite.

Identifica las relaciones entre componentes, servicios, entidades y endpoints.

Diferencia claramente lo confirmado mediante inspección estática de aquello que requiere ejecución para verificarse.

### Resultado esperado

Elabora una explicación que permita a un desarrollador externo comprender la aplicación sin necesidad de haber participado en su desarrollo.

---

## 6. Evaluación de arquitectura y calidad del código

Realiza una auditoría técnica de los principales componentes.

### 6.1. Arquitectura

Evalúa:

- Separación de responsabilidades.
- Organización modular.
- Cohesión.
- Acoplamiento.
- Reutilización.
- Mantenibilidad.
- Consistencia de patrones.
- Complejidad.
- Adecuación de la arquitectura al alcance del proyecto.

No propongas patrones arquitectónicos complejos cuando la solución existente sea suficiente.

### 6.2. Frontend

Si existe, examina:

- Estructura de componentes.
- Gestión del estado.
- Formularios.
- Validaciones.
- Comunicación con backend.
- Estados de carga.
- Manejo de errores.
- Reutilización.
- Accesibilidad.
- Diseño responsive.
- Experiencia de usuario.
- Visualización de resultados.
- Tratamiento de datos vacíos y situaciones excepcionales.

### 6.3. Backend

Si existe, examina:

- Rutas y controladores.
- Servicios.
- Reglas de negocio.
- Validaciones.
- Gestión de errores.
- Consistencia de respuestas.
- Seguridad de endpoints.
- Integridad de datos.
- Organización de dependencias.
- Casos límite.
- Robustez de procesos y cálculos.

### 6.4. Persistencia

Si existe base de datos, revisa:

- Entidades.
- Relaciones.
- Tipos de datos.
- Restricciones.
- Migraciones.
- Integridad referencial.
- Operaciones de lectura y escritura.
- Coherencia del modelo.
- Posibles inconsistencias.
- Adecuación a los requisitos.

### 6.5. Seguridad

Identifica riesgos relacionados con:

- Validaciones insuficientes.
- Exposición de información sensible.
- Configuraciones inseguras.
- Gestión de errores.
- Manejo de credenciales.
- Manipulación indebida de datos.
- Dependencias vulnerables, cuando exista evidencia suficiente.

No afirmes que una vulnerabilidad es explotable sin pruebas adecuadas.

### 6.6. Calidad interna

Valora:

- Legibilidad.
- Nomenclatura.
- Responsabilidad de funciones.
- Duplicación.
- Tipado.
- Complejidad.
- Consistencia.
- Código innecesario.
- Comentarios.
- Documentación interna.
- Facilidad de mantenimiento.

Todas las observaciones relevantes deberán incluir referencias concretas al código.

---

## 7. Auditoría de pruebas y confiabilidad

Examina la estrategia de testing.

Identifica:

- Herramientas utilizadas.
- Pruebas unitarias.
- Pruebas de integración.
- Pruebas de componentes.
- Pruebas de API.
- Cobertura de requisitos.
- Casos límite.
- Casos negativos.
- Verificación de errores.
- Funcionalidades insuficientemente probadas.

Comprueba si las pruebas existentes verifican realmente el comportamiento esperado.

Diferencia entre:

- Funcionalidades cubiertas.
- Funcionalidades parcialmente cubiertas.
- Funcionalidades sin pruebas.
- Riesgos no contemplados.

Durante la auditoría inicial no ejecutes pruebas que puedan generar archivos, alterar datos o modificar el entorno.

Si existen resultados verificables de ejecuciones anteriores, puedes analizarlos, pero no debes presentarlos como una ejecución actual.

Propón pruebas adicionales solo cuando aporten valor significativo.

---

## 8. Auditoría documental

Revisa toda la documentación relevante y compárala con el código.

Evalúa:

- README.
- Instrucciones de instalación.
- Requisitos previos.
- Arquitectura.
- Modelos de datos.
- API.
- Funcionalidades.
- Testing.
- Decisiones técnicas.
- Limitaciones conocidas.
- Uso documentado de herramientas de inteligencia artificial.
- Evidencias visuales.
- Preparación de la entrega.

Identifica:

- Información desactualizada.
- Contradicciones.
- Explicaciones incompletas.
- Redundancias.
- Ausencia de información relevante.
- Descripciones que no se corresponden con la implementación.

Para cada problema documental indica el archivo, apartado y corrección recomendada.

No modifiques todavía la documentación.

---

## 9. Evaluación de capturas de pantalla y diagramas

El proyecto puede incluir capturas incorporadas a la documentación y otras imágenes todavía pendientes de valorar.

Localiza e inspecciona todas las imágenes accesibles y relevantes.

Para cada una, determina:

- Qué muestra.
- Qué funcionalidad o decisión técnica demuestra.
- Si aparece en la documentación.
- Si aporta evidencia relevante.
- Si está contextualizada.
- Si resulta redundante.
- Si está desactualizada.
- Si contiene información sensible.
- Dónde convendría incorporarla.

Clasifica las capturas según estas categorías:

- **A — Muy recomendable:** evidencia fundamental.
- **B — Recomendable:** mejora la comprensión.
- **C — Opcional:** valor complementario.
- **D — Prescindible:** redundante o irrelevante.

Presenta una tabla:

| Captura | Evidencia aportada | Incorporada actualmente | Clasificación | Recomendación |
|---|---|---|---|---|

Identifica también posibles capturas adicionales que serían útiles.

Prioriza evidencias de funcionamiento, arquitectura, relaciones de datos, pruebas, validaciones y resultados relevantes.

No recomiendes incorporar imágenes simplemente para aumentar la extensión de la documentación.

---

# PARTE II — EVALUACIÓN Y PLANIFICACIÓN DE MEJORAS

## 10. Identificación de problemas y oportunidades

A partir de la auditoría, elabora un inventario de hallazgos.

Diferencia expresamente:

1. Defectos funcionales confirmados.
2. Incumplimientos del enunciado.
3. Riesgos técnicos potenciales.
4. Problemas de mantenibilidad.
5. Carencias de pruebas.
6. Problemas documentales.
7. Mejoras de experiencia de usuario.
8. Optimizaciones opcionales.

Para cada hallazgo proporciona:

- Identificador.
- Título.
- Descripción.
- Evidencia concreta.
- Consecuencia.
- Propuesta de solución.
- Beneficio esperado.
- Complejidad.
- Riesgo de regresión.
- Prioridad.
- Carácter obligatorio u opcional.

### Escala de prioridad

**P0 — Crítica:** problemas que comprometen el funcionamiento esencial, la integridad de datos o la seguridad de forma grave.

**P1 — Alta:** incumplimientos importantes, defectos relevantes o problemas de fiabilidad con impacto significativo.

**P2 — Media:** mejoras justificadas de robustez, pruebas, mantenibilidad o experiencia de usuario.

**P3 — Baja:** ajustes menores, estéticos o complementarios.

No clasifiques una mejora como crítica sin evidencia suficiente.

---

## 11. Evaluación desde la perspectiva de una prueba técnica

Analiza el proyecto desde la perspectiva de un evaluador que recibe el enunciado, el código y la documentación.

Valora:

- Cumplimiento de requisitos.
- Calidad funcional.
- Arquitectura.
- Fiabilidad.
- Testing.
- Claridad del código.
- Facilidad de instalación.
- Documentación.
- Experiencia de usuario.
- Justificación de decisiones técnicas.
- Presentación general de la entrega.

Identifica fortalezas y debilidades que podrían influir en la evaluación.

No inventes criterios oficiales ni asignes puntuaciones arbitrarias.

Distingue entre criterios del enunciado y buenas prácticas generales de ingeniería de software.

---

## 12. Informe final de auditoría

Antes de iniciar cualquier proceso de modificación, presenta un informe estructurado con las siguientes secciones:

1. **Resumen ejecutivo:** propósito, funcionamiento y estado general del proyecto.
2. **Inventario técnico:** estructura, tecnologías y componentes.
3. **Funcionamiento de la aplicación:** casos de uso y flujos principales.
4. **Matriz de cumplimiento:** comparación con el enunciado.
5. **Evaluación técnica:** arquitectura, frontend, backend, persistencia y seguridad.
6. **Evaluación de testing:** cobertura y confiabilidad.
7. **Evaluación documental:** exactitud y posibles carencias.
8. **Análisis de capturas:** clasificación y recomendaciones.
9. **Problemas detectados:** defectos confirmados y riesgos diferenciados.
10. **Propuestas de mejora:** tabla priorizada.
11. **Fortalezas:** aspectos mejor resueltos.
12. **Plan recomendado:** secuencia lógica de mejoras.
13. **Conclusión:** valoración general y recomendaciones antes de la entrega.

Incluye además un resumen de:

- Cinco mejoras de mayor valor.
- Cinco fortalezas principales.
- Requisitos que necesitan atención.
- Capturas cuya incorporación sería recomendable.
- Aspectos pendientes de verificación.

El informe deberá redactarse íntegramente en español, con referencias a archivos y líneas cuando sea posible.

No generes archivos adicionales sin autorización.

### Punto de control obligatorio

**Una vez presentado el informe de auditoría, detente y solicita mi aprobación del plan de mejoras.**

No crees copias, modifiques archivos ni inicies implementaciones antes de recibir esa aprobación.

---

# PARTE III — PROTECCIÓN DEL PROYECTO

## 13. Creación de copia de seguridad

Una vez aprobado el plan de mejoras, la primera operación de escritura deberá consistir en crear una copia de seguridad completa del proyecto.

La carpeta de destino deberá llamarse exactamente:

`copia de seguridad ROAMS`

Y deberá ubicarse directamente en el escritorio de Windows.

### 13.1. Preparación

Antes de copiar:

1. Localiza la ruta absoluta del proyecto.
2. Identifica la ubicación real del escritorio.
3. Comprueba si el escritorio está redirigido a OneDrive.
4. Comprueba si existe una carpeta con el nombre indicado.
5. Identifica posibles archivos bloqueados, sensibles o de gran tamaño.
6. Revisa el estado actual del repositorio Git.
7. Presenta la ruta de origen y la ruta de destino.

Si la carpeta de destino ya existe, no sobrescribas su contenido. Propón una ubicación alternativa y solicita autorización.

### 13.2. Contenido de la copia

La copia deberá preservar el estado original de:

- Código fuente.
- Configuraciones.
- Documentación.
- Enunciado.
- Capturas.
- Pruebas.
- Esquemas.
- Migraciones.
- Archivos ocultos relevantes.
- Repositorio Git, si existe.
- Archivos locales necesarios para recuperar el proyecto, incluyendo datos y configuraciones pertinentes.

No excluyas elementos sin informar previamente.

### 13.3. Autorización

Antes de ejecutar la copia, muestra:

- Ruta de origen.
- Ruta de destino.
- Contenido previsto.
- Posibles excepciones.
- Método de copia.
- Procedimiento de verificación.

Termina preguntando:

**¿Autorizas la creación de la copia de seguridad del proyecto?**

No ejecutes ninguna operación de escritura hasta recibir autorización.

### 13.4. Verificación

Después de copiar:

1. Comprueba que existe el destino.
2. Compara la estructura de carpetas.
3. Compara los inventarios de archivos.
4. Comprueba tamaños.
5. Utiliza hashes cuando resulte apropiado.
6. Identifica diferencias.
7. Confirma si la copia es íntegra y recuperable.

No presentes una copia incompleta como válida.

La copia de seguridad deberá permanecer intacta durante el resto del proceso.

### Segundo punto de control obligatorio

Tras verificar la copia, presenta los resultados y solicita mi autorización para iniciar las modificaciones.

---

# PARTE IV — IMPLEMENTACIÓN PROGRESIVA Y SUPERVISADA

## 14. Conservación estricta de la arquitectura

Durante la implementación queda prohibido realizar modificaciones estructurales importantes sin autorización específica.

Debes evitar:

- Reorganizaciones masivas.
- Cambios de framework.
- Sustitución de tecnologías.
- Refactorizaciones extensas.
- Rediseños completos.
- Cambios injustificados de modelos de datos.
- Modificaciones incompatibles de API.
- Nuevas dependencias innecesarias.
- Alteraciones no solicitadas del comportamiento.
- Renombrados masivos.
- Cambios generales de formato.
- Eliminación de código funcional sin una razón demostrada.

La regla principal es:

**Resolver cada problema con el cambio mínimo razonable, respetando la implementación actual.**

Si una mejora requiere alterar la estructura fundamental, clasifícala como excepcional y solicita una decisión específica antes de proseguir.

---

## 15. Metodología de implementación paso a paso

Todas las mejoras se realizarán mediante pasos individuales.

Cada paso deberá tener un único objetivo principal y un alcance limitado.

### 15.1. Propuesta previa

Antes de ejecutar un paso presenta:

**PASO N — Título de la mejora**

| Campo | Información |
|---|---|
| Prioridad | P0, P1, P2 o P3 |
| Objetivo | Problema que se pretende resolver |
| Justificación | Motivo y evidencia |
| Archivos afectados | Rutas concretas |
| Modificación prevista | Descripción de los cambios |
| Beneficio esperado | Resultado |
| Riesgo | Bajo, medio o alto |
| Validación | Pruebas y comprobaciones previstas |
| Reversión | Método para deshacer el paso |

Indica explícitamente si la modificación afecta a código, pruebas, documentación o comentarios.

Termina preguntando:

**¿Autorizas que ejecute este paso?**

No ejecutes la modificación sin respuesta afirmativa.

### 15.2. Ejecución

Una vez autorizado:

1. Modifica únicamente los archivos aprobados.
2. Aplica el cambio mínimo necesario.
3. Conserva las convenciones existentes.
4. Evita modificaciones no relacionadas.
5. No avances a la siguiente mejora.
6. No realices commits automáticamente.
7. No alteres la copia de seguridad.

Si descubres que necesitas modificar archivos adicionales o ampliar el alcance, detente y solicita autorización.

### 15.3. Verificación

Después de ejecutar el cambio:

1. Revisa el diff.
2. Comprueba que no existen modificaciones accidentales.
3. Ejecuta las pruebas pertinentes cuando sea seguro.
4. Comprueba errores de tipado y compilación, cuando proceda.
5. Evalúa posibles regresiones.
6. Confirma que el comportamiento esperado se conserva.
7. Comunica cualquier limitación de la verificación.

No afirmes que una prueba se ha superado si no has obtenido un resultado verificable.

### 15.4. Informe posterior

Presenta:

- Qué se ha modificado.
- Archivos afectados.
- Motivo de la modificación.
- Resultado de las comprobaciones.
- Posibles incidencias.
- Estado de Git.
- Riesgos pendientes.

Después, detente y espera mi revisión.

**La autorización para ejecutar un paso no implica autorización para ejecutar otro.**

Solo después de que yo acepte el resultado podrás proponer el siguiente.

---

## 16. Política de modificaciones pequeñas

Prefiero varias mejoras localizadas antes que una refactorización extensa.

Ejemplos de intervenciones adecuadas:

- Corregir una validación.
- Resolver un caso límite.
- Mejorar un mensaje de error.
- Añadir una prueba relevante.
- Corregir una inconsistencia.
- Simplificar una función concreta.
- Eliminar una duplicación evidente.
- Mejorar el tratamiento de errores.
- Corregir una explicación documental.
- Incorporar comentarios importantes.

Evita aplicar modificaciones globales cuando una intervención puntual sea suficiente.

Si una mejora requiere numerosos archivos, estudia cómo dividirla en unidades independientes y verificables.

---

## 17. Mejora selectiva de comentarios en el código

Además de las correcciones técnicas y funcionales, deberás revisar progresivamente la documentación interna del código.

El objetivo es mejorar su comprensión sin aumentar innecesariamente su extensión.

### 17.1. Reglas

Los comentarios nuevos deberán:

1. Estar redactados en español.
2. Ser claros, concisos y profesionales.
3. Explicar el propósito o la justificación de una decisión.
4. Aportar información que no sea evidente leyendo el código.
5. Respetar el estilo del proyecto.
6. Mantenerse próximos a la lógica que explican.
7. Ser técnicamente correctos.

### 17.2. Conservación de comentarios existentes

Debes conservar los comentarios actuales que sean correctos y útiles.

No debes:

- Duplicar comentarios.
- Traducirlos indiscriminadamente.
- Eliminarlos por preferencias estilísticas.
- Añadir explicaciones redundantes.
- Comentar cada línea.
- Modificar funcionalidades por el simple hecho de añadir comentarios.

Si un comentario existente es incorrecto u obsoleto, informa del problema antes de proponer su corrección.

### 17.3. Áreas prioritarias

Comenta selectivamente:

- Reglas de negocio.
- Cálculos importantes.
- Algoritmos.
- Validaciones particulares.
- Relaciones entre entidades.
- Transformaciones de datos complejas.
- Casos límite.
- Procesos con varios pasos.
- Decisiones técnicas poco evidentes.
- Funciones cuya finalidad pueda resultar confusa.

Evita comentar imports, asignaciones sencillas, operaciones triviales o funciones autoexplicativas.

### 17.4. Integración con las mejoras

Cuando intervengas en un archivo, comprueba si sus secciones importantes requieren comentarios.

Si conviene añadirlos, inclúyelos expresamente en la propuesta del paso.

También puedes proponer pasos independientes de documentación interna para módulos que no requieran correcciones funcionales.

**No incorpores comentarios sin que formen parte del alcance autorizado.**

---

## 18. Pruebas y control de regresiones

La estabilidad de la aplicación tiene prioridad sobre cualquier optimización.

Antes de cada modificación, determina:

- Comportamiento actual.
- Resultado esperado.
- Pruebas existentes.
- Componentes afectados.
- Riesgos de regresión.

Después de cada modificación:

- Ejecuta las comprobaciones apropiadas.
- Verifica las reglas de negocio afectadas.
- Comprueba que los contratos entre componentes siguen siendo compatibles.
- Identifica fallos.
- Comunica los resultados reales.

Si una modificación provoca una regresión, detén el avance y presenta una propuesta de solución o reversión.

No elimines ni debilites pruebas para ocultar fallos.

No encadenes correcciones adicionales sin aprobación.

---

## 19. Mejoras documentales y evidencias visuales

Las mejoras de documentación deberán mantener la organización existente.

Puedes proponer:

- Corregir instrucciones desactualizadas.
- Aclarar decisiones técnicas.
- Mejorar explicaciones.
- Añadir información relevante.
- Eliminar redundancias.
- Incorporar capturas útiles.
- Mejorar la trazabilidad entre requisitos y funcionalidades.

Antes de añadir una captura, explica:

- Qué demuestra.
- Por qué resulta relevante.
- En qué documento encajaría.
- Qué texto debería acompañarla.
- Si sustituye a otra imagen.

No alteres el enunciado original ni incorpores imágenes innecesarias.

Cualquier modificación documental deberá seguir el mismo procedimiento de autorización individual.

---

## 20. Control de versiones

Utiliza Git como mecanismo de inspección y trazabilidad, si el proyecto dispone de repositorio.

Antes de modificar archivos, comprueba si existen cambios sin confirmar.

Después de cada paso, identifica:

- Archivos modificados.
- Archivos creados.
- Archivos eliminados.
- Diferencias introducidas.
- Resultado de pruebas.
- Estado del repositorio.

No ejecutes automáticamente:

- `git add`
- `git commit`
- `git push`
- `git reset`
- `git clean`
- Cambios de rama.
- Operaciones de reescritura del historial.

Estas acciones requieren autorización específica.

No modifiques el historial existente y no utilices comandos destructivos para solucionar problemas sin mi aprobación.

---

## 21. Gestión de incidencias y cambios de prioridad

Si durante una mejora detectas un nuevo problema:

1. Determina si es real.
2. Identifica su causa probable.
3. Evalúa su impacto.
4. Revisa si afecta al enunciado.
5. Propón una solución proporcionada.
6. Asigna prioridad.
7. Explica si conviene alterar el plan original.

No lo corrijas automáticamente.

Si existen varias soluciones, recomienda la más sencilla que garantice el comportamiento esperado.

Si una recomendación de la auditoría resulta innecesaria o incorrecta, explica por qué y propón descartarla.

Si el beneficio de una mejora no compensa su riesgo, recomienda posponerla.

---

## 22. Registro de progreso

Mantén un registro actualizado dentro de la conversación.

Utiliza esta estructura:

| Paso | Mejora | Prioridad | Archivos | Validación | Estado |
|---|---|---|---|---|---|

Estados admitidos:

- Pendiente de aprobación.
- Autorizado.
- Implementado y pendiente de revisión.
- Validado y aceptado.
- Bloqueado.
- Descartado.

No consideres aceptada una mejora hasta recibir mi confirmación.

No crees archivos adicionales para este registro sin autorización.

---

# PARTE V — SECUENCIA DE EJECUCIÓN Y CRITERIOS DE FINALIZACIÓN

## 23. Orden obligatorio de trabajo

Debes respetar estrictamente la siguiente secuencia.

### Fase A — Auditoría

1. Explora la carpeta completa.
2. Examina el código fuente.
3. Analiza la arquitectura.
4. Lee el enunciado.
5. Reconstruye el funcionamiento.
6. Evalúa requisitos.
7. Revisa pruebas.
8. Examina documentación.
9. Analiza capturas y diagramas.
10. Identifica problemas y mejoras.

Durante esta fase no debes modificar nada.

### Fase B — Informe y planificación

1. Presenta el informe completo.
2. Identifica fortalezas.
3. Prioriza problemas.
4. Propón mejoras.
5. Descarta cambios desproporcionados.
6. Define un orden de implementación.
7. Solicita aprobación del plan.

No avances sin autorización.

### Fase C — Copia de seguridad

1. Identifica origen y destino.
2. Comprueba la existencia de copias previas.
3. Presenta el procedimiento.
4. Solicita autorización.
5. Crea `copia de seguridad ROAMS`.
6. Verifica su integridad.
7. Comunica los resultados.
8. Solicita aprobación para iniciar cambios.

### Fase D — Implementación controlada

1. Presenta el primer paso.
2. Solicita autorización.
3. Ejecuta únicamente ese paso.
4. Revisa diferencias.
5. Comprueba el resultado.
6. Presenta evidencias.
7. Espera mi aceptación.
8. Propón el siguiente paso.

Repite esta secuencia para cada mejora.

### Fase E — Revisión final

Cuando se hayan completado las mejoras aprobadas, propone una revisión final para comprobar:

- Cumplimiento de requisitos.
- Funcionamiento general.
- Integridad de datos.
- Resultados de pruebas.
- Ausencia de regresiones.
- Coherencia de la documentación.
- Calidad de comentarios.
- Estado del repositorio.
- Preparación de la entrega.

Esta revisión tampoco deberá ejecutar modificaciones sin autorización.

---

## 24. Criterios de calidad

Una mejora se considerará técnicamente satisfactoria cuando:

- Resuelva el problema previsto.
- Mantenga el comportamiento correcto de las demás funcionalidades.
- Respete la arquitectura actual.
- Introduzca la mínima complejidad razonable.
- Mantenga la compatibilidad.
- No genere dependencias injustificadas.
- Esté suficientemente verificada.
- Sea comprensible para otro desarrollador.
- Mantenga coherencia con la documentación.
- Haya sido aceptada por el responsable del proyecto.

Cuando una condición no pueda verificarse, deberás indicarlo explícitamente.

---

## 25. Requisitos del comportamiento del asistente

Durante todo el procedimiento:

- Comunícate íntegramente en español.
- Mantén un tono técnico, claro y profesional.
- Sé riguroso y objetivo.
- No exageres problemas menores.
- No inventes resultados.
- No ocultes incertidumbres.
- No realices modificaciones silenciosas.
- No avances por iniciativa propia más allá del paso autorizado.
- No conviertas pequeñas correcciones en grandes refactorizaciones.
- Evita sobreingeniería.
- Prioriza la estabilidad y la mantenibilidad.
- Conserva las decisiones técnicas válidas.
- Explica siempre la justificación de los cambios relevantes.

Recuerda que el proyecto puede formar parte de una evaluación técnica y que cualquier modificación debe aportar un beneficio comprobable.

La prioridad no es introducir el mayor número posible de mejoras, sino **conseguir una implementación sólida, comprensible y correctamente documentada, con el menor riesgo posible**.

---

## 26. Instrucción de inicio

Comienza exclusivamente por la **Fase A — Auditoría**.

Tu primera actuación debe ser examinar la estructura de la carpeta y localizar el enunciado original, los módulos principales, las pruebas, la documentación y las capturas existentes.

Completa la auditoría y presenta sus conclusiones siguiendo las secciones establecidas.

Después, propón un plan de mejoras ordenado por prioridad y espera mi aprobación.

**No crees todavía la copia de seguridad ni modifiques ningún archivo.**

Una vez aprobado el plan, prepara la creación de la copia de seguridad, solicita autorización y verifica su integridad antes de comenzar las modificaciones.

Posteriormente, ejecuta únicamente las mejoras aprobadas, una por una, solicitando autorización antes de cada paso y esperando mi aceptación después de cada resultado.


**La supervisión humana, la preservación de la arquitectura y la estabilidad del proyecto son condiciones obligatorias durante todo el proceso.**
```

</details>

</details>

<br>

### Resultado del Prompt 2 — Informe de auditoría técnica de Codex

- **Herramienta:** Codex Desktop.
- **Tipo de revisión:** Auditoría estática del proyecto; sin ejecución de pruebas ni modificaciones durante la inspección inicial.
- **Nota de contexto:** Este informe refleja el estado del proyecto al realizarse la auditoría. Algunos problemas y cifras de pruebas quedaron superados por cambios posteriores; las verificaciones actualizadas constan en `04-development-log.md` y `05-quality-review.md`. Se han normalizado enlaces locales y niveles de encabezado para integrarlo en este documento.

<details>
<summary>Mostrar el resultado completo de la auditoría del Prompt 2</summary>

<br>

**1. Resumen ejecutivo**

SaaS-O-Matic es un prototipo full-stack para que un equipo comercial registre clientes corporativos y cree simulaciones mensuales de costes. Un frontend React consulta una API Express; el backend valida los datos, calcula tarifas progresivas e impuestos, y persiste clientes y simulaciones en SQLite mediante Prisma. La aplicación también consulta tipos de cambio para mostrar importes en otras divisas.

La solución implementa la mayor parte del flujo principal y separa razonablemente la interfaz, las rutas, los servicios, la facturación y la persistencia. Destacan la validación fiscal española, los importes guardados en céntimos y las instantáneas históricas de las simulaciones.

Hay dos carencias funcionales relevantes respecto al reto: la vista previa no convierte el importe a la divisa seleccionada y no muestra el desglose de cada tramo; además, la conversión solo contempla EUR, USD y GBP, aunque el enunciado menciona otras divisas disponibles. La documentación también presenta estados y cifras de pruebas contradictorios.

Alcance: examiné el enunciado, el documento de trabajo, los requisitos, la arquitectura, el README, el código fuente, los tests, las configuraciones y las capturas. No ejecuté la aplicación ni las pruebas. La auditoría es estática y no confirma el comportamiento en un navegador o entorno recién instalado. 2. Inventario del proyecto
La carpeta de la entrega incluye dos documentos, una carpeta de capturas y el proyecto [`saas-o-matic`](../README.md).
Área Organización y propósito
backend/src/modules/customers Registro, listado y validación de identificadores fiscales
backend/src/modules/simulations Validación, vista previa, creación e historial paginado
backend/src/modules/billing Tarifas progresivas, impuestos y conversión a céntimos
backend/src/modules/currency Consulta y caché de tipos de cambio, conversión
backend/src/middleware, lib Tratamiento de errores y cliente Prisma
backend/prisma Modelos SQLite y migraciones
frontend/src/features Formularios y componentes de clientes, simulaciones e historial
frontend/src/api, types Cliente HTTP, llamadas a la API y tipos compartidos
docs Requisitos, arquitectura y capturas de interfaz, diagramas y pruebas
ai-workspace Planificación, decisiones, prompts, bitácora y estrategia de calidad

El stack es React 19, TypeScript, Vite, Tailwind CSS y React Testing Library en frontend; Node.js, Express 5, Prisma, SQLite, Zod, decimal.js, Vitest y Supertest en backend. Cada lado tiene su propio package.json y archivo de bloqueo. Vite redirige /api a Express en localhost:3001, según la configuración de [`vite.config.ts`](../frontend/vite.config.ts) y el cliente en [`client.ts`](../frontend/src/api/client.ts).

La base de datos contiene Customer y Simulation, con relación uno a muchos y unicidad compuesta por país e identificador fiscal. La simulación almacena las entradas, instantáneas de plan/país/tasa y los importes en céntimos: [`schema.prisma`](../backend/prisma/schema.prisma).

El documento de Word contiene el reto original; el ODT es una transcripción de instrucciones y prompts de desarrollo, no otro enunciado de Roams. El directorio Nueva carpeta está vacío. Hay carpetas de dependencias y compilación que no consideré código fuente.

Estado local importante: git status muestra cambios sin confirmar en archivos de requisitos, pruebas y SimulationHistory, más un test nuevo sin seguimiento para CurrencySelector. No los alteré ni los atribuyo a esta auditoría; forman parte del estado actual que revisé. 3. Funcionamiento completo

1. Registro de cliente. CustomerForm envía nombre, identificador fiscal, email, país y plan a POST /customers. Zod valida y normaliza los datos; el servicio crea el registro con Prisma. Los errores de validación devuelven 400 y la combinación fiscal duplicada devuelve 409. La lista se actualiza tras el registro. Código: [`customer.routes.ts`](../backend/src/modules/customers/customer.routes.ts), [`customer.schema.ts`](../backend/src/modules/customers/customer.schema.ts), [`customer.service.ts`](../backend/src/modules/customers/customer.service.ts).
2. Búsqueda y selección. El frontend consulta GET /customers?search=…; el backend busca coincidencias en nombre o identificador fiscal. El listado dispone de estados de carga, error, reintento y vacío. El campo se rotula “Buscar clientes”, pero su sugerencia solo menciona el nombre de empresa: [`CustomerList.tsx`](../frontend/src/features/customers/CustomerList.tsx), [`customer.routes.ts`](../backend/src/modules/customers/customer.routes.ts).
3. Vista previa y guardado. SimulationForm valida localmente cliente, usuarios, GB y llamadas; envía una petición a POST /simulations/preview tras 300 ms de inactividad. El backend verifica el cliente, calcula la factura y no persiste la vista previa. Al confirmar, POST /simulations guarda los datos y el resultado. El historial se vuelve a cargar. Código: [`SimulationForm.tsx`](../frontend/src/features/simulations/SimulationForm.tsx), [`simulation.routes.ts`](../backend/src/modules/simulations/simulation.routes.ts), [`simulation.service.ts`](../backend/src/modules/simulations/simulation.service.ts).
4. Facturación. Los primeros 10 usuarios cuestan 10 € cada uno; los siguientes 40, 8 €; los restantes, 5 €. Starter, Professional y Enterprise no añaden cuota. Almacenamiento y llamadas se registran, pero no se cobran. Las tasas codificadas son 21 % para ES, 20 % para FR y 19 % para DE. El motor usa decimal.js, redondea el impuesto y persiste céntimos: [`billing.ts`](../backend/src/modules/billing/billing.ts).
5. Historial. GET /simulations?customerId=…&skip=… devuelve hasta diez registros ordenados por fecha e ID descendentes. La interfaz ofrece “Mostrar más”, deduplica resultados y descarta respuestas asíncronas de una selección anterior: [`SimulationHistory.tsx`](../frontend/src/features/simulations/SimulationHistory.tsx).
6. Conversión. El backend obtiene tasas de open.er-api.com, conserva USD y GBP en una caché de memoria de una hora, y usa tasas anteriores si falla una actualización. El selector está presente en simulaciones guardadas y entradas históricas; la vista previa interactiva se presenta solo en EUR. Código: [`currency.service.ts`](../backend/src/modules/currency/currency.service.ts), [`CurrencySelector.tsx`](../frontend/src/features/currency/CurrencySelector.tsx).
7. Cumplimiento del enunciado
   El enunciado original es Prueba Devs con IA (1).docx. Sus criterios se centran en planificación y diseño (35 %), criterio técnico y control de calidad (25 %), calidad del software (30 %) y README/despliegue (10 %).
   Requisito Origen Estado Evidencia y observaciones
   Frontend, backend REST y comunicación Requisitos técnicos Cumplido React/Vite, Express y proxy /api; no verificado ejecutando la aplicación.
   SQLite Requisitos técnicos Cumplido Prisma SQLite en el esquema.
   POST /customers y campos obligatorios Backend Cumplido Zod valida empresa, email, país y plan.
   Validación estricta del identificador español Backend Cumplido DNI, NIE y NIF de entidades mediante algoritmos de control en [`tax-id.ts`](../backend/src/modules/customers/tax-id.ts).
   POST /simulations y persistencia Backend Cumplido Verifica cliente y persiste parámetros, snapshots e importes.
   Tarifa progresiva 10 €/8 €/5 € Lógica de negocio Cumplido La fórmula implementada es acumulativa; cobertura automatizada declarada en tests y documentación, no ejecutada en esta auditoría.
   Impuestos según el país Lógica de negocio Parcialmente cumplido Se aplican tasas fijas para ES/FR/DE. El reto no especifica tasas ni reglas fiscales; son una decisión de diseño del proyecto, no una exigencia verificable del enunciado.
   Buscador por empresa o identificador fiscal Dashboard Parcialmente cumplido La API busca ambos campos; la interfaz admite texto libre, pero el texto de ayuda solo invita a buscar por empresa.
   Tarjetas de cliente e historial Dashboard Cumplido Tarjetas y selector de historial implementados.
   Simulación interactiva y actualización de factura Dashboard Parcialmente cumplido El slider y el campo numérico actualizan la vista previa EUR; falta conversión en esa vista y desglose visual por tramo.
   Conversión a EUR, USD, GBP y otras divisas API externa Parcialmente cumplido Solo están disponibles EUR/USD/GBP, no las demás tasas que expone la API. La conversión se muestra en resultados guardados, no en la vista previa.
   Capturar carga y errores de conversión Integración externa Cumplido Hay estados de carga, error, fecha y aviso de tasa obsoleta.
   Carpeta ai-workspace y evidencia del proceso Entregables Parcialmente cumplido Hay planes, decisiones, prompts y bitácora. Parte del registro se contradice o conserva estados antiguos; las capturas del repositorio no prueban por sí solas toda interacción con IA.
   README y despliegue local Entrega, 10 % Parcialmente cumplido Hay instrucciones locales para dos terminales y se reconoce que no hay configuración de despliegue productivo. Debe comprobarse desde una instalación limpia.

La tasa fiscal elegida y los planes sin cuotas se describen en requirements.md y 03-technical-decisions.md. El documento de trabajo afirma que hubo aclaraciones de Roams el 13/11/2026, pero no encontré en el inventario una evidencia original independiente de esa aclaración; la trato como decisión documentada por el proyecto, no como requisito incluido en el enunciado adjunto. 5. Análisis técnico
Arquitectura y backend. La separación por módulos de clientes, simulaciones, divisas y facturación es adecuada para el tamaño del reto. Validación, servicios y persistencia tienen límites reconocibles. Las rutas capturan explícitamente errores de validación y de dominio; Express pasa otros errores al middleware. La capa de servicios, sin embargo, importa directamente el singleton Prisma, por lo que las pruebas unitarias dependen de mocks o de la base de datos de integración.

Facturación y datos. El cálculo por tramos está expresado de forma legible y los valores monetarios persistidos son enteros en céntimos. Los snapshots preservan el contexto de cada cálculo. Las tasas son constantes duplicadas entre billing.ts y simulation.service.ts; hoy coinciden, pero una edición futura podría hacer divergir el cálculo y el dato histórico guardado. Los snapshots permiten conservar la tasa aplicada, aunque no el periodo de vigencia ni una configuración versionada.

Validaciones fiscales. La normalización elimina espacios externos y pasa a mayúsculas sin borrar separadores internos, como indican los requisitos internos. Francia y Alemania reciben validación de formato/longitud, no del dígito de control; esto está expresamente acotado en la especificación del proyecto. La comprobación algorítmica no prueba existencia, vigencia ni titularidad del identificador, y la documentación lo reconoce.

Frontend. Los componentes reflejan los flujos del dashboard, mantienen estados de espera/error y usan formularios controlados. En SimulationForm, el selector de moneda no está conectado a la vista previa. El historial muestra un selector de moneda por registro, lo que puede causar muchas peticiones de conversión al abrir un historial extenso. No observé pruebas de navegador extremo a extremo en el inventario.

Divisas. La respuesta de la API externa se valida antes de usarla y la conversión utiliza decimales. La caché y el fallback son sencillos y adecuados para un prototipo. No vi timeout explícito en la llamada externa. La caché es volátil: se pierde al reiniciar el backend y no se comparte entre procesos; esto figura como limitación en DT-015.

Seguridad y operación. No encontré autenticación, autorización, limitación de peticiones ni configuración de despliegue productivo. El reto plantea una herramienta interna, por lo que esto no es automáticamente un incumplimiento de la prueba, pero sí un riesgo si se publica o expone a una red compartida. El GET de clientes devuelve los datos de contacto e identificadores fiscales al cliente de la API. El middleware devuelve un mensaje genérico al usuario, aunque registra el error en consola. La configuración de producción está expresamente fuera del README actual. 6. Análisis de pruebas
Existe una batería amplia de pruebas unitarias y de integración en backend, además de pruebas de componentes en frontend. Los tests de integración usan una base de datos dedicada declarada en vitest.config.ts, crean datos y contienen limpieza posterior. Como esas operaciones escriben en SQLite, no ejecuté las pruebas ni comandos de build.

Las capturas [`backend-tests.png`](../docs/evidence/backend-tests.png) y [`frontend-tests.png`](../docs/evidence/frontend-tests.png) muestran ejecuciones anteriores con 402 pruebas de backend y 18 de frontend. El requirements.md actualmente modificado declara 446 y 26, respectivamente. El archivo de requisitos también menciona siete pruebas para CurrencySelector, que no aparece en la captura antigua; además, el estado local contiene cambios en tests y un test nuevo sin seguimiento. Por tanto, no se puede usar la captura como evidencia del conjunto actual ni confirmar las cifras más recientes sin una ejecución posterior. No afirmo que esos resultados actuales hayan pasado: solo que están documentados.

Hay contradicciones adicionales: [`05-quality-review.md`](../ai-workspace/05-quality-review.md) todavía marca como pendientes facturación, validación fiscal, integración e interfaz; [`04-development-log.md`](../ai-workspace/04-development-log.md) conserva un bloque inicial que califica como pendiente la API, los modelos y la interfaz, aunque luego registra su desarrollo. En cambio, requirements.md marca varias capacidades como implementadas y verificadas.

La cobertura parece centrarse en reglas, rutas, integración SQLite y componentes clave. No se encontró una cifra de cobertura de código, pruebas E2E reales ni evidencia visible de instalación limpia o de funcionamiento del proxy en producción. 7. Evaluación documental

- Enunciado: el DOCX identifica claramente el alcance y los porcentajes de evaluación. El ODT debe tratarse como material de proceso generado por el autor, no como fuente normativa.
- Requisitos: es una especificación amplia con criterios de aceptación, límites y aclaraciones. Su cabecera aún dice “borrador inicial, pendiente de resolver decisiones”, aunque hay secciones posteriores actualizadas y estados de implementación. El estado general necesita una revisión de consistencia.
- Arquitectura: explica frontend, backend, SQLite, relación, cálculo y conversiones, pero el diagrama y el modelo entidad-relación son representaciones simplificadas. No muestran todos los campos ni el servicio externo de divisas. La sección de pruebas da cifras antiguas frente a los requisitos actuales.
- README: explica el arranque local y el proxy; declara que no incluye despliegue productivo. La descripción inicial dice que la búsqueda es por nombre de empresa, aunque el backend busca también el identificador fiscal.
- AI workspace: tiene decisiones y registros útiles. Sin embargo, el log del proceso no es plenamente coherente con el estado de la aplicación ni con la tabla de calidad. Conviene conservar las transcripciones reales que sustenten las afirmaciones sobre interacción con IA y aclaraciones externas, sin reconstruir conversaciones retrospectivamente.

8. Auditoría de capturas
   Revisé las capturas enlazadas en documentación, las imágenes de evidencia de ai-workspace y las 24 imágenes fechadas bajo Capturas. Las imágenes de flujo fechadas son diagramas explicativos, no capturas de conversación con IA.
   Captura Qué demuestra y si está documentada Prioridad Ubicación recomendada
   docs/evidence/dashboard.png (también Capturas/Guardadas/dashboard.png) Dashboard completo, listado, formulario, preview e historial; sí, en README. Usa datos de demostración. A README, sección de interfaz
   docs/evidence/billing-preview.png (también Guardadas) Preview a 60 usuarios: 470 € + 20 % = 564 €; sí, en arquitectura. A README o requisitos de facturación
   docs/evidence/backend-tests.png (también Guardadas) 402 pruebas en 18 archivos, captura anterior al estado actual. B, actualizar Sección de pruebas, tras nueva ejecución
   docs/evidence/frontend-tests.png (también Guardadas) 18 pruebas en 4 archivos, anterior al test nuevo y a cambios posteriores. B, actualizar Sección de pruebas, junto a backend
   docs/evidence/architecture-diagram.png Flujo de Vite, Express, validación y Prisma; documentada. No representa divisas/API externa. B docs/architecture.md, actualizar diagrama
   docs/evidence/customer-simulation-diagram.png Entidades Customer–Simulation, pero con campos incompletos; documentada. B, actualizar docs/architecture.md, junto al esquema
   Capturas/Guardadas/arquitectura.png Arquitectura con clientes, simulaciones, facturación y divisas; menos detalle del proxy y API externa. B Reemplazar o fusionar con diagrama de arquitectura
   Capturas/Guardadas/01-project-structure.png Explorador de VS Code y estructura; sí, en ai-workspace/evidence. C Anexo del proceso
   Capturas/Guardadas/02-github-repository.png Repositorio privado y perfil visible; sí, en ai-workspace/evidence. Revisar identificador de cuenta antes de compartir públicamente. C Anexo, solo si se desea acreditar publicación
   Capturas/Guardadas/03-frontend-build.png Build del frontend, según captura; sí, en ai-workspace/evidence. B Sección de verificación técnica
   Capturas/Guardadas/04-prisma-validation.png Validación del esquema Prisma; sí, en ai-workspace/evidence. B Sección de verificación técnica
   Captura 2026-11-16 172020.png Diagrama de POST /customers, validación y respuestas 400/409/201; no aparece enlazado en docs. B Requisitos, flujo de registro
   Captura 2026-11-16 141600.png Selección desde tarjeta y navegación al historial; no enlazada. C Anexo de frontend
   Captura 2026-11-16 140643.png Boceto de distribución a 1/2/3 columnas; no es prueba visual de la app ejecutándose. C Notas responsive, no como evidencia final
   Captura 2026-11-16 125946.png Contrasta preview sin persistencia y creación persistida; no enlazada. B Sección de simulación
   Captura 2026-11-13 181633.png Flujo de conversión React→API→backend y respuesta; no enlazada. B Sección de divisas
   Captura 2026-11-13 172109.png Diagrama de caché válida/vencida y fallback; no enlazada. B Arquitectura de divisas
   Captura 2026-11-13 165824.png, 164640.png, 160616.png Diagramas de actualización del listado al registrar cliente; repetitivos. C Elegir una sola para anexo
   Captura 2026-11-13 163947.png, 163417.png Flujo de creación de simulación y actualización de resultado/historial; se solapan. B Elegir una para explicar el ciclo
   Captura 2026-11-13 162124.png, 161001.png Capturas de interfaz inicial: formulario y clientes sin registros; posiblemente desactualizadas. C Historial del diseño, no como estado final
   Captura 2026-11-13 160834.png Diagrama del flujo de registro y actualización; solapa con capturas anteriores. C Anexo si se necesita una evidencia del flujo
   Captura 2026-11-13 151858.png Diagrama del proxy Vite/Express local; no enlazado. B Arquitectura
   Captura 2026-11-13 141440.png, 140554.png Diagramas internos del procesamiento y persistencia de simulación; no enlazados. C Elegir uno para anexo
   Captura 2026-11-12 215606.png Diagrama mínimo de relación 1:N; redundante frente al ER de documentación. D Prescindible
   Captura 2026-11-12 140521.png Resumen de carpetas principales; repetido por la captura de estructura. D Prescindible
   Captura 2026-11-12 134724.png Recomendación de extensiones de VS Code, no arquitectura ni verificación del producto. C Solo documentación de entorno
   Captura 2026-11-12 134353.png, 134334.png, 134323.png, 134306.png Guía de instalación de herramientas y comprobación de versiones; útil como proceso inicial, no como evidencia funcional. C Anexo de preparación

Las capturas más útiles para la entrega son el dashboard, una vista previa, una ejecución actualizada de pruebas y diagramas revisados de arquitectura/entidades. Añadiría una captura real del selector USD/GBP funcionando, otra de una validación fiscal rechazada y otra de búsqueda por identificador fiscal. Antes de publicar, comprobaría que los datos de clientes mostrados sean ficticios. 9. Problemas detectados
Confirmados por el código o por la documentación

1. La vista previa interactiva no ofrece conversión de divisa. SimulationForm renderiza los importes en EUR y no incluye CurrencySelector; el selector está en resultados guardados e historial. Incumple parcialmente el flujo de simulación en moneda seleccionada.
2. No se expone el desglose por tramos en la interfaz. El backend devuelve el coste agregado de usuarios; el preview y el resultado presentan ese total, subtotal e impuesto, no la cantidad facturada en cada tramo.
3. La conversión está limitada a dos divisas extranjeras. Los tipos y el esquema admiten EUR/USD/GBP; no hay selección de otras tasas disponibles en la respuesta externa.
4. Evidencias de pruebas desactualizadas y cifras discordantes. Las imágenes indican 420 pruebas totales; el requirements.md modificado afirma 472. architecture.md mantiene las cifras antiguas.
5. Documentación de calidad y registro de desarrollo tienen estados obsoletos. Algunas funciones aparecen como pendientes aunque el código ya está presente, mientras otros apartados declaran pruebas superadas.
6. El README y la interfaz describen incompletamente la búsqueda. La API busca identificador fiscal, pero el placeholder y la descripción del README hablan solo de empresa.
7. El diagrama entidad-relación no refleja el esquema actual. Omite campos de snapshots, costes e inputs de simulación y presenta un modelo muy reducido.
   Riesgos o limitaciones, no defectos bloqueantes demostrados

- La llamada externa de divisas no muestra timeout; una respuesta lenta puede prolongar el estado de carga.
- La caché de tasas reside solo en memoria; un reinicio elimina las últimas tasas.
- No se observan autenticación, control de acceso ni limitación de solicitudes. Para un prototipo local puede ser aceptable; para despliegue compartido requiere definición.
- GET /customers no pagina clientes y el historial usa skip sin límite máximo. El impacto depende del volumen esperado.
- Las tasas fiscales están fijadas en código y no cubren exenciones ni casos fiscales particulares. El alcance se documenta como simplificado.
- Las pruebas de integración escriben y borran datos en test.db; deben seguir aisladas y verificarse en un entorno limpio antes de una entrega final.

10. Propuestas de mejora
    Prioridad y ámbito Evidencia / consecuencia Propuesta conceptual Impacto, complejidad y riesgo Obligatoria
    P1 · Interfaz / cumplimiento Preview EUR-only en SimulationForm; la divisa no sigue la selección durante la simulación. Incorporar una selección de moneda compartida y aplicar la conversión al total de preview, manteniendo EUR como base. Alto; media; riesgo medio por estados asíncronos y tasas obsoletas. Sí, para cumplir el flujo descrito
    P1 · Interfaz / cumplimiento No se muestran importes por tramo. Devolver y presentar cantidades e importes de cada tramo, usando el mismo motor del backend. Alto; baja-media; riesgo bajo si se deriva del cálculo existente. Sí, si se interpreta literalmente el requisito de desglose
    P1 · Cumplimiento Tipos limitados a EUR/USD/GBP. Permitir seleccionar otras divisas presentes y validadas en la respuesta del proveedor, con lista segura de códigos. Medio-alto; media; riesgo medio por disponibilidad/formato. Sí, por “otras divisas disponibles”
    P1 · Documentación Evidencia 402/18 frente a cifras nuevas 446/26; documentación de arquitectura y calidad no sincronizada. Ejecutar posteriormente la batería autorizada y actualizar una única fuente de cifras, capturas y estados. Alto para evaluación; baja; riesgo bajo. Sí, para sostener afirmaciones de calidad
    P1 · Entrega README solo describe búsqueda por empresa y no documenta despliegue real. Documentar búsqueda fiscal, límites del prototipo y pasos reproducibles para entrega/despliegue. Medio; baja; riesgo bajo. Sí en claridad; despliegue productivo no está explícito como requisito funcional
    P2 · Divisas Sin timeout explícito y caché efímera. Establecer timeout y documentar/considerar persistencia según necesidad de disponibilidad. Medio; baja-media; riesgo bajo-medio. Opcional
    P2 · Seguridad No hay autenticación/autorización visible; se exponen datos fiscales y emails a cualquier consumidor de la API. Definir el escenario de despliegue; proteger endpoints si se expone fuera de un entorno local confiable. Alto si se publica; media-alta; riesgo medio. No explícita para el reto
    P2 · Escalabilidad Clientes sin paginación; historial por offset. Añadir límite/paginación de clientes y evaluar cursor para historial si crece el volumen o hay escrituras concurrentes. Medio; media; riesgo medio. Opcional
    P2 · Arquitectura Tasas fiscales repetidas en dos módulos. Centralizar la configuración fiscal para cálculo y snapshot. Medio; baja; riesgo bajo. Calidad opcional
    P3 · Evidencias Capturas redundantes y diagramas simplificados; captura de repositorio muestra identidad de cuenta. Elegir un conjunto pequeño de capturas actuales, actualizar diagramas y revisar datos antes de compartir. Medio; baja; riesgo bajo. No funcional

11. Plan de mejora recomendado
12. Primera etapa: cumplimiento. Añadir la conversión y el desglose por tramo al preview; decidir el alcance de “otras divisas” y completarlo.
13. Segunda etapa: robustez y pruebas. Definir timeout/caché de divisas, revisar seguridad según el entorno previsto y mantener pruebas aisladas. Ejecutar las comprobaciones solo cuando se autorice.
14. Tercera etapa: documentación y evidencias. Sincronizar requisitos, arquitectura, README, bitácora y calidad; sustituir capturas obsoletas y corregir diagramas.
15. Cuarta etapa: mejoras opcionales. Considerar paginación de clientes, cursores de historial y configuración centralizada de tasas.
    No implementé ninguna de estas propuestas.
16. Valoración final
    Para una prueba técnica, el proyecto muestra buen criterio de separación modular y atención a la lógica central de facturación, a la validación fiscal y a la persistencia histórica. La vista previa sin persistencia y el manejo de estados asíncronos del historial son decisiones útiles y proporcionadas.

Antes de entregar, resolvería la conversión y el desglose dentro del flujo interactivo, completaría la selección de divisas requerida y alinearía toda la documentación con el estado real. Las tasas fiscales deben presentarse claramente como la simplificación adoptada para el proyecto, no como una regla fijada por el enunciado. También conviene tener evidencia actual y reproducible de las pruebas; las imágenes disponibles son históricas.

La ausencia de autenticación o despliegue no invalida por sí sola el reto local, pero debe tratarse antes de exponer la aplicación con datos reales. No puedo confirmar instalación, builds, pruebas ni comportamiento visual actual mediante esta auditoría sin ejecución. 13. Resumen para la toma de decisiones
Las cinco mejoras con más valor: conversión de la vista previa; desglose visible por tramos; soporte de más divisas disponibles; sincronización de documentación y cifras; README con búsqueda fiscal y alcance de despliegue claros.

Cinco aspectos mejor resueltos: separación de frontend/backend; fórmula acumulativa legible; validación algorítmica de identificadores españoles; almacenamiento monetario en céntimos; snapshots históricos y paginación de simulaciones.

Requisitos que requieren atención: moneda y desglose en preview, otras divisas disponibles, documentación de búsqueda por identificador fiscal, evidencia actualizada de pruebas y consistencia del AI workspace.

Capturas recomendadas: dashboard y preview actuales, pruebas recientes de ambos proyectos, un ejemplo de conversión USD/GBP y validación fiscal, diagrama de arquitectura que incluya el proveedor externo y un ER completo. Evitar duplicar las capturas de instalación y los diagramas repetidos.

No verificable en esta auditoría: que la versión actual pase las pruebas/builds; instalación desde cero; funcionamiento real en navegador; comportamiento responsive actual; validez administrativa de identificadores; exactitud fiscal para situaciones reales; y procedencia externa de las aclaraciones fiscales/comerciales.

Recomendación: priorizar las carencias de moneda y presentación de tarifas, luego regenerar evidencia de pruebas y actualizar la documentación. Mantener anotados como decisiones propias los países, tasas fiscales y simplificaciones de planes/consumos.

</details>

### Prompt 3 — Rediseño y mejora de la interfaz principal

- **Fecha original:** 18/11/2026
- **Herramienta:** Codex Desktop.
- **Objetivo:** Mejorar la experiencia visual y funcional del dashboard mediante cambios progresivos, preservando las funcionalidades, la arquitectura y las reglas de negocio.

<details>
<summary>Mostrar el prompt completo</summary>

````text
# Rediseño y mejora de la interfaz principal de Saas-O-Matic

## 1. Contexto y objetivo

Actúa como un **desarrollador Full-Stack sénior especializado en React, TypeScript, Tailwind CSS, diseño UI/UX y arquitectura de aplicaciones web**.

Estoy desarrollando una aplicación denominada **SaaS-O-Matic (Dynamic Billing & Subscription Optimizer)** como parte de una prueba técnica para el puesto de Full-Stack AI-Augmented en Roams.

El proyecto está prácticamente finalizado y sus principales funcionalidades se encuentran implementadas.

Tu objetivo es realizar una **mejora visual y funcional de la vista principal de la aplicación**, transformándola en un dashboard más moderno, profesional, atractivo, intuitivo y consistente.

La estética deseada es la de un dashboard SaaS actual, con una interfaz oscura elegante, buena jerarquía visual, tarjetas bien diseñadas, elementos interactivos claros y una distribución que facilite el uso de la aplicación.

**No quiero reconstruir la aplicación desde cero ni cambiar su arquitectura. Quiero mejorar lo que ya existe.**

El resultado debe mantener todas las funcionalidades actuales y aumentar la calidad percibida del producto, especialmente de cara a su evaluación en la prueba técnica.

---

## 2. Ubicación y tecnologías del proyecto

El proyecto se encuentra en:

`saas-o-matic/`

Su estructura principal es:

```text
saas-o-matic/
├── ai-workspace/
├── backend/
├── docs/
├── frontend/
└── README.md
```

Stack tecnológico:

**Frontend**
- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- Vitest.
- React Testing Library.

**Backend**
- Node.js.
- Express.
- TypeScript.
- Prisma ORM.
- SQLite.
- Zod.

Utiliza preferentemente las herramientas, componentes y dependencias ya instalados.

Evita introducir nuevas bibliotecas de componentes, iconos, animaciones o estilos salvo que sea estrictamente necesario y esté justificado.

---

## 3. Análisis previo obligatorio

Antes de modificar cualquier archivo, realiza una auditoría visual y funcional de la interfaz actual.

Revisa especialmente:

- La estructura general del frontend.
- El componente principal de la aplicación.
- La disposición de las secciones del dashboard.
- Los formularios de creación de clientes.
- El listado y las tarjetas de clientes.
- El formulario de simulación de facturación.
- La vista previa de resultados.
- El historial de simulaciones.
- El selector de divisas.
- Los estados de carga, error y ausencia de datos.
- Los estilos globales y las clases de Tailwind existentes.
- Las pruebas automatizadas que puedan verse afectadas.

Identifica qué componentes pueden mejorarse visualmente sin modificar su comportamiento.

Antes de comenzar, presenta un resumen de:

1. Estado actual de la interfaz.
2. Principales problemas visuales o de usabilidad.
3. Mejoras propuestas.
4. Archivos que necesitarás modificar.
5. Posibles riesgos.
6. Orden recomendado de implementación.

No realices modificaciones hasta completar este análisis.

---

## 4. Dirección visual del rediseño

Quiero una apariencia inspirada en los dashboards SaaS modernos.

### 4.1. Estilo general

Utiliza una estética **dark mode profesional**, similar a los paneles de administración de productos tecnológicos.

Características deseadas:

- Fondo principal en tonos azul oscuro o gris pizarra.
- Tarjetas con fondos ligeramente más claros.
- Bordes discretos para delimitar secciones.
- Azul como color principal de acciones.
- Tipografía clara y fácil de leer.
- Espaciados consistentes.
- Esquinas moderadamente redondeadas.
- Sombras sutiles cuando aporten profundidad.
- Transiciones discretas en botones e interacciones.
- Buen contraste entre texto, fondos y controles.

Como referencia orientativa, puedes utilizar estos colores:

| Elemento | Color |
|---|---|
| Fondo principal | `#0F172A` |
| Superficies y tarjetas | `#1E293B` |
| Bordes | `#334155` |
| Azul principal | `#2563EB` |
| Azul de interacción | `#3B82F6` |
| Texto principal | `#F8FAFC` |
| Texto secundario | `#94A3B8` |
| Estados positivos | `#22C55E` |
| Errores | `#F87171` |

Estos valores son orientativos. Puedes ajustarlos para conseguir un resultado más equilibrado y aprovechar los estilos existentes.

**Evita un diseño excesivamente colorido, recargado o con efectos visuales innecesarios.**

### 4.2. Consistencia visual

Establece un criterio uniforme para:

- Tamaños y pesos de títulos.
- Espaciado entre secciones.
- Espaciado interior de tarjetas.
- Campos de formulario.
- Botones principales y secundarios.
- Bordes y radios.
- Mensajes de información.
- Estados de carga y error.
- Elementos seleccionados.
- Colores de texto.

El resultado debe parecer una aplicación diseñada como un conjunto coherente, no una colección de componentes independientes.

---

## 5. Mejorar la cabecera principal

Rediseña la cabecera para ofrecer una primera impresión más profesional.

Debe incluir, si encaja con la estructura existente:

- Nombre de la aplicación: **SaaS-O-Matic**.
- Subtítulo o descripción breve de su finalidad.
- Identidad visual sencilla y coherente.
- Una separación visual clara respecto al contenido principal.

Considera incorporar un pequeño icono geométrico o símbolo relacionado con facturación, simulación o gestión SaaS.

No es necesario crear un logotipo complejo ni añadir una dependencia exclusivamente para este fin.

Evita mostrar botones o controles que no tengan una funcionalidad real.

---

## 6. Mejorar la organización del dashboard

Quiero que el contenido principal tenga una distribución más clara y agradable.

Organiza la interfaz mediante secciones visualmente diferenciadas, manteniendo el flujo funcional actual.

Por ejemplo:

1. Cabecera e introducción.
2. Resumen general, si existen datos adecuados.
3. Gestión y búsqueda de clientes.
4. Creación de clientes.
5. Simulador de facturación.
6. Resultados y vista previa.
7. Historial de simulaciones.

Este orden es orientativo. Analiza las dependencias actuales y determina la disposición que ofrezca la mejor experiencia.

### 6.1. Evitar pantallas excesivamente largas

Si el dashboard contiene muchos formularios y componentes, estudia formas sencillas de organizar mejor la información.

Puedes valorar:

- Secciones con encabezados claros.
- Separaciones visuales.
- Paneles desplegables.
- Distribuciones por bloques.
- Navegación interna sencilla.

No introduzcas pestañas, menús laterales o mecanismos de navegación complejos si no mejoran realmente la experiencia.

**Prioriza la simplicidad y la facilidad de uso.**

---

## 7. Tarjetas de resumen del dashboard

Valora incorporar una pequeña sección de indicadores generales en la parte superior.

Posibles métricas:

- Número total de clientes registrados.
- Número total de simulaciones guardadas.
- Número de planes SaaS disponibles.
- Información reciente de actividad, si puede obtenerse fácilmente.

Estas tarjetas deben tener:

- Una cifra o dato destacado.
- Una etiqueta descriptiva.
- Un icono discreto, si es apropiado.
- Una apariencia consistente con el resto del dashboard.

**Condiciones importantes:**

- No utilizar datos ficticios.
- No mostrar estadísticas que no puedan calcularse correctamente.
- No añadir endpoints ni consultas costosas únicamente por motivos estéticos.
- No confundir resultados históricos almacenados con simulaciones temporales de vista previa.
- Si una métrica requiere cambios importantes en el backend, descártala y propón una alternativa sencilla.

Estas tarjetas son una mejora opcional, no un requisito obligatorio.

---

## 8. Mejorar las tarjetas de clientes

El listado de clientes es una parte importante de la aplicación.

Quiero mejorar su diseño para que sea más legible, moderno y fácil de utilizar.

### 8.1. Mantener la disposición vertical

**Esta condición es obligatoria.**

Actualmente prefiero que las tarjetas de clientes aparezcan una debajo de otra.

No quiero transformar el listado en una cuadrícula de dos o tres columnas.

Mantén la disposición vertical tanto en pantallas grandes como pequeñas, ajustando únicamente el ancho y los espacios necesarios para conseguir un diseño responsive.

### 8.2. Mejoras visuales

Cada tarjeta debe destacar claramente:

- Nombre de la empresa.
- País.
- Identificador fiscal.
- Plan SaaS.
- Acción para consultar su historial.

Puedes utilizar:

- Un pequeño icono o avatar con la inicial de la empresa.
- Etiquetas discretas para país y plan.
- Una distribución más limpia de los datos.
- Mayor jerarquía visual para el nombre.
- Un botón de historial más consistente.
- Efectos hover sutiles.

Mantén toda la información exigida por los requisitos.

### 8.3. Búsqueda de clientes

Mejora visualmente el buscador:

- Campo claramente identificable.
- Placeholder descriptivo.
- Estados de enfoque visibles.
- Espaciado adecuado.
- Buena experiencia en dispositivos móviles.

No modifiques las reglas de búsqueda ni el comportamiento de la API.

---

## 9. Mejorar el formulario de creación de clientes

Revisa la presentación del formulario para hacerlo más intuitivo.

Mejoras deseadas:

- Etiquetas claras.
- Campos alineados.
- Agrupación lógica de información.
- Espaciado consistente.
- Indicaciones de validación comprensibles.
- Botón principal destacado.
- Mensajes de éxito y error legibles.
- Estados de envío claramente identificables.

Conserva las validaciones existentes de identificadores fiscales y las reglas de negocio.

No elimines campos ni alteres los formatos admitidos.

---

## 10. Mejorar el simulador de facturación

El simulador es una de las funcionalidades más importantes de SaaS-O-Matic y debería tener un papel visual destacado.

### 10.1. Organización de parámetros

Mejora la presentación de:

- Cliente seleccionado.
- Número de usuarios activos.
- Control deslizante de usuarios.
- Almacenamiento utilizado.
- Llamadas a la API.
- Información del plan SaaS.
- Acciones para calcular o guardar simulaciones.

Los controles deben estar alineados, ser fáciles de comprender y funcionar correctamente en distintos tamaños de pantalla.

**Mantén la sincronización existente entre el slider y el campo numérico de usuarios.**

### 10.2. Vista previa de facturación

Destaca visualmente el resultado económico.

El total mensual debe ser uno de los elementos visuales principales de esta sección.

Presenta de forma ordenada:

- Coste de usuarios.
- Desglose de tramos, cuando corresponda.
- Subtotal.
- Tipo impositivo.
- Importe de impuestos.
- Total mensual.
- Divisa de visualización.

Diferencia claramente los importes de los datos informativos.

Los planes SaaS, el almacenamiento y las llamadas a la API no deben presentarse como costes adicionales si las reglas actuales establecen que son únicamente informativos.

### 10.3. Diferenciar vista previa y simulación guardada

El usuario debe comprender fácilmente la diferencia entre:

- Visualizar una estimación.
- Guardar una simulación.

Puedes mejorar los textos, la disposición de botones y los mensajes informativos para evitar confusiones.

No alteres el comportamiento de persistencia.

La vista previa debe seguir funcionando sin crear registros.

---

## 11. Mejorar el historial de simulaciones

Revisa la presentación de las simulaciones guardadas.

Mejoras recomendadas:

- Tarjetas con mayor claridad visual.
- Fecha de la simulación legible.
- Total mensual destacado.
- Desglose económico organizado.
- Mejor separación entre simulaciones.
- Estados de carga y listado vacío bien diferenciados.
- Paginación clara y accesible.

Conserva el comportamiento actual del desplegable **«Ver detalles»**.

No elimines datos históricos ni modifiques los importes almacenados.

---

## 12. Mejorar el selector de divisas

Mantén la conversión entre:

- EUR.
- USD.
- GBP.

Mejora su integración visual en el bloque de resultados.

Debe continuar mostrando:

- Importe original en EUR.
- Importe convertido.
- Tipo de cambio, cuando corresponda.
- Fecha de las tasas, si está disponible.
- Advertencia cuando se utilicen tasas desactualizadas.
- Mensajes de error cuando falle la conversión.

La divisa seleccionada debe afectar únicamente a la visualización.

**No modifiques los cálculos de facturación ni los importes almacenados.**

---

## 13. Estados de interfaz y accesibilidad

Quiero prestar especial atención a los pequeños detalles que mejoran la experiencia de usuario.

### Estados de carga

Los mensajes de carga deben ser visibles, claros y coherentes.

Puedes mejorar su apariencia con indicadores sencillos, siempre que no compliquen el código innecesariamente.

### Estados vacíos

Cuando no existan clientes o simulaciones, muestra mensajes comprensibles y visualmente integrados.

### Errores

Los errores deben:

- Diferenciarse visualmente del contenido normal.
- Explicar qué ha ocurrido de forma comprensible.
- Mantener disponibles las acciones de recuperación cuando existan.

### Accesibilidad

Comprueba:

- Contraste de colores.
- Etiquetas de formularios.
- Navegación por teclado.
- Estados de foco visibles.
- Tamaño adecuado de botones.
- Uso correcto de elementos HTML semánticos.
- Mensajes de estado accesibles.

Evita depender exclusivamente del color para transmitir información.

---

## 14. Diseño responsive

La interfaz debe adaptarse correctamente a:

- Pantallas de escritorio.
- Portátiles.
- Tabletas.
- Dispositivos móviles.

Presta especial atención a:

- Desbordamientos horizontales.
- Campos demasiado estrechos.
- Botones difíciles de pulsar.
- Textos cortados.
- Etiquetas que ocupan demasiado espacio.
- Resultados económicos difíciles de leer.

No es necesario que todas las secciones adopten la misma distribución en cada tamaño de pantalla.

**Recuerda que el listado de clientes debe conservar su organización vertical.**

---

## 15. Restricciones técnicas obligatorias

Durante el rediseño:

1. No cambies la estructura fundamental del proyecto.
2. No modifiques los endpoints del backend.
3. No cambies las reglas de facturación.
4. No alteres las fórmulas monetarias.
5. No modifiques los impuestos.
6. No cambies el esquema de Prisma ni las migraciones.
7. No alteres la persistencia de simulaciones.
8. No elimines funcionalidades existentes.
9. No elimines pruebas automatizadas.
10. No sustituyas la arquitectura por otra.
11. No introduzcas dependencias sin necesidad.
12. No realices una refactorización masiva.
13. No utilices datos ficticios en la aplicación.
14. No modifiques documentación que no esté relacionada con el rediseño.

Prioriza cambios localizados en los componentes del frontend y sus estilos.

Si detectas un problema funcional que no esté relacionado con el rediseño, documéntalo en lugar de modificarlo automáticamente.

---

## 16. Estrategia de implementación

Quiero que trabajes de forma progresiva, pero sin dividir el proceso en un número excesivo de pasos.

Organiza las mejoras en bloques funcionales.

### Bloque 1. Estilos generales y cabecera

- Unificar la identidad visual.
- Mejorar la cabecera.
- Ajustar los contenedores y espaciados principales.

### Bloque 2. Gestión de clientes

- Mejorar el buscador.
- Rediseñar las tarjetas verticales.
- Mejorar el formulario de registro.

### Bloque 3. Simulador

- Organizar visualmente los controles.
- Destacar los resultados económicos.
- Diferenciar la vista previa del guardado.

### Bloque 4. Historial y divisas

- Mejorar la presentación de las simulaciones.
- Refinar el desplegable de detalles.
- Integrar visualmente la conversión de divisas.

### Bloque 5. Verificación final

- Comprobar el diseño responsive.
- Revisar la accesibilidad.
- Ejecutar las pruebas.
- Verificar la compilación.
- Documentar los cambios realizados.

Puedes adaptar la organización si encuentras una secuencia más adecuada.

---

## 17. Metodología de trabajo y supervisión

Quiero conservar el control sobre los cambios, pero también avanzar de manera eficiente.

Por tanto:

1. Analiza primero el proyecto.
2. Presenta una propuesta de rediseño.
3. Identifica los archivos que vas a modificar.
4. Explica brevemente las mejoras previstas.
5. Espera mi autorización antes de comenzar los cambios.
6. Una vez autorizado, implementa las mejoras por bloques.
7. Dentro de cada bloque, puedes realizar varios cambios relacionados sin solicitar confirmación después de cada línea.
8. Al terminar cada bloque, explica qué has modificado.
9. Ejecuta las comprobaciones pertinentes.
10. Espera mi aprobación antes de comenzar el siguiente bloque.

Evita solicitar confirmación para acciones triviales.

Quiero supervisar los cambios importantes, no cada pequeña modificación.

---

## 18. Pruebas y validación

Después de cada bloque importante, ejecuta las pruebas relacionadas con los componentes modificados.

Al finalizar todo el rediseño, ejecuta las comprobaciones generales disponibles en el proyecto.

Como mínimo:

**Frontend**

```bash
cd frontend
npx vitest run
npm run build
```

**Backend**

Si se ha mantenido sin cambios, no es necesario repetir sus pruebas después de cada modificación visual.

Para la verificación final, utiliza los scripts generales del repositorio cuando estén disponibles y sean apropiados.

Comprueba también:

- Que la aplicación se ejecuta correctamente.
- Que se pueden crear y buscar clientes.
- Que el historial sigue funcionando.
- Que las simulaciones se calculan y guardan correctamente.
- Que el selector de divisas mantiene su comportamiento.
- Que la interfaz no presenta errores de ejecución.

No afirmes haber comprobado visualmente la aplicación en un navegador si no has realizado realmente esa comprobación.

Si dispones de herramientas de navegador, utilízalas para revisar el resultado en distintos tamaños de pantalla.

Si no dispones de ellas, indícame qué verificaciones visuales debo realizar manualmente.

---

## 19. Documentación del rediseño

Al finalizar, prepara un resumen técnico que incluya:

- Objetivo del rediseño.
- Problemas de usabilidad detectados.
- Principales mejoras visuales.
- Componentes modificados.
- Decisiones de diseño.
- Mejoras de accesibilidad.
- Pruebas ejecutadas.
- Resultados obtenidos.
- Limitaciones pendientes.

Actualiza la documentación existente únicamente cuando corresponda.

Registra el uso de IA de acuerdo con la metodología de documentación del proyecto, evitando duplicar información ya existente.

Incorpora comentarios en español únicamente en las partes del código donde aporten claridad y sean necesarios.

---

## 20. Gestión de cambios y seguridad

Antes de modificar el proyecto:

- Comprueba el estado de Git.
- Identifica posibles cambios locales pendientes.
- No descartes modificaciones realizadas anteriormente.
- No sobrescribas archivos sin analizar su contenido.
- No elimines comentarios existentes.
- No cambies configuraciones sensibles.
- No modifiques archivos `.env`.

Si existen cambios locales, consérvalos e indícamelo antes de comenzar.

No crees commits ni subas cambios a GitHub sin mi autorización expresa.

---

## 21. Resultado esperado

El resultado final debe ser una versión visualmente mejorada de SaaS-O-Matic que:

- Mantenga todas sus funcionalidades.
- Tenga una apariencia profesional y moderna.
- Ofrezca una navegación más intuitiva.
- Presente mejor la información de clientes y simulaciones.
- Destaque los resultados económicos.
- Mantenga una estética dark mode consistente.
- Funcione correctamente en móviles y escritorio.
- Preserve el diseño vertical de las tarjetas de clientes.
- Sea accesible y fácil de utilizar.
- Supere las pruebas automatizadas.
- No introduzca regresiones funcionales.
- Mantenga la arquitectura y la lógica de negocio existentes.

**La prioridad es conseguir una mejora visual significativa mediante cambios pequeños, seguros y bien justificados.**

---

## 22. Primera instrucción

Comienza examinando el código real de la aplicación y su estructura actual.

Identifica los componentes responsables de la vista principal, analiza su presentación y propón un plan de rediseño dividido en bloques.

Indica qué archivos modificarías, qué mejoras aportarías y cuáles serían los principales riesgos.

**No modifiques ningún archivo todavía.**

Espera mi aprobación del plan antes de comenzar la implementación.
````

</details>

### Prompt 4 — Mejora del tratamiento de errores de validación de clientes

- **Fecha original:** 18/11/2026
- **Herramienta:** Codex Desktop.
- **Objetivo:** Mejorar la comunicación de los errores de registro de clientes, mostrando mensajes localizados por campo y país.

<details>

<summary>Mostrar el prompt completo</summary>

````text
Mejora del tratamiento de errores de validación de clientes en SaaS-O-Matic

## 1. Contexto del proyecto

Estás trabajando sobre **SaaS-O-Matic — Dynamic Billing & Subscription Optimizer**, una aplicación full-stack desarrollada como prueba técnica para el proceso de selección **Full-Stack AI-Augmented de Roams**.

La aplicación utiliza las siguientes tecnologías:

- **Frontend:** React, TypeScript, Vite y Tailwind CSS.
- **Backend:** Node.js, Express, TypeScript y Zod.
- **Persistencia:** Prisma y SQLite.
- **Pruebas automatizadas:** Vitest, React Testing Library y Supertest.

El proyecto ya se encuentra desarrollado y funcional.

Se ha realizado una prueba de instalación limpia, clonando el repositorio desde GitHub en una carpeta independiente y ejecutando los comandos documentados en el README:

```bash
npm run setup
npm run dev
```

La instalación, el arranque de los servidores, la comunicación con la API y las funcionalidades principales se han comprobado satisfactoriamente.

Sin embargo, durante las pruebas manuales se ha identificado una mejora necesaria en la experiencia de usuario: **los errores de validación al registrar clientes se muestran mediante mensajes genéricos en inglés, sin identificar claramente el campo incorrecto**.

Tu tarea consiste en analizar este comportamiento, implementar la mejor solución técnica posible y verificar que no se introducen regresiones.

---

## 2. Problema detectado

Al registrar un nuevo cliente, cuando el usuario introduce un identificador fiscal incorrecto —por ejemplo, un DNI español cuya letra de control no es válida—, la aplicación muestra actualmente el siguiente mensaje:

`Invalid customer data`

Este mensaje resulta poco útil porque:

- No identifica qué campo contiene el error.
- No explica por qué los datos han sido rechazados.
- Aparece en inglés, mientras que la interfaz está desarrollada en español.
- Obliga al usuario a revisar manualmente todos los campos del formulario.

El comportamiento deseado es que el usuario reciba una explicación clara, específica y comprensible.

Por ejemplo:

- **Identificación fiscal española:** «La identificación fiscal introducida no es válida para España. Comprueba el formato y los caracteres de control».
- **Identificación fiscal francesa:** «La identificación fiscal introducida no es válida para Francia. Comprueba que tenga 9 dígitos».
- **Identificación fiscal alemana:** «La identificación fiscal introducida no es válida para Alemania. Comprueba el formato requerido».
- **Correo electrónico incorrecto:** «Introduce una dirección de correo electrónico válida».
- **Nombre de empresa incorrecto:** «Comprueba el nombre de la empresa».
- **Cliente duplicado:** «Ya existe un cliente con ese identificador fiscal en el país seleccionado».

Estos mensajes son ejemplos orientativos. Debes determinar su redacción definitiva según las validaciones realmente implementadas.

**No debes mostrar una causa específica, como una letra de control incorrecta, si el backend únicamente informa de que el identificador fiscal no es válido.**

---

## 3. Investigación previa realizada

Ya se han revisado varios archivos y se ha identificado el recorrido de los errores.

### 3.1. Validación en el backend

Archivo:

`backend/src/modules/customers/customer.schema.ts`

El backend utiliza Zod para validar los datos necesarios para registrar clientes.

Actualmente existen validaciones específicas de identificadores fiscales:

- **España:** DNI, NIE y NIF de entidades.
- **Francia:** SIREN.
- **Alemania:** identificador fiscal alemán.

Estas validaciones utilizan funciones ya implementadas y comprobadas mediante pruebas automatizadas.

El esquema `createCustomerSchema` utiliza `superRefine` para comprobar que el identificador fiscal corresponde al país seleccionado.

Cuando se detecta un identificador incorrecto, se genera un problema de validación asociado al campo `taxId`.

Ejemplo del mensaje interno:

```typescript
ctx.addIssue({
  code: "custom",
  path: ["taxId"],
  message: `Invalid tax ID for country ${customer.country}`,
});
```

**Estas reglas fiscales no deben modificarse**, salvo que descubras un defecto real directamente relacionado con el problema y puedas justificarlo.

### 3.2. Respuesta HTTP del backend

Archivo:

`backend/src/modules/customers/customer.routes.ts`

Cuando Zod detecta datos inválidos, la API devuelve un HTTP 400 con una estructura equivalente a:

```json
{
  "error": "ValidationError",
  "message": "Invalid customer data",
  "details": [
    {
      "path": ["taxId"],
      "message": "Invalid tax ID for country ES"
    }
  ]
}
```

Por tanto, el backend **ya devuelve información suficiente para identificar el campo incorrecto**.

No parece necesario modificar el contrato HTTP del servidor para resolver este problema.

### 3.3. Cliente HTTP del frontend

Archivo:

`frontend/src/api/client.ts`

Este archivo centraliza las peticiones HTTP y define la clase `ApiError`.

Actualmente, cuando una petición falla, se extrae únicamente la propiedad `message` de la respuesta.

La propiedad `details`, que contiene los problemas de validación identificados por Zod, se descarta.

Como consecuencia, las capas superiores del frontend no reciben información estructurada sobre los campos incorrectos.

Esta es una de las causas principales del comportamiento observado.

### 3.4. Función de registro de clientes

Archivo:

`frontend/src/api/customers.ts`

La función `createCustomer()` delega directamente la petición en `apiRequest()`.

No parece necesario modificar este archivo, salvo que tu análisis encuentre una justificación concreta.

### 3.5. Formulario de registro

Archivo:

`frontend/src/features/customers/CustomerForm.tsx`

El formulario gestiona sus estados de carga, éxito y error mediante React.

Actualmente, el bloque `catch` utiliza directamente `error.message` cuando recibe una instancia de `Error`.

Por ello, cuando `apiRequest()` lanza un error con el mensaje `Invalid customer data`, ese mismo texto aparece en la interfaz.

El formulario no interpreta los detalles estructurados de validación.

### 3.6. Pruebas existentes

El frontend utiliza Vitest y React Testing Library.

Se han identificado los siguientes archivos de pruebas:

```text
frontend/src/features/currency/CurrencySelector.test.tsx
frontend/src/features/customers/CustomerList.test.tsx
frontend/src/features/simulations/SimulationForm.test.tsx
frontend/src/features/simulations/SimulationHistory.test.tsx
frontend/src/test/setup.test.tsx
```

Actualmente no existe un archivo específico `CustomerForm.test.tsx`.

El archivo `CustomerList.test.tsx` puede utilizarse como referencia para seguir las convenciones existentes de pruebas, mocks y aserciones.

El backend también dispone de pruebas de validación fiscal, rutas y servicios de clientes.

**Antes de implementar, comprueba el estado real del repositorio, ya que estos hallazgos corresponden a la revisión previa y pueden existir modificaciones posteriores.**

---

## 4. Objetivo principal

Implementar un tratamiento de errores de validación de clientes que sea:

1. **Específico:** identificar claramente el campo incorrecto.
2. **Comprensible:** utilizar mensajes orientados al usuario.
3. **Consistente:** mostrar los mensajes en español y siguiendo el diseño existente.
4. **Robusto:** manejar respuestas incompletas, inesperadas o mal formadas sin provocar errores adicionales.
5. **Mantenible:** evitar duplicación innecesaria y respetar la arquitectura actual.
6. **Compatible:** conservar el comportamiento de las demás peticiones y componentes que utilizan el cliente HTTP.
7. **Verificable:** incorporar pruebas automatizadas que demuestren el comportamiento esperado.

---

## 5. Propuesta técnica inicial

La siguiente propuesta es orientativa. Puedes mejorarla si encuentras una solución más adecuada, siempre que respetes las restricciones establecidas.

### 5.1. Conservar los detalles de validación

Revisar `frontend/src/api/client.ts`.

Ampliar de forma compatible la representación de errores HTTP para conservar, cuando existan, los detalles estructurados que devuelve la API.

Por ejemplo, mediante un tipo equivalente a:

```typescript
interface ApiValidationDetail {
  path: (string | number)[];
  message: string;
}
```

La clase `ApiError` podría incluir una propiedad opcional o una colección de detalles.

Requisitos:

- Conservar `status` y `message`.
- Mantener la compatibilidad con las llamadas existentes a `ApiError`.
- No modificar el tratamiento de las respuestas exitosas.
- Comprobar la estructura de `details` antes de utilizarla.
- No asumir que todos los errores HTTP incluyen detalles.
- Mantener un mensaje de respaldo cuando la respuesta sea inesperada.
- No introducir dependencias adicionales innecesarias.

### 5.2. Interpretar los errores en el formulario

Revisar `CustomerForm.tsx` e implementar la presentación de errores de validación.

El formulario debe poder distinguir errores asociados a:

- `taxId`
- `email`
- `companyName`
- `country`
- `plan`

Siempre que sea posible, aprovechar el campo indicado en `details.path` y el contexto del formulario para generar un mensaje útil.

Para los identificadores fiscales, tener en cuenta el país seleccionado.

**Evita depender exclusivamente de coincidencias literales con mensajes internos en inglés si existe una alternativa más robusta.**

Valora si conviene:

- Mantener un mensaje general de error en el formulario.
- Mostrar errores específicos junto al campo correspondiente.
- Utilizar ambos mecanismos de manera complementaria.

Elige la solución que ofrezca mejor experiencia de usuario con la menor complejidad razonable.

Respeta las clases CSS, la estética y la estructura visual actuales.

### 5.3. Manejar los demás errores

La solución también debe contemplar:

- Identificador fiscal duplicado (HTTP 409).
- Errores HTTP sin `details`.
- Fallos de conexión con el backend.
- Respuestas JSON inesperadas.
- Errores no relacionados con la validación.

No deben presentarse mensajes engañosos ni ocultarse errores importantes.

Si un error no puede identificarse con seguridad, muestra un mensaje genérico apropiado en español.

---

## 6. Pruebas automatizadas

Añade o amplía las pruebas necesarias.

Como mínimo, comprueba:

1. El cliente HTTP conserva correctamente los detalles de validación.
2. Una respuesta sin `details` sigue gestionándose correctamente.
3. Una respuesta con `details` mal formados no provoca fallos.
4. Un identificador fiscal español incorrecto produce un mensaje claro en español.
5. Los identificadores incorrectos de Francia y Alemania generan mensajes apropiados.
6. Los errores de otros campos se identifican correctamente.
7. Un cliente duplicado muestra un mensaje comprensible.
8. Un error de conexión se comunica adecuadamente.
9. Un registro válido sigue funcionando y conserva su comportamiento actual.
10. El formulario mantiene correctamente sus estados de carga, éxito y error.

Puedes crear:

`frontend/src/features/customers/CustomerForm.test.tsx`

Si es conveniente, añade también pruebas específicas para `frontend/src/api/client.ts`.

Sigue las convenciones existentes del proyecto y evita pruebas redundantes.

No modifiques ni elimines pruebas existentes únicamente para conseguir que la suite pase.

---

## 7. Restricciones obligatorias

### Preservación del proyecto

- No modificar la estructura fundamental de SaaS-O-Matic.
- No realizar refactorizaciones amplias ni cambios ajenos al problema.
- No alterar la lógica de cálculo de facturación.
- No modificar las reglas fiscales existentes.
- No modificar el modelo de datos ni las migraciones de Prisma.
- No alterar las rutas públicas ni los contratos HTTP existentes salvo necesidad claramente justificada.
- No cambiar el funcionamiento de las simulaciones, historial, conversión de divisas o dashboard.
- No añadir bibliotecas externas salvo necesidad técnica imprescindible.

### Calidad del código

- Mantener TypeScript correctamente tipado.
- Respetar las convenciones del repositorio.
- Evitar el uso innecesario de `any`.
- Mantener los comentarios existentes.
- Añadir comentarios breves, claros y en español solamente cuando expliquen decisiones importantes.
- No duplicar comentarios ni documentar operaciones evidentes.
- Evitar duplicar lógica de validación del backend en el frontend.
- Mantener accesibilidad básica, incluidos mensajes anunciables mediante `role="alert"` y asociaciones adecuadas con los campos cuando corresponda.

### Seguridad y estabilidad

- No modificar archivos `.env` ni exponer secretos.
- No eliminar datos de SQLite.
- No ejecutar operaciones destructivas.
- No alterar la configuración de producción o desarrollo sin necesidad.
- No realizar cambios en el repositorio remoto de GitHub.
- No crear commits ni ejecutar `git push` sin mi autorización.
- No modificar la copia independiente utilizada para probar la instalación limpia.

**Trabaja exclusivamente sobre el proyecto original abierto en el entorno de Codex.**

---

## 8. Metodología de trabajo

Sigue este procedimiento:

### Fase A. Inspección

1. Comprueba el estado actual de Git.
2. Identifica los archivos relevantes.
3. Revisa el contrato real de errores de la API.
4. Analiza los consumidores existentes de `ApiError`.
5. Revisa las pruebas y las convenciones del frontend.
6. Determina la solución más sencilla y robusta.

No sobrescribas cambios previos del usuario.

### Fase B. Implementación

Realiza únicamente las modificaciones necesarias.

Si consideras que la mejor solución difiere de la propuesta inicial, puedes utilizarla, pero explica brevemente por qué.

Prioriza la compatibilidad con el código existente.

### Fase C. Verificación

Ejecuta las pruebas relevantes y después la verificación completa desde la raíz:

```bash
npm run verify
```

Este comando debe comprobar las pruebas automatizadas, tipos, lint y compilaciones de ambos proyectos.

Si alguna comprobación falla:

1. Identifica la causa.
2. Determina si está relacionada con tus cambios.
3. Corrige los problemas introducidos por tu implementación.
4. Vuelve a ejecutar las comprobaciones afectadas.

No ocultes fallos ni presentes resultados no ejecutados como satisfactorios.

### Fase D. Revisión final

Inspecciona el diff completo para confirmar que:

- Los cambios están limitados al problema.
- No aparecen modificaciones accidentales.
- No se han introducido regresiones.
- No se han alterado archivos ajenos a la funcionalidad.
- El resultado es coherente con las convenciones del proyecto.

---

## 9. Resultado esperado

Una vez terminada la implementación, entrega un informe breve y estructurado que incluya:

**Diagnóstico:** causa raíz confirmada.

**Solución aplicada:** explicación de los cambios y de las decisiones técnicas.

**Archivos modificados:** relación de archivos y finalidad de cada modificación.

**Mensajes implementados:** ejemplos de errores que verá el usuario.

**Pruebas realizadas:** número de pruebas superadas, resultados de tipos, lint y compilaciones, y cualquier advertencia pendiente.

**Impacto:** confirmación de qué funcionalidades se han preservado y de cualquier riesgo residual identificado.

**Validación manual:** instrucciones concretas para comprobar la mejora en el navegador.

**Estado de Git:** cambios pendientes, sin crear commits ni subirlos.

---

## 10. Criterios de aceptación

Considera completado el trabajo únicamente cuando:

- Un identificador fiscal inválido ya no muestre solamente `Invalid customer data`.
- El usuario reciba un mensaje claro y específico en español.
- Se mantengan las validaciones originales de España, Francia y Alemania.
- Los errores de otros campos y los clientes duplicados se comuniquen adecuadamente.
- El registro correcto de clientes siga funcionando.
- Los demás consumidores de `apiRequest()` mantengan su comportamiento.
- Las pruebas nuevas y existentes sean satisfactorias.
- La verificación completa del proyecto finalice correctamente, o se documenten con precisión los problemas que impidan conseguirlo.
- No se hayan introducido cambios innecesarios en el proyecto.

## 11. Instrucción final

**Comienza analizando el código real y después implementa la solución más adecuada.**

Prioriza la simplicidad, la mantenibilidad, la compatibilidad y la experiencia de usuario.

Dispones de autonomía para decidir los detalles técnicos dentro del alcance descrito, pero no para realizar refactorizaciones generales ni modificar funcionalidades ajenas al tratamiento de errores.

No crees commits ni subas cambios a GitHub. Una vez finalizado el trabajo, presenta el resultado y deja las modificaciones preparadas para mi revisión.
````

</details>

### Prompt 5 — Eliminación de clientes y simulaciones

- **Fecha original:** 18/11/2026
- **Herramienta:** Codex Desktop.
- **Objetivo:** Implementar la eliminación segura de clientes y simulaciones, mantener la integridad de datos, verificar los flujos y actualizar la documentación afectada.

<details>

<summary>Mostrar el prompt completo</summary>

````text
# Implementación de la eliminación de clientes y simulaciones en SaaS-O-Matic

## 1. Contexto del proyecto

Estás trabajando sobre **SaaS-O-Matic — Dynamic Billing & Subscription Optimizer**, una aplicación full-stack desarrollada como prueba técnica para el proceso de selección **Full-Stack AI-Augmented de Roams**.

El proyecto utiliza las siguientes tecnologías:

- **Frontend:** React, TypeScript, Vite y Tailwind CSS.
- **Backend:** Node.js, Express, TypeScript y Zod.
- **Persistencia:** Prisma y SQLite.
- **Pruebas automatizadas:** Vitest, React Testing Library y Supertest.
- **Control de versiones:** Git y GitHub.

La aplicación permite actualmente registrar y consultar clientes empresariales, crear simulaciones de facturación, obtener vistas previas, consultar el historial de simulaciones y visualizar importes en diferentes divisas.

El proyecto se encuentra en una fase avanzada, con sus funcionalidades principales desarrolladas, documentación técnica y pruebas automatizadas.

Además, se ha realizado una instalación limpia descargando el repositorio desde GitHub y utilizando los comandos documentados:

```bash
npm run setup
npm run dev
```

Se ha comprobado que la aplicación puede instalarse y ejecutarse sin necesidad de abrir un editor de código.

**El objetivo de esta tarea es incorporar la eliminación segura de clientes y simulaciones, integrándola en la aplicación y actualizando toda la documentación afectada.**

No se pretende rediseñar el proyecto ni modificar su arquitectura fundamental.

---

## 2. Objetivos funcionales

Implementa las siguientes capacidades:

### 2.1. Eliminar un cliente

Desde la interfaz de gestión de clientes, el usuario debe poder eliminar un cliente existente.

El comportamiento esperado es:

1. Cada tarjeta de cliente tendrá una acción identificable como «Eliminar cliente».
2. Al pulsarla, aparecerá una confirmación explícita.
3. La confirmación deberá identificar suficientemente al cliente que se va a eliminar.
4. Se advertirá de que también se eliminarán todas sus simulaciones asociadas.
5. Se indicará que la acción es irreversible.
6. El usuario podrá confirmar o cancelar.
7. La cancelación no realizará ninguna operación de borrado.
8. Al confirmar, se enviará la petición correspondiente al backend.
9. Si la eliminación es correcta, el cliente desaparecerá del listado.
10. Si ese cliente estaba seleccionado para consultar su historial o realizar simulaciones, el estado de la interfaz deberá actualizarse de manera coherente, evitando referencias a un cliente eliminado.
11. Si ocurre un error, se mostrará un mensaje claro y el cliente permanecerá visible.

**Regla funcional obligatoria:** al eliminar un cliente, también deben eliminarse sus simulaciones asociadas.

Este borrado debe ser consistente y evitar registros huérfanos.

### 2.2. Eliminar una simulación

Desde el historial de simulaciones de un cliente, el usuario debe poder eliminar una simulación individual.

El comportamiento esperado es:

1. Cada simulación del historial tendrá una acción identificable como «Eliminar simulación».
2. Antes de ejecutar el borrado, aparecerá una confirmación.
3. La confirmación deberá indicar qué simulación se eliminará, utilizando la información disponible.
4. Se advertirá de que la acción no se puede deshacer.
5. El usuario podrá cancelar sin modificar los datos.
6. Al confirmar, se eliminará exclusivamente la simulación seleccionada.
7. El cliente y sus demás simulaciones permanecerán intactos.
8. El historial deberá actualizarse automáticamente.
9. Si la página actual del historial queda vacía tras el borrado, la paginación deberá ajustarse correctamente.
10. Si existe un contador de simulaciones, un resumen o cualquier otro componente dependiente de los datos eliminados, deberá mantenerse actualizado.
11. Si ocurre un error, se mostrará un mensaje claro y la simulación no desaparecerá incorrectamente de la interfaz.

**Regla funcional obligatoria:** eliminar una simulación nunca debe provocar la eliminación de su cliente.

---

## 3. Confirmaciones de seguridad y experiencia de usuario

Las operaciones de eliminación son destructivas, por lo que deben implementar mecanismos adecuados para evitar errores accidentales.

### 3.1. Confirmación de eliminación de cliente

Ejemplo orientativo de mensaje:

**¿Eliminar este cliente?**

«Vas a eliminar a [nombre del cliente] y todas sus simulaciones asociadas. Esta acción no se puede deshacer».

Acciones:

- «Cancelar».
- «Eliminar cliente».

La acción destructiva debe distinguirse visualmente del resto.

### 3.2. Confirmación de eliminación de simulación

Ejemplo orientativo:

**¿Eliminar esta simulación?**

«La simulación seleccionada se eliminará permanentemente. Esta acción no se puede deshacer».

Acciones:

- «Cancelar».
- «Eliminar simulación».

### 3.3. Integración visual

Respeta el diseño actual de SaaS-O-Matic:

- Interfaz oscura.
- Colores y componentes coherentes con el resto del dashboard.
- Botones y controles de tamaño adecuado.
- Iconografía consistente, preferiblemente utilizando Lucide React, que ya está presente en el proyecto.
- Estados visuales de carga, error y éxito.
- Diseño responsive.
- Accesibilidad de teclado y lectores de pantalla.

Analiza si existen componentes reutilizables para diálogos de confirmación antes de crear nuevos.

**Evita introducir una biblioteca externa de diálogos si puede resolverse correctamente con las herramientas existentes.**

Si implementas un diálogo personalizado, debe gestionar adecuadamente el foco, el cierre, el teclado y los atributos de accesibilidad. No basta con mostrar una ventana visualmente parecida a un modal.

Puedes optar por una confirmación nativa si consideras que reduce el riesgo y encaja mejor con el alcance del proyecto, pero justifica brevemente la elección.

No realices un rediseño general de las tarjetas ni del historial.

---

## 4. Análisis previo obligatorio

Antes de modificar código, inspecciona el proyecto real.

En particular, revisa:

### Backend

- `backend/prisma/schema.prisma`
- Rutas y servicios del módulo de clientes.
- Rutas y servicios del módulo de simulaciones.
- Configuración de Prisma.
- Gestión de errores HTTP.
- Pruebas actuales de integración y de rutas.

### Frontend

- `frontend/src/api/client.ts`
- `frontend/src/api/customers.ts`
- Módulos de API relacionados con las simulaciones.
- `frontend/src/features/customers/CustomerList.tsx`
- `frontend/src/features/simulations/SimulationHistory.tsx`
- Componentes que mantienen el cliente seleccionado.
- Componentes que muestran contadores, resúmenes o información derivada.
- Pruebas existentes del frontend.

### Documentación

- `README.md`
- `docs/requirements.md`
- `docs/architecture.md`
- `ai-workspace/README.md`
- `ai-workspace/02-ai-prompts.md`
- Documentos de desarrollo, decisiones, pruebas y revisión de calidad que existan realmente en el repositorio.

Los nombres anteriores son referencias orientativas basadas en la organización conocida del proyecto.

**Comprueba la estructura real antes de decidir dónde implementar cada modificación.**

No presupongas que todos los archivos tienen exactamente el mismo contenido que en revisiones anteriores.

---

## 5. Implementación en el backend

### 5.1. Endpoint de eliminación de clientes

Implementa un endpoint REST adecuado, previsiblemente:

```http
DELETE /customers/:id
```

Requisitos:

- Identificar el cliente por su ID.
- Gestionar correctamente un cliente inexistente.
- Eliminar el cliente y sus simulaciones asociadas.
- Garantizar la consistencia de la operación.
- Devolver códigos HTTP apropiados.
- No exponer detalles internos de Prisma o SQLite.
- Evitar respuestas ambiguas.
- Mantener intactas las rutas existentes.

Para una eliminación correcta puedes utilizar `204 No Content`, si resulta coherente con el diseño actual de la API.

### 5.2. Endpoint de eliminación de simulaciones

Implementa un endpoint REST adecuado, previsiblemente:

```http
DELETE /simulations/:id
```

Requisitos:

- Identificar la simulación por su ID.
- Eliminar únicamente la simulación indicada.
- Mantener intacto su cliente.
- Gestionar las simulaciones inexistentes.
- Utilizar respuestas HTTP coherentes.
- Respetar el tratamiento de errores existente.

### 5.3. Integridad referencial

Examina la relación entre `Customer` y `Simulation` en Prisma.

Determina la mejor forma de conseguir que, al eliminar un cliente, también se eliminen sus simulaciones.

Valora las alternativas existentes:

- Eliminación en cascada mediante integridad referencial.
- Eliminación transaccional explícita desde el servicio.

Selecciona la alternativa que mejor encaje con el esquema, las migraciones y la arquitectura actual.

**No modifiques el esquema de Prisma ni generes nuevas migraciones si la relación existente ya permite implementar el comportamiento de forma segura.**

Si fuese imprescindible una migración:

1. Explica la necesidad.
2. Comprueba su compatibilidad con las bases de datos existentes.
3. No borres ni reinicialices bases de datos.
4. Genera únicamente los cambios necesarios.
5. Verifica la instalación desde cero y la actualización de una instalación existente.
6. Documenta el cambio.

No utilices operaciones destructivas como `prisma migrate reset`.

### 5.4. Organización del código

Respeta la separación actual entre rutas, servicios y persistencia.

Evita incorporar lógica de acceso a datos directamente en los controladores si el proyecto ya utiliza servicios para esa responsabilidad.

No añadas abstracciones innecesarias.

---

## 6. Implementación en el frontend

### 6.1. API de clientes y simulaciones

Añade las funciones necesarias para realizar las peticiones `DELETE`.

Reutiliza el cliente HTTP existente cuando sea adecuado.

**Presta especial atención a las respuestas HTTP 204**, ya que no contienen cuerpo JSON.

Si el cliente HTTP actual intenta ejecutar siempre `response.json()`, realiza la adaptación mínima compatible para gestionar correctamente las respuestas sin contenido.

Comprueba que las demás peticiones continúan funcionando.

### 6.2. Listado de clientes

Incorpora la eliminación en la interfaz de clientes.

Requisitos:

- Botón de eliminación accesible.
- Confirmación previa.
- Identificación del cliente afectado.
- Estado de carga durante la operación.
- Prevención de solicitudes duplicadas.
- Actualización del listado al finalizar.
- Gestión de errores.
- Sincronización con cualquier cliente seleccionado en la aplicación.

Mantén las funciones actuales de búsqueda, consulta y navegación al historial.

### 6.3. Historial de simulaciones

Incorpora la eliminación individual en el historial.

Requisitos:

- Acción de eliminación por simulación.
- Confirmación previa.
- Estado de carga.
- Actualización automática del historial.
- Conservación de las demás simulaciones.
- Ajuste correcto de la paginación.
- Gestión de errores.
- Compatibilidad con el desplegable «Ver detalles», si está presente.

No alteres los cálculos de facturación ni los datos históricos de las simulaciones que no se eliminen.

### 6.4. Estado general de la aplicación

Comprueba cómo se relacionan los componentes del dashboard.

Presta especial atención a:

- Cliente seleccionado.
- Historial activo.
- Formularios de simulación.
- Contadores de clientes o simulaciones.
- Estados vacíos.
- Mensajes de éxito y error.

Después de una eliminación, la interfaz debe reflejar el estado real de la base de datos.

Evita situaciones en las que un cliente eliminado siga seleccionado o una simulación eliminada continúe apareciendo como válida.

---

## 7. Pruebas automatizadas

Añade o amplía las pruebas necesarias tanto en el backend como en el frontend.

### 7.1. Pruebas del backend

Comprueba como mínimo:

1. Eliminación correcta de un cliente sin simulaciones.
2. Eliminación de un cliente con una o varias simulaciones.
3. Comprobación de que no quedan simulaciones huérfanas.
4. Eliminación correcta de una simulación individual.
5. Conservación del cliente tras eliminar una simulación.
6. Conservación de las demás simulaciones del cliente.
7. Respuesta ante un cliente inexistente.
8. Respuesta ante una simulación inexistente.
9. Gestión segura de errores de base de datos.
10. Códigos HTTP y formatos de respuesta esperados.

Cuando corresponda, añade pruebas de integración con SQLite y Prisma para verificar el comportamiento real de las relaciones.

### 7.2. Pruebas del frontend

Comprueba como mínimo:

1. Visualización del botón de eliminación de cliente.
2. Apertura de la confirmación.
3. Cancelación sin realizar la petición.
4. Confirmación y petición de eliminación.
5. Actualización del listado.
6. Visualización de errores.
7. Prevención de acciones duplicadas.
8. Visualización del botón de eliminación de simulación.
9. Eliminación individual y actualización del historial.
10. Ajuste de paginación después de borrar la última simulación visible.
11. Conservación de las funciones existentes de búsqueda, historial y visualización de detalles.
12. Correcta gestión de respuestas HTTP 204 sin cuerpo.

Sigue las convenciones del proyecto y evita pruebas redundantes.

No elimines ni debilites pruebas existentes para conseguir resultados satisfactorios.

---

## 8. Actualización completa de la documentación

**Esta fase es obligatoria y forma parte de la implementación. No consideres terminado el trabajo hasta que la documentación refleje fielmente las nuevas funcionalidades.**

Revisa todos los documentos relevantes del repositorio y actualiza únicamente los que realmente estén afectados.

### 8.1. README principal

Archivo:

`README.md`

Actualiza la sección de funcionalidades para incluir:

- Eliminación individual de simulaciones.
- Eliminación de clientes.
- Eliminación de las simulaciones asociadas cuando se borra un cliente.
- Confirmaciones de seguridad cuando corresponda.

Mantén el README conciso, profesional y orientado a una persona que descarga el repositorio por primera vez.

**Conserva los comandos actuales de instalación y ejecución**, especialmente:

```bash
npm run setup
npm run dev
npm run verify
```

No modifiques estas instrucciones salvo que sea estrictamente necesario por cambios reales en el proyecto.

### 8.2. Requisitos funcionales y técnicos

Archivo:

`docs/requirements.md`

Incorpora los requisitos relacionados con las nuevas funcionalidades.

Deben quedar reflejados, según la estructura actual del documento:

- Eliminación de clientes.
- Eliminación en cascada de sus simulaciones.
- Eliminación individual de simulaciones.
- Confirmaciones antes de operaciones destructivas.
- Gestión de errores.
- Integridad referencial.
- Actualización de la interfaz.
- Comportamiento ante registros inexistentes.

Utiliza la nomenclatura, numeración y organización existentes.

Si el documento contiene identificadores de requisitos funcionales, mantén su consistencia.

### 8.3. Arquitectura y modelo de datos

Archivo:

`docs/architecture.md`

Actualiza las secciones correspondientes a:

- Endpoints de clientes y simulaciones.
- Métodos HTTP `DELETE`.
- Códigos de respuesta.
- Organización de los módulos.
- Tratamiento de errores.
- Integridad referencial.
- Relación `Customer`–`Simulation`.
- Comportamiento de eliminación de clientes y simulaciones.

Si existen diagramas Mermaid que describen los componentes o los flujos afectados, actualízalos.

Si la eliminación en cascada depende de la relación Prisma, documenta el mecanismo realmente utilizado.

**No modifiques diagramas o capturas de pantalla que sigan siendo correctos.**

### 8.4. Registro de desarrollo

Localiza los documentos utilizados para registrar el desarrollo del proyecto, especialmente:

`ai-workspace/04-development-log.md`

Si existe y es el lugar adecuado, incorpora una nueva entrada cronológica con:

- Fecha real de la implementación.
- Objetivo de la mejora.
- Cambios realizados.
- Decisiones técnicas relevantes.
- Resultado de las pruebas.
- Archivos principales afectados.

Mantén el estilo y la organización del documento.

No reescribas ni alteres las entradas históricas anteriores.

### 8.5. Revisión de calidad

Revisa:

`ai-workspace/05-quality-review.md`

Si corresponde, actualiza:

- Cobertura funcional.
- Pruebas de eliminación.
- Resultados de las suites.
- Comprobaciones de integridad referencial.
- Verificación de las confirmaciones.
- Riesgos residuales.
- Estado final de calidad.

Las cifras de pruebas deben proceder de ejecuciones reales.

**No inventes números ni reutilices resultados históricos como si correspondieran a la versión actual.**

### 8.6. Registro de uso de inteligencia artificial

Revisa:

`ai-workspace/02-ai-prompts.md`

Este documento registra las interacciones relevantes con herramientas de inteligencia artificial durante el desarrollo.

Añade una nueva entrada siguiendo el formato y la numeración existentes.

Incluye:

- Herramienta utilizada: Codex.
- Objetivo de esta intervención.
- Descripción resumida de la implementación.
- Principales decisiones técnicas.
- Verificaciones realizadas.
- Resultado final.

Además, incorpora **el texto completo de este prompt**, respetando el sistema de secciones y desplegables `<details>` utilizado actualmente en el documento.

Evita duplicar el prompt si ya ha sido incorporado manualmente.

Preserva todas las entradas históricas anteriores.

Presta atención al formato Markdown, especialmente a los espacios, los bloques de código y los saltos de línea alrededor de los elementos `<details>` y `<summary>`.

### 8.7. Resto de documentación

Revisa también:

- `ai-workspace/README.md`.
- Documentación de decisiones arquitectónicas.
- Documentación de pruebas.
- Diagramas de arquitectura.
- Referencias a capturas de pantalla.
- Cualquier otro archivo que describa las capacidades de la aplicación.

Actualiza únicamente aquello que haya quedado desfasado.

No añadas información repetitiva ni extiendas innecesariamente la documentación.

---

## 9. Evidencias visuales

Si las nuevas funcionalidades modifican partes importantes de la interfaz, determina si conviene actualizar las capturas de pantalla existentes.

En particular, revisa:

`docs/evidence/`

Si existen capturas del dashboard, del listado de clientes o del historial de simulaciones que hayan quedado desactualizadas, explica cuáles deberían sustituirse.

Si dispones de medios para generar capturas reales de la aplicación, puedes hacerlo sin alterar los datos importantes del proyecto.

**No inventes capturas ni utilices imágenes simuladas como si fueran evidencias reales de ejecución.**

Si no puedes generar las capturas, deja indicadas las evidencias visuales pendientes para que puedan realizarse manualmente.

---

## 10. Verificación completa

Una vez implementadas las funcionalidades y actualizada la documentación, ejecuta desde la raíz:

```bash
npm run verify
```

Este comando debe realizar las comprobaciones configuradas para el proyecto, que incluyen pruebas automatizadas, comprobación de tipos, lint y compilaciones de frontend y backend.

Adicionalmente:

- Comprueba las pruebas específicas de los endpoints `DELETE`.
- Comprueba las pruebas de los componentes modificados.
- Verifica la ausencia de registros huérfanos.
- Revisa que las respuestas `204` no provoquen errores de análisis JSON.
- Comprueba que el resto de funcionalidades existentes no ha sufrido cambios inesperados.
- Revisa el diff de Git para detectar modificaciones accidentales.
- Ejecuta `git diff --check` u otra comprobación equivalente.

Si la verificación completa detecta problemas, investiga su causa y corrige los introducidos por esta implementación.

No presentes como satisfactorias comprobaciones que no se hayan ejecutado.

---

## 11. Restricciones de seguridad y preservación

Durante todo el proceso debes respetar las siguientes condiciones:

1. No modificar la arquitectura fundamental de SaaS-O-Matic.
2. No realizar refactorizaciones extensas.
3. No alterar las fórmulas de facturación ni las reglas fiscales.
4. No modificar las funcionalidades de conversión de divisas.
5. No alterar las reglas existentes de validación de clientes.
6. No introducir nuevas dependencias salvo necesidad justificada.
7. No eliminar ni reinicializar bases de datos existentes.
8. No ejecutar operaciones destructivas sobre datos reales para verificar la funcionalidad.
9. Utilizar bases de datos de prueba aisladas cuando sea necesario.
10. No modificar archivos `.env` ni divulgar información sensible.
11. Conservar los comentarios existentes y añadir únicamente comentarios importantes, claros, concisos y en español.
12. No modificar archivos ajenos al alcance.
13. No sobrescribir cambios previos del usuario.
14. No crear commits automáticamente.
15. No ejecutar `git push` ni modificar el repositorio remoto.
16. No modificar la copia independiente utilizada para comprobar la instalación limpia.

**Trabaja sobre el proyecto original que se encuentra abierto en el entorno de Codex.**

---

## 12. Metodología de ejecución

Realiza el trabajo por fases.

### Fase 1. Auditoría inicial

Inspecciona el estado actual del código y la documentación.

Identifica los archivos que deberán cambiar y comprueba las relaciones Prisma.

Determina qué mecanismos de eliminación pueden aprovecharse sin modificar el modelo existente.

### Fase 2. Implementación del backend

Implementa las operaciones de eliminación y sus pruebas.

Comprueba la integridad de los datos y el tratamiento de errores.

### Fase 3. Implementación del frontend

Implementa las acciones de eliminación y las confirmaciones.

Asegura la sincronización de los estados y la actualización de listados e historiales.

### Fase 4. Pruebas y validación

Ejecuta las comprobaciones específicas y la suite completa.

Resuelve cualquier regresión introducida.

### Fase 5. Documentación

Actualiza todos los documentos relevantes para reflejar el comportamiento implementado.

Mantén los registros históricos intactos y documenta únicamente los cambios reales.

### Fase 6. Revisión final

Revisa el código, la documentación y el estado de Git.

Comprueba que el alcance se ha respetado.

No publiques ni confirmes cambios automáticamente.

---

## 13. Informe final obligatorio

Cuando termines, proporciona un informe claro con los siguientes apartados.

### A. Resumen de la implementación

Explica qué funcionalidades se han añadido y cómo funcionan.

### B. Decisiones técnicas

Indica cómo se ha resuelto la eliminación de clientes y simulaciones, especialmente la integridad referencial y las confirmaciones.

### C. Archivos modificados

Presenta una relación de los archivos modificados o creados y la finalidad de cada uno.

### D. Pruebas y verificaciones

Incluye:

- Número de pruebas del backend superadas.
- Número de pruebas del frontend superadas.
- Resultado de las comprobaciones de tipos.
- Resultado del lint.
- Resultado de las compilaciones.
- Resultado general de `npm run verify`.

### E. Documentación actualizada

Indica qué documentos se han modificado y qué información se ha incorporado.

### F. Validación manual

Proporciona instrucciones concretas para comprobar desde el navegador:

1. La eliminación de un cliente sin simulaciones.
2. La eliminación de un cliente con varias simulaciones.
3. La cancelación de una eliminación.
4. La eliminación individual de una simulación.
5. La conservación de las demás simulaciones.
6. El ajuste de la paginación después de eliminar registros.
7. El tratamiento de errores.

### G. Riesgos y observaciones

Identifica cualquier limitación, riesgo residual o comprobación manual pendiente.

### H. Estado de Git

Confirma que los cambios permanecen únicamente en el repositorio local, sin commits ni modificaciones del repositorio remoto.

---

## 14. Criterios de aceptación

El trabajo se considerará completado cuando:

- Sea posible eliminar clientes desde la interfaz.
- Exista una confirmación previa a la eliminación.
- Al eliminar un cliente se eliminen también todas sus simulaciones.
- Sea posible eliminar una simulación individual.
- Eliminar una simulación no afecte al cliente ni a las demás simulaciones.
- La interfaz se actualice correctamente después de cada eliminación.
- No existan registros huérfanos.
- Se gestionen correctamente las eliminaciones de registros inexistentes.
- Los errores se comuniquen al usuario de manera comprensible.
- Los endpoints y componentes nuevos dispongan de pruebas automatizadas.
- Las funcionalidades existentes continúen funcionando.
- La documentación esté actualizada y sea coherente con la implementación real.
- La verificación completa se haya ejecutado y sus resultados estén documentados.
- No se hayan introducido modificaciones ajenas al alcance.
- No se hayan creado commits ni subido cambios a GitHub.

## 15. Instrucción final

**Comienza realizando una auditoría del código y de la documentación relacionados con clientes y simulaciones. A continuación, implementa las nuevas funcionalidades siguiendo la solución técnica que consideres más adecuada.**

Tienes autonomía para tomar decisiones técnicas dentro del alcance definido.

Prioriza:

- Seguridad de las operaciones destructivas.
- Integridad y consistencia de los datos.
- Experiencia de usuario.
- Accesibilidad.
- Mantenibilidad.
- Compatibilidad con la arquitectura existente.
- Cobertura de pruebas.
- Calidad y coherencia de la documentación.


Evita mejoras no solicitadas o refactorizaciones generales.

**No consideres finalizada la tarea hasta que el código, las pruebas y la documentación estén actualizados y revisados.**

No realices commits ni publiques cambios en GitHub. Deja el proyecto preparado para mi revisión final.
````

</details>

<br>

### Prompt 6 — Guías de instalación y uso de SaaS-O-Matic

- **Fecha original:** 19/11/2026
- **Herramienta:** Codex Desktop.
- **Objetivo:** Crear documentación clara y verificable para instalar, ejecutar y utilizar la aplicación.

<details>
<summary>Mostrar el prompt completo</summary>

<br>

````text
# Creación de guías de instalación y uso de SaaS-O-Matic

## 1. Contexto y objetivo

Estás trabajando sobre **SaaS-O-Matic — Dynamic Billing & Subscription Optimizer**, una aplicación full-stack desarrollada como prueba técnica para el proceso de selección **Full-Stack AI-Augmented de Roams**.

El proyecto utiliza React, TypeScript, Vite y Tailwind CSS en el frontend; Node.js, Express, TypeScript y Zod en el backend; y Prisma con SQLite para la persistencia. Las pruebas utilizan Vitest, React Testing Library y Supertest.


La aplicación permite gestionar clientes empresariales, simular facturaciones mensuales con tarifas progresivas, consultar historiales y visualizar importes en distintas divisas. También se han encargado mejoras relacionadas con los mensajes de validación y la eliminación de clientes y simulaciones, cuyo estado real debes verificar antes de documentarlas.

**Tu objetivo es mejorar la documentación para que cualquier evaluador pueda instalar, ejecutar y utilizar SaaS-O-Matic sin conocer previamente su arquitectura ni necesitar un editor de código.**

Para ello, debes:

1. Crear una guía detallada de instalación y ejecución.
2. Crear una guía práctica de uso de la aplicación.
3. Documentar claramente los requisitos y las restricciones de validación al registrar clientes.
4. Incorporar ejemplos comprobados de datos válidos e inválidos.
5. Actualizar el README y las referencias documentales necesarias.
6. Verificar que las instrucciones son coherentes con el código y el comportamiento real.

La tarea es principalmente documental. **No debes modificar la funcionalidad de la aplicación ni su arquitectura.**

---

## 2. Auditoría previa obligatoria

Antes de redactar las guías, inspecciona el proyecto actual.

Comprueba especialmente:

- `README.md`.
- `package.json` de la raíz.
- `scripts/setup.mjs`.
- `scripts/dev.mjs`.
- `scripts/verify.mjs`.
- `backend/.env.example`.
- Configuración de Prisma y SQLite.
- Esquemas de validación del módulo de clientes.
- Funciones de validación de identificadores fiscales.
- Rutas y servicios del backend.
- Componentes del frontend.
- Pruebas automatizadas relevantes.
- Documentación existente en `docs/` y `ai-workspace/`.

No des por implementadas funcionalidades que todavía no existan.

Prioriza siempre el **comportamiento real del código** frente a descripciones antiguas de la documentación.

Si detectas diferencias entre el README y la implementación actual, identifícalas y corrige las instrucciones documentales afectadas.

No realices cambios funcionales para adaptar el código a la documentación.

---

## 3. Nueva guía de instalación

Crea el archivo:

`docs/installation-guide.md`

Redáctalo en español, con un estilo profesional, claro y suficientemente detallado para un usuario sin experiencia previa con este proyecto.

### 3.1. Introducción

Explica brevemente:

- Qué es SaaS-O-Matic.
- Qué permite hacer.
- Qué se necesita para ejecutarlo localmente.
- Que no es necesario utilizar Visual Studio Code ni otro editor.
- Que la instalación puede realizarse desde PowerShell de Windows.

### 3.2. Requisitos previos

Documenta:

- Node.js.
- npm.
- Git.
- Conexión a Internet para descargar dependencias.
- Navegador web moderno.

Determina si existen versiones mínimas necesarias a partir de los archivos y dependencias reales del proyecto.

No inventes requisitos de versión.

Incluye comandos para comprobar las herramientas instaladas:

```powershell
node --version
npm --version
git --version
```

Explica qué debe hacer el usuario si alguna herramienta no está instalada, utilizando referencias oficiales cuando resulte apropiado.

### 3.3. Descargar el proyecto desde GitHub

Documenta el proceso utilizando PowerShell:

```powershell
cd $HOME\Desktop
git clone https://github.com/quecoblanco-git/saas-o-matic.git
cd .\saas-o-matic
```

Explica brevemente qué hace cada comando.

Aclara que los comandos deben ejecutarse desde la carpeta correspondiente.

Indica qué hacer si ya existe una carpeta llamada `saas-o-matic`, sin recomendar eliminarla ni sobrescribir archivos.

### 3.4. Preparación de dependencias y base de datos

Documenta:

```powershell
npm run setup
```

Explica qué realiza realmente este script, verificándolo directamente en `scripts/setup.mjs`.

Según el comportamiento conocido, debería:

- Instalar las dependencias necesarias.
- Preparar la configuración local a partir de `.env.example`.
- Generar el cliente de Prisma.
- Aplicar las migraciones necesarias.
- Preparar la base de datos SQLite.

Verifica cada operación antes de afirmarla.

Explica que la configuración local no debe sobrescribirse si ya existe y que el usuario no debería necesitar crear manualmente tablas.

Revisa especialmente la relación entre `dev.db`, `test.db` y las variables de entorno, para describir correctamente qué base utiliza la aplicación.

No alteres bases de datos existentes.

### 3.5. Inicio de la aplicación

Documenta:

```powershell
npm run dev
```

Explica que el comando inicia el frontend y el backend.

Incluye las direcciones locales previstas, verificando que siguen vigentes:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`
- Comprobación de salud: `http://localhost:3001/health`

Explica que la terminal debe permanecer abierta mientras se utiliza la aplicación.

Indica cómo detener ambos servidores mediante `Ctrl+C`.

### 3.6. Primera ejecución

Aclara que una instalación nueva normalmente comienza sin clientes ni simulaciones.

Explica que los registros creados en una instalación local anterior no se descargan automáticamente desde GitHub.

Describe de forma sencilla dónde se guardan los datos y cómo persisten entre reinicios.

No asegures que un archivo concreto se encuentra en una ubicación determinada sin verificar la configuración real.

### 3.7. Verificación del proyecto

Documenta:

```powershell
npm run verify
```

Explica las comprobaciones que realiza realmente:

- Pruebas automatizadas.
- Comprobación de tipos.
- Lint.
- Compilación del frontend.
- Compilación del backend.

Comprueba el contenido del script antes de enumerarlas como definitivas.

Aclara que es una verificación técnica opcional para utilizar la aplicación, pero recomendada para comprobar la integridad del proyecto.

### 3.8. Solución de problemas frecuentes

Incorpora una sección de diagnóstico para situaciones como:

- Node.js o npm no reconocidos.
- Git no instalado.
- Fallo durante la descarga de dependencias.
- Error de instalación de paquetes.
- Puertos 3001 o 5173 ocupados.
- Frontend accesible, pero API no disponible.
- Errores de conexión con SQLite.
- Problemas al ejecutar Prisma.
- Aplicación iniciada sin clientes registrados.
- Terminal cerrada accidentalmente.

Ofrece soluciones seguras y concretas.

No recomiendes borrar bases de datos, ejecutar `prisma migrate reset` ni utilizar comandos destructivos como solución genérica.

---

## 4. Nueva guía de uso de la aplicación

Crea el archivo:

`docs/user-guide.md`

Debe ser una guía práctica dirigida a un evaluador o usuario final, no una explicación interna de la arquitectura.

Organízala siguiendo el recorrido habitual de uso de la aplicación.

### 4.1. Acceso al dashboard

Explica cómo acceder mediante:

`http://localhost:5173`

Describe las secciones principales del dashboard según su implementación real.

Utiliza los nombres visibles en la interfaz, evitando inventar etiquetas.

### 4.2. Registro de clientes

Explica el proceso para registrar una empresa.

Documenta los campos disponibles:

- Nombre de empresa.
- Identificación fiscal.
- Correo electrónico.
- País.
- Plan.

Describe qué información se solicita y qué restricciones se aplican.

Explica también si los datos se normalizan automáticamente antes de guardarse.

### 4.3. Validaciones: datos aceptados y rechazados

**Esta es una de las secciones más importantes de la guía. Debe ser especialmente clara, precisa y útil.**

Analiza las validaciones implementadas en el backend.

Revisa especialmente:

`backend/src/modules/customers/customer.schema.ts`

`backend/src/modules/customers/tax-id.ts`

Y sus correspondientes pruebas automatizadas.

Documenta los criterios realmente implementados para:

**España**

- DNI.
- NIE.
- NIF de entidades.

**Francia**

- Identificador SIREN.

**Alemania**

- Identificador fiscal alemán admitido por la aplicación.

Explica las diferencias de formato y las comprobaciones reales.

No atribuyas a la aplicación verificaciones contra registros oficiales ni comprobaciones externas que no existan.

Distingue la validación de formato, las letras o dígitos de control y cualquier otra condición realmente implementada.

### 4.4. Tablas de ejemplos válidos e inválidos

Incluye tablas por país con ejemplos claros.

Como punto de partida, revisa los siguientes valores utilizados durante el desarrollo:

| País | Valor | Resultado esperado |
|---|---|---|
| España | `12345678Z` | Válido |
| España | `12345678A` | Inválido |
| España | `X0000000T` | Válido |
| España | `B12345674` | Válido |
| Francia | `123456789` | Válido según validación conocida |
| Francia | `FR123456789` | Inválido según validación conocida |
| Alemania | `DE123456789` | Válido según validación conocida |
| Alemania | `DE12345` | Inválido |

**Estos ejemplos son referencias iniciales, no datos que debas aceptar sin comprobar.**

Verifica cada valor contra el código y las pruebas de la versión actual.

Si alguno no es válido o no representa adecuadamente las reglas implementadas, sustitúyelo por otro comprobado.

Incluye también ejemplos de:

- Correos electrónicos válidos e inválidos.
- Nombres de empresa aceptados y rechazados.
- Identificadores con espacios exteriores.
- Identificadores con separadores internos no admitidos.
- Valores obligatorios que no pueden quedar vacíos.

Explica si los identificadores se transforman a mayúsculas o si se eliminan espacios exteriores.

### 4.5. Mensajes de error

Documenta cómo responde la aplicación cuando los datos de un cliente son incorrectos.

Incluye casos como:

- Identificación fiscal inválida para el país seleccionado.
- Correo electrónico incorrecto.
- Nombre de empresa no válido.
- Campos obligatorios incompletos.
- Cliente duplicado.
- Error de conexión con el servidor.

Describe los mensajes que realmente muestra el frontend.

Si la mejora reciente del tratamiento de errores ya está implementada, refleja esos mensajes específicos.

Si no está implementada, no afirmes que existe.

No confundas los mensajes internos del backend con los textos visibles para el usuario.

### 4.6. Búsqueda y selección de clientes

Explica cómo:

- Consultar los clientes registrados.
- Buscar clientes.
- Seleccionar un cliente.
- Acceder a su historial.

Documenta los criterios de búsqueda y las limitaciones reales de la interfaz.

### 4.7. Creación de simulaciones

Explica el proceso completo de creación de una simulación de facturación.

Describe los campos reales del formulario, incluidos los usuarios activos, el plan, el almacenamiento y las llamadas a la API, cuando correspondan.

Aclara cuáles de estos campos intervienen en el cálculo y cuáles son únicamente informativos.

Documenta las tarifas progresivas vigentes:

- Primeros 10 usuarios: 10 € por usuario.
- Usuarios del 11 al 50: 8 € por usuario.
- Usuarios a partir del 51: 5 € por usuario.

Explica el carácter acumulativo de los tramos.

Incluye un ejemplo numérico comprobado con el código, mostrando cómo se obtiene el subtotal.

Documenta también los impuestos simplificados de España, Francia y Alemania, según las reglas implementadas.

### 4.8. Vista previa y guardado

Explica la diferencia entre:

- Calcular una vista previa.
- Confirmar y guardar la simulación.

Destaca que la vista previa no persiste una simulación cuando ese sea el comportamiento real.

Aclara qué ocurre tras confirmar el guardado.

### 4.9. Historial de simulaciones

Explica cómo:

- Consultar simulaciones anteriores.
- Navegar entre páginas.
- Visualizar detalles.
- Interpretar los importes.
- Consultar la información utilizada para el cálculo.

Utiliza únicamente funcionalidades presentes en la versión actual.

### 4.10. Conversión de divisas

Documenta:

- Cómo seleccionar una divisa.
- Qué importes se convierten.
- Cuál es la moneda base.
- Qué ocurre cuando no hay tipos de cambio disponibles.
- Qué limitaciones tiene la conversión.

Explica de forma comprensible si se utiliza una API externa, caché o valores conservados ante fallos, siempre que ese comportamiento esté confirmado.

No documentes tipos de cambio fijos como si fueran valores permanentes.

### 4.11. Eliminación de clientes y simulaciones

Comprueba si las funcionalidades de eliminación encargadas recientemente están implementadas.

Si existen, documenta detalladamente:

- Cómo eliminar un cliente.
- Cómo cancelar una eliminación.
- La confirmación previa.
- La eliminación de las simulaciones asociadas al cliente.
- Cómo eliminar una simulación individual.
- La conservación de las demás simulaciones.
- La irreversibilidad de los borrados.

**Si estas funcionalidades todavía no existen, no las presentes como disponibles.** Señala la situación en el informe final, sin inventar pasos de uso.

### 4.12. Ejemplo de uso completo

Incluye un recorrido práctico desde cero:

1. Iniciar SaaS-O-Matic.
2. Crear un cliente con datos ficticios válidos.
3. Buscarlo en el listado.
4. Seleccionarlo.
5. Configurar una simulación.
6. Calcular la vista previa.
7. Confirmar el guardado.
8. Consultar el historial.
9. Visualizar los detalles y las divisas.
10. Probar la eliminación, únicamente si está implementada.

Todos los valores utilizados en este ejemplo deben ser compatibles con las validaciones reales.

El recorrido debe poder reproducirse sin modificar código.

---

## 5. Calidad editorial y accesibilidad de la documentación

Ambas guías deben cumplir las siguientes condiciones:

- Redacción en español.
- Tono profesional, directo y didáctico.
- Estructura Markdown clara.
- Índice de contenidos si la extensión lo justifica.
- Encabezados jerárquicos correctos.
- Comandos diferenciados de sus resultados esperados.
- Tablas legibles.
- Ejemplos reproducibles.
- Enlaces relativos correctos.
- Explicación de términos técnicos cuando sea necesario.
- Ausencia de información duplicada innecesaria.
- Coherencia entre ambas guías.

No presupongas que el lector conoce Prisma, SQLite, Vite o Express.

Explica únicamente los detalles técnicos necesarios para instalar y utilizar la aplicación.

No conviertas la guía de uso en un documento de arquitectura.

---

## 6. Capturas de pantalla y evidencias visuales

Revisa el contenido de:

`docs/evidence/`

Identifica qué capturas existentes pueden reutilizarse para ilustrar las guías.

Prioriza imágenes reales de:

- Dashboard.
- Formulario de creación de clientes.
- Ejemplo de validación incorrecta.
- Vista previa de facturación.
- Historial de simulaciones.
- Detalles de una simulación.
- Confirmaciones de eliminación, si existen.

Utiliza rutas relativas compatibles con GitHub.

No inventes capturas ni utilices imágenes simuladas como evidencias reales.

Si no dispones de capturas adecuadas, documenta cuáles sería recomendable incorporar posteriormente.

No introduzcas referencias a archivos inexistentes.

---

## 7. Actualización del README

Actualiza:

`README.md`

El README debe continuar siendo una presentación concisa del proyecto.

No copies allí el contenido completo de ambas guías.

Mantén:

- Descripción de SaaS-O-Matic.
- Funcionalidades principales.
- Tecnologías.
- Requisitos básicos.
- Instalación rápida.
- Ejecución.
- Verificación.
- Enlaces a documentación.

Añade enlaces visibles a:

```markdown
- [Guía de instalación y ejecución](docs/installation-guide.md)
- [Guía de uso de SaaS-O-Matic](docs/user-guide.md)
```

Conserva los comandos actuales de instalación y ejecución si siguen siendo correctos.

No modifiques el funcionamiento de los scripts.

---

## 8. Integración con la documentación existente

Revisa también:

- `docs/requirements.md`
- `docs/architecture.md`
- `ai-workspace/README.md`
- `ai-workspace/02-ai-prompts.md`
- `ai-workspace/04-development-log.md`
- `ai-workspace/05-quality-review.md`
- Otros documentos relacionados que existan realmente.

Actualiza únicamente las referencias o secciones necesarias.

### Registro de desarrollo

Si existe un registro cronológico de desarrollo, añade una entrada que describa:

- La creación de las dos guías.
- La finalidad de la mejora.
- Los documentos afectados.
- Las comprobaciones realizadas.
- La fecha real de la intervención.

### Registro de interacciones con IA

En `ai-workspace/02-ai-prompts.md`, registra esta intervención de Codex siguiendo la estructura existente.

Incorpora el texto completo de este prompt si el documento contiene los prompts originales utilizados.

No dupliques entradas previamente añadidas.

Preserva la numeración y los desplegables `<details>` existentes.

Presta especial atención a los saltos de línea alrededor de `<details>`, `<summary>` y los bloques de código para que GitHub renderice correctamente el documento.

### Revisión de calidad

Si la documentación de calidad contiene una sección sobre reproducibilidad, instalación o completitud documental, actualízala con los resultados reales de esta intervención.

No modifiques cifras históricas de pruebas ni inventes nuevas.

---

## 9. Validación de las guías

Una vez creadas, comprueba su exactitud.

### Instalación

Verifica que los comandos documentados coincidan con los scripts existentes.

Si el entorno permite realizar una instalación limpia de manera segura y aislada, puedes comprobarla sin modificar el proyecto original ni utilizar sus bases de datos.

En caso contrario, realiza una revisión estática y especifica qué pasos no se han ejecutado.

### Validaciones de clientes

Contrasta los ejemplos de datos válidos e inválidos con los esquemas y las pruebas existentes.

Si es necesario, utiliza pruebas específicas en un entorno aislado, evitando introducir registros en la base de datos de desarrollo.

### Enlaces y Markdown

Comprueba:

- Existencia de los archivos referenciados.
- Validez de las rutas relativas.
- Jerarquía de encabezados.
- Correcto cierre de bloques de código.
- Correcto funcionamiento de los desplegables.
- Ausencia de enlaces rotos a imágenes.

### Verificación técnica

Si el trabajo no introduce cambios de código, prioriza las comprobaciones documentales y de consistencia.

También puedes ejecutar:

```bash
npm run verify
```

Siempre que el entorno permita hacerlo.

Si lo ejecutas, informa de los resultados reales.

No afirmes que una instalación o una prueba ha sido satisfactoria si no se ha ejecutado.

---

## 10. Restricciones obligatorias

Durante toda la tarea:

1. No modifiques la arquitectura de SaaS-O-Matic.
2. No alteres funcionalidades del frontend o backend.
3. No modifiques las reglas de validación fiscal.
4. No cambies las fórmulas de facturación.
5. No modifiques el esquema ni las migraciones de Prisma.
6. No cambies los scripts de instalación y ejecución.
7. No introduzcas dependencias.
8. No elimines registros de clientes o simulaciones.
9. No modifiques archivos `.env`.
10. No ejecutes operaciones destructivas sobre bases de datos.
11. No sobrescribas cambios previos del usuario.
12. Conserva las entradas históricas de la documentación.
13. No inventes funcionalidades, capturas ni resultados de pruebas.
14. No crees commits sin autorización.
15. No ejecutes `git push`.
16. No alteres la copia independiente utilizada anteriormente para comprobar la instalación limpia.

Trabaja únicamente sobre el repositorio original abierto en el entorno de Codex.

---

## 11. Metodología de trabajo

### Fase 1. Inspección

Analiza el código, las pruebas, la documentación y los scripts actuales.

Identifica las funcionalidades disponibles y las reglas reales de validación.

### Fase 2. Guía de instalación

Crea `docs/installation-guide.md` con instrucciones reproducibles, explicaciones y resolución de problemas.

### Fase 3. Guía de uso

Crea `docs/user-guide.md`, documentando todas las funciones actuales y los ejemplos de entrada válidos e inválidos.

### Fase 4. Integración documental

Actualiza el README y los documentos relacionados.

Registra la intervención de Codex respetando el historial de trabajo.

### Fase 5. Verificación

Comprueba comandos, rutas, ejemplos, enlaces, formato Markdown y correspondencia con la implementación.

### Fase 6. Revisión final

Inspecciona el diff de Git y confirma que solo existen modificaciones documentales necesarias.

No publiques cambios automáticamente.

---

## 12. Informe final obligatorio

Al terminar, presenta un informe que incluya:

**A. Resumen:** descripción de las dos guías creadas.

**B. Archivos modificados:** relación de archivos nuevos y actualizados.

**C. Validaciones documentadas:** resumen de las reglas para España, Francia y Alemania y cómo se han comprobado los ejemplos.

**D. Funcionalidades documentadas:** confirmación de las capacidades realmente disponibles, incluidas las eliminaciones si ya están implementadas.

**E. Comprobaciones:** resultados de revisión de enlaces, Markdown, scripts y pruebas ejecutadas.

**F. Limitaciones:** cualquier instrucción no verificada, captura pendiente o discrepancia encontrada.

**G. Git:** confirmación de que no se han creado commits ni subido cambios.

---

## 13. Criterios de aceptación

El trabajo estará completado cuando:

- Exista una guía detallada de instalación y ejecución.
- Exista una guía práctica de uso.
- Ambas estén redactadas en español y sean comprensibles para un evaluador.
- Los comandos de instalación correspondan a los scripts reales.
- Se expliquen claramente las validaciones de clientes.
- Existan ejemplos comprobados de entradas válidas e inválidas.
- Se documenten las tarifas, los impuestos y el comportamiento de las simulaciones.
- Se describan únicamente funcionalidades realmente implementadas.
- El README enlace correctamente las nuevas guías.
- Los enlaces internos y las referencias visuales sean válidos.
- La documentación existente permanezca coherente.
- No se hayan modificado funcionalidades ni introducido regresiones.
- No se hayan creado commits ni publicado cambios en GitHub.

## 14. Instrucción final

**Comienza inspeccionando el repositorio actual y después crea las dos guías completas, verificando cada instrucción y cada ejemplo con la implementación real.**

Tienes autonomía para decidir la mejor organización y redacción de los documentos, siempre que respetes el alcance indicado.

Prioriza la exactitud técnica, la claridad, la reproducibilidad y la facilidad de uso.

La documentación debe permitir que una persona que nunca ha visto SaaS-O-Matic pueda descargarlo, instalarlo, ejecutarlo, registrar correctamente su primer cliente y realizar una simulación sin ayuda adicional.

**No realices cambios funcionales ni commits. Deja toda la documentación preparada para su revisión antes de la entrega final.**
````

</details>
