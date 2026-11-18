# 02 — Registro de interacciones con inteligencia artificial

## 1. Objetivo

Este documento recoge las interacciones relevantes con herramientas de inteligencia artificial utilizadas durante el desarrollo de SaaS-O-Matic.

Su finalidad es mostrar cómo se han planteado las tareas, qué propuestas ha realizado la IA, qué decisiones se han tomado y cómo se han comprobado los resultados.

No se pretende registrar cada mensaje intercambiado, sino conservar las interacciones que aporten información significativa sobre la planificación, la arquitectura, la implementación y el control de calidad.

## 2. Herramientas utilizadas

| Herramienta   | Uso                                                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| ChatGPT       | Preparación del entorno, planificación y organización documental (12/11/2026); apoyo a la implementación registrado el 16/11/2026. |
| Codex Desktop | Prompts inicial, de auditoría y de rediseño; mejoras incrementales, verificación y documentación (13/11 y 17–18/11/2026).          |

Solo se registran herramientas utilizadas durante el proyecto.

## 3. Criterio de registro

Las interacciones históricas de los apartados 4 y 5 se presentan como resúmenes retrospectivos. Los tres prompts originales se reproducen íntegros en el apartado 6, con las adaptaciones editoriales indicadas allí. Los resultados de implementación y verificación se documentan en `04-development-log.md` y `05-quality-review.md`.

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
- Verificación completa del 18/11: 450 pruebas de backend y 30 de frontend superadas; tipos y builds satisfactorios. El lint del frontend informa de dos avisos sobre `setState` dentro de efectos.
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

- Se ejecutó `npm run verify`: 450 pruebas de backend y 30 de frontend superadas; TypeScript y builds correctos.
- El lint finalizó con dos avisos existentes sobre actualizaciones de estado dentro de efectos.
- La revisión responsive y de accesibilidad fue estática. La comprobación visual en navegador quedó pendiente porque el navegador integrado no pudo cargar el servidor local.
- Los cambios, verificaciones y límites se detallan en `04-development-log.md` y `05-quality-review.md`.

---

## 6. Prompts originales utilizados

Los siguientes bloques reproducen los tres prompts más relevantes facilitados durante el desarrollo. Se conservan su contenido e instrucciones, con espacios de presentación normalizados. Las rutas absolutas del equipo se normalizan a la ruta relativa `saas-o-matic/`.

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

Resultado del Prompt 2 — Informe de auditoría técnica de Codex

- Herramienta: Codex Desktop.
- Tipo de revisión: Auditoría estática del proyecto; sin ejecución de pruebas ni modificaciones durante la inspección inicial.
- Nota de contexto: Este informe refleja el estado del proyecto al realizarse la auditoría. Algunos problemas y cifras de pruebas quedaron superados por cambios posteriores; las verificaciones actualizadas constan en 04-development-log.md y 05-quality-review.md. Se han normalizado enlaces locales y niveles de encabezado para integrarlo en este documento.

<details>

<summary>Mostrar el resultado completo de la auditoría del Prompt 2</summary>

1. Resumen ejecutivo
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
