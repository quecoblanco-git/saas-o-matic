# 01 — Planificación inicial de SaaS-O-Matic

> Este documento conserva el plan de la fase inicial. Las cuestiones que entonces estaban abiertas se resolvieron durante el desarrollo; el estado y las comprobaciones actuales se registran en `04-development-log.md` y `05-quality-review.md`.

## 1. Contexto y objetivo

SaaS-O-Matic es una herramienta interna destinada a facilitar al equipo comercial la gestión de clientes corporativos y la simulación de costes mensuales de suscripciones SaaS.

La aplicación deberá permitir registrar clientes, calcular presupuestos mediante un sistema de tarificación acumulativa por tramos, aplicar impuestos según el país y visualizar los importes en diferentes divisas.

El reto se abordará mediante una metodología de desarrollo guiado por especificaciones (_Spec-Driven Development_), utilizando inteligencia artificial como apoyo para la planificación, implementación y revisión del software.

## 2. Alcance funcional

### 2.1. Gestión de clientes

El sistema deberá permitir:

- Registrar clientes corporativos mediante `POST /customers`.
- Almacenar el nombre de la empresa, identificador fiscal, correo electrónico de contacto, país y plan seleccionado.
- Validar los datos recibidos antes de guardarlos.
- Comprobar mediante el algoritmo de control correspondiente la validez del DNI/NIF/CIF cuando el país sea España.
- Buscar clientes por nombre de empresa o identificador fiscal.
- Consultar la información de un cliente y su historial de simulaciones.
- Eliminar clientes de la lista de clientes almacenados.

### 2.2. Simulaciones de facturación

El sistema deberá permitir:

- Registrar simulaciones mediante `POST /simulations`.
- Asociar cada simulación a un cliente existente.
- Introducir el número de usuarios activos, almacenamiento contratado y llamadas estimadas a la API.
- Calcular el coste mensual mediante tarificación acumulativa por tramos.
- Aplicar el impuesto correspondiente al país del cliente.
- Persistir los datos y resultados de cada simulación.
- Consultar las simulaciones guardadas.
- Eliminar las simulaciones almacenadas previamente

### 2.3. Conversión de divisas

La interfaz deberá:

- Consultar una API pública de tipos de cambio.
- Permitir seleccionar diferentes divisas, incluyendo EUR, USD y GBP.
- Convertir dinámicamente los importes calculados.
- Gestionar los estados de carga y error de la API externa.
- Mantener el cálculo original en euros como referencia para la conversión.

### 2.4. Interfaz de usuario

El frontend deberá incluir:

- Un dashboard comercial con búsqueda de clientes.
- Tarjetas responsive con los datos de cada cliente.
- Un historial de simulaciones.
- Un formulario interactivo de simulación.
- Controles dinámicos para modificar el número de usuarios.
- Una actualización inmediata de la proyección del coste mensual.

## 3. Reglas de negocio

### 3.1. Tarificación acumulativa por tramos

El precio mensual base se calculará aplicando los siguientes tramos:

| Tramo | Usuarios        | Precio por usuario |
| ----- | --------------- | ------------------ |
| 1     | Del 1 al 10     | 10 €               |
| 2     | Del 11 al 50    | 8 €                |
| 3     | A partir del 51 | 5 €                |

Cada tramo se aplica únicamente a los usuarios que pertenecen a él.

**Ejemplo para 15 usuarios:**

- Primeros 10 usuarios: 10 × 10 € = 100 €.
- Siguientes 5 usuarios: 5 × 8 € = 40 €.
- Coste mensual base: **140 €**, antes de impuestos.

El algoritmo deberá comprobarse mediante pruebas que cubran los límites de cada tramo.

### 3.2. Validación de identificadores fiscales

Para clientes de España será obligatorio validar el identificador fiscal mediante su algoritmo de control, sin limitarse a comprobar su formato.

Se deberán contemplar los tipos de identificadores indicados en el enunciado y definir casos de prueba válidos e inválidos.

### 3.3. Impuestos

El coste mensual deberá incluir el impuesto correspondiente al país del cliente.

Antes de implementar esta funcionalidad se definirán los países admitidos, los tipos impositivos utilizados y el tratamiento de países no contemplados.

## 4. Ambigüedades identificadas al inicio

Durante la planificación se identificaron las siguientes cuestiones. Todas quedaron resueltas antes de la entrega y su definición vigente se conserva en los documentos enlazados.

| Tema                                       | Resolución documentada                                                                        |
| ------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Planes, almacenamiento y llamadas a la API | Son datos informativos y no añaden costes; aclaraciones AR-001 a AR-003 y decisión DT-020.    |
| Países e impuestos                         | España, Francia y Alemania, con tasas simplificadas; RF-008 y DT-011.                         |
| Identificadores fiscales extranjeros       | Validación básica de formato y longitud para Francia y Alemania; RF-002 y DT-018.             |
| Precisión monetaria                        | Cálculos decimales y redondeo definido en RT-007 y DT-014.                                    |
| Tipos de cambio                            | Caché de una hora y uso de tasas anteriores cuando falla la actualización; RF-009 y DT-015.   |
| Historial                                  | Paginación por cliente, orden descendente y carga inicial de diez registros; RF-005 y RF-010. |

## 5. Plan de implementación

El desarrollo se dividirá en las siguientes fases:

### Fase 1. Especificaciones y arquitectura

- Analizar los requisitos y las restricciones.
- Resolver las ambigüedades funcionales.
- Diseñar el modelo de datos.
- Definir los contratos de la API REST.
- Establecer las responsabilidades de los módulos.
- Preparar los criterios de aceptación y la estrategia de pruebas.

**Resultado esperado:** especificaciones técnicas suficientemente claras para comenzar la implementación.

### Fase 2. Backend y persistencia

- Implementar el modelo de datos con Prisma.
- Crear las migraciones de SQLite.
- Desarrollar las validaciones de entrada.
- Implementar la validación fiscal española.
- Implementar y probar el cálculo acumulativo por tramos.
- Desarrollar los endpoints de clientes y simulaciones.
- Verificar la persistencia de los resultados.

**Resultado esperado:** API REST funcional y comprobada mediante pruebas.

### Fase 3. Frontend comercial

- Diseñar la estructura de vistas y componentes.
- Implementar la búsqueda y visualización de clientes.
- Crear el formulario de registro.
- Mostrar el historial de simulaciones.
- Desarrollar los controles interactivos de facturación.
- Integrar el frontend con la API REST.
- Adaptar la interfaz a diferentes tamaños de pantalla.

**Resultado esperado:** dashboard conectado al backend.

### Fase 4. Conversión de divisas

- Integrar una API pública de tipos de cambio.
- Incorporar la selección de moneda.
- Convertir los importes mostrados.
- Gestionar los estados de carga y error.
- Verificar la coherencia de los cálculos.

**Resultado esperado:** visualización de presupuestos en diferentes divisas.

### Fase 5. Control de calidad y entrega

- Ejecutar pruebas unitarias y de integración.
- Revisar las validaciones y los casos límite.
- Comprobar los flujos completos de la aplicación.
- Revisar la experiencia responsive.
- Auditar el código generado con ayuda de IA.
- Completar el README y las instrucciones de ejecución.
- Preparar la entrega del repositorio.

**Resultado esperado:** aplicación verificable, documentada y lista para evaluación.

## 6. Estrategia de trabajo con inteligencia artificial

La IA se utilizará como apoyo en las distintas fases del desarrollo, siguiendo este procedimiento:

1. Definir el objetivo y los requisitos de la tarea.
2. Proporcionar a la IA el contexto técnico necesario.
3. Solicitar una propuesta de implementación o solución.
4. Revisar la propuesta y contrastarla con las especificaciones.
5. Aplicar los cambios aceptados.
6. Ejecutar las pruebas y comprobaciones correspondientes.
7. Registrar las decisiones, problemas e iteraciones relevantes.

No se considerará válida una funcionalidad únicamente porque el código haya sido generado sin errores aparentes. Cada resultado deberá comprobarse mediante pruebas o verificaciones adecuadas.

Los prompts relevantes y las decisiones tomadas están registrados en `02-ai-prompts.md` y `03-technical-decisions.md`.

## 7. Estado inicial del proyecto

Antes de comenzar la implementación funcional se ha completado la preparación del entorno:

- Frontend React + TypeScript + Vite configurado.
- Tailwind CSS y dependencias iniciales instaladas.
- Backend Express + TypeScript preparado.
- Prisma inicializado con SQLite.
- Herramientas de pruebas instaladas.
- Repositorio Git creado y sincronizado con GitHub.
- Compilación inicial del frontend verificada.
- Esquema inicial de Prisma validado.

**Estado en la fase inicial:** preparación del entorno completada antes de comenzar el desarrollo funcional. Este estado es histórico y no describe la versión actual.

---

_Este documento conserva el plan inicial. Las decisiones y cambios realizados durante el desarrollo se registran en `03-technical-decisions.md` y `04-development-log.md`._
