# 03 — Registro de decisiones técnicas

## 1. Objetivo

Este documento recoge las decisiones técnicas relevantes tomadas durante el desarrollo de SaaS-O-Matic.

Su finalidad es justificar las elecciones de arquitectura, tecnologías y organización del proyecto, así como identificar sus ventajas, limitaciones y posibles alternativas.

Las decisiones se documentarán de forma progresiva. Cuando una decisión cambie durante el desarrollo, se registrará el motivo y sus consecuencias.

## 2. Criterios generales

Las decisiones técnicas se evaluarán teniendo en cuenta:

- Cumplimiento de los requisitos del enunciado.
- Claridad y mantenibilidad del código.
- Separación de responsabilidades.
- Facilidad de implementación y verificación.
- Seguridad y validación de datos.
- Simplicidad de instalación y ejecución.
- Adecuación al alcance de una prueba técnica.

Se priorizará una solución comprensible y verificable frente a una arquitectura innecesariamente compleja.

---

## 3. Decisiones adoptadas

### DT-001 — Uso de TypeScript en frontend y backend

**Estado:** Adoptada  
**Fase:** Preparación del entorno

**Contexto**

El ejercicio requiere un frontend interactivo y un backend con API REST. El enunciado permite elegir las tecnologías, con preferencia por Node.js con TypeScript o Python para el backend.

**Decisión**

Utilizar TypeScript tanto en el frontend como en el backend.

**Justificación**

- Mantener un lenguaje común en ambos proyectos.
- Disponer de comprobaciones estáticas de tipos.
- Facilitar la definición de contratos y estructuras de datos.
- Detectar determinados errores durante el desarrollo.

**Alternativas posibles**

JavaScript sin TypeScript o Python para el backend. No se realizó una evaluación comparativa formal de estas alternativas.

**Consecuencias**

Será necesario mantener las definiciones de tipos y comprobar que la información intercambiada entre frontend y backend respeta los contratos establecidos.

### DT-002 — React y Vite para el frontend

**Estado:** Adoptada  
**Fase:** Preparación del entorno

**Contexto**

La aplicación necesita un dashboard comercial interactivo, formularios dinámicos, búsqueda de clientes y visualización de simulaciones.

**Decisión**

Utilizar React con Vite y TypeScript.

**Justificación**

- React permite construir interfaces mediante componentes reutilizables.
- Facilita la gestión de estados interactivos.
- Vite proporciona un entorno de desarrollo y compilación sencillo.
- La combinación es adecuada para una aplicación de alcance limitado con varias vistas.

**Alternativas posibles**

Angular, Vue, Svelte o Next.js, entre otras opciones admitidas por el enunciado.

**Consecuencias**

Será necesario definir una estructura de componentes clara y gestionar adecuadamente las peticiones a la API, los estados de carga y los errores.

### DT-003 — Express para la API REST

**Estado:** Adoptada  
**Fase:** Preparación del entorno

**Contexto**

El backend debe gestionar clientes, simulaciones, validaciones y persistencia de datos.

**Decisión**

Utilizar Node.js con Express y TypeScript.

**Justificación**

- Permite implementar una API REST sin introducir una estructura excesivamente compleja.
- Facilita la organización modular de rutas, controladores y lógica de negocio.
- Comparte el ecosistema de JavaScript y TypeScript con el frontend.

**Alternativas posibles**

Fastify, NestJS o un backend desarrollado en Python.

**Consecuencias**

La separación entre validación, lógica de negocio y acceso a datos deberá establecerse explícitamente durante el diseño de la arquitectura.

### DT-004 — SQLite y Prisma para la persistencia

**Estado:** Adoptada  
**Fase:** Preparación del entorno

**Contexto**

El enunciado establece SQLite como base de datos obligatoria. La aplicación necesita almacenar clientes y simulaciones.

**Decisión**

Utilizar SQLite como base de datos y Prisma como herramienta de acceso a datos.

**Justificación**

- SQLite cumple el requisito del ejercicio y no necesita un servidor de base de datos independiente.
- Prisma permite definir modelos de datos y gestionar migraciones.
- El uso de un ORM facilita la organización del acceso a la persistencia.

**Alternativas posibles**

Acceso directo a SQLite mediante consultas SQL o utilización de otra biblioteca de acceso a datos.

**Consecuencias**

Deberán definirse los modelos, relaciones, restricciones y migraciones. La configuración inicial de Prisma no implica que la base de datos funcional esté implementada.

### DT-005 — Separación de frontend y backend

**Estado:** Adoptada  
**Fase:** Preparación del entorno

**Contexto**

El ejercicio requiere dos partes diferenciadas que se comuniquen entre sí.

**Decisión**

Mantener los proyectos en carpetas independientes: `frontend/` y `backend/`.

**Justificación**

- Separar la interfaz de usuario de la lógica del servidor.
- Facilitar la organización de dependencias y scripts.
- Permitir comprobar cada parte de forma independiente.

**Consecuencias**

Será necesario configurar la comunicación entre ambos proyectos y documentar los pasos para ejecutarlos conjuntamente.

### DT-006 — Uso de Prisma 7.10.1

**Estado:** Adoptada  
**Fase:** Preparación del entorno

**Contexto**

Durante la preparación del proyecto se detectó que la actualización ofrecida por Prisma correspondía a una versión candidata a lanzamiento de la siguiente versión principal.

**Decisión**

Mantener Prisma 7.10.1 en lugar de actualizar a Prisma 8.0.0-rc.33.

**Justificación**

- Evitar introducir cambios de una versión principal candidata a lanzamiento durante la preparación.
- Mantener una versión que ya había sido instalada y validada correctamente.
- Reducir cambios innecesarios antes de comenzar el desarrollo.

**Verificación**

El comando `npx prisma validate --config prisma7.config.ts` confirmó que el esquema inicial era válido.

**Consecuencias**

Se mantendrá la configuración compatible con Prisma 7 y se revisará cualquier actualización únicamente cuando exista una necesidad concreta.

### DT-007 — Documentación separada del producto y del proceso con IA

**Estado:** Adoptada  
**Fase:** Planificación

**Contexto**

Roams solicita evidencias del proceso de planificación, diseño, interacción con IA y control de calidad.

**Decisión**

Separar la documentación en:

- `docs/`: especificaciones y documentación técnica de la aplicación.
- `ai-workspace/`: planificación, prompts, decisiones, iteraciones y evidencias del proceso con IA.

**Justificación**

- Facilitar la navegación y revisión de la entrega.
- Evitar mezclar especificaciones técnicas con registros del proceso.
- Permitir que el evaluador consulte directamente las evidencias solicitadas.

**Consecuencias**

Se utilizarán enlaces entre documentos para evitar duplicaciones y mantener la información organizada.

### DT-008 — Documentación en español

**Estado:** Adoptada  
**Fase:** Planificación

**Contexto**

El enunciado de la prueba está redactado en español y la documentación debe explicar decisiones técnicas con claridad.

**Decisión**

Redactar la documentación explicativa en español, manteniendo nombres de archivos, identificadores y código en inglés.

**Justificación**

Facilitar la comprensión, revisión y justificación de las decisiones sin renunciar a convenciones habituales del desarrollo de software.

**Consecuencias**

Se mantendrá una terminología consistente a lo largo de los documentos.

---

## 4. Decisiones pendientes

Las siguientes cuestiones deberán resolverse antes de implementar las funcionalidades afectadas.

| ID     | Decisión pendiente                         | Motivo                                             |
| ------ | ------------------------------------------ | -------------------------------------------------- |
| DT-009 | Modelo de datos de clientes y simulaciones | Definir relaciones, restricciones y campos         |
| DT-010 | Validación fiscal española                 | Determinar algoritmos y casos de prueba            |
| DT-011 | Países e impuestos admitidos               | El enunciado no proporciona una tabla de impuestos |
| DT-012 | Tratamiento de planes SaaS                 | No se especifican diferencias entre planes         |
| DT-013 | Almacenamiento y llamadas a la API         | No se indican tarifas adicionales                  |
| DT-014 | Cálculos monetarios y redondeos            | Evitar errores de precisión                        |
| DT-015 | Integración de tipos de cambio             | Definir actualización y gestión de errores         |
| DT-016 | Estructura modular definitiva              | Establecer responsabilidades y dependencias        |
| DT-017 | Estrategia de pruebas                      | Definir casos críticos y niveles de validación     |

Estas decisiones se desarrollarán durante la fase de especificaciones y arquitectura.

## 5. Seguimiento de cambios

Cuando una decisión adoptada deba modificarse, se documentará:

1. La decisión original.
2. El problema o nueva necesidad detectada.
3. Las alternativas consideradas.
4. La nueva decisión y su justificación.
5. Las consecuencias para el proyecto.

De esta forma, el registro reflejará la evolución real del diseño y no únicamente su estado final.

---

_Documento iniciado durante la fase de planificación, antes de implementar las funcionalidades de SaaS-O-Matic._
