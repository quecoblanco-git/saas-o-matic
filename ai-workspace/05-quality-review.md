# 05 — Estrategia de calidad y revisión técnica

## 1. Objetivo

Este documento define la estrategia de control de calidad de SaaS-O-Matic y registra las comprobaciones realizadas durante su desarrollo.

El objetivo es verificar que la aplicación cumple los requisitos funcionales, que los cálculos son correctos y que el código asistido por inteligencia artificial es seguro, comprensible y mantenible.

Se distinguirán las pruebas previstas de las pruebas realmente ejecutadas, conservando los resultados y las evidencias correspondientes.

## 2. Principios de calidad

El desarrollo seguirá estos principios:

- **Corrección funcional:** comprobar que cada funcionalidad cumple sus requisitos.
- **Validación de entradas:** rechazar datos inválidos antes de procesarlos.
- **Seguridad:** evitar la exposición de información sensible y controlar las entradas externas.
- **Precisión monetaria:** utilizar una estrategia de cálculo y redondeo definida.
- **Mantenibilidad:** separar responsabilidades y evitar duplicaciones innecesarias.
- **Trazabilidad:** relacionar requisitos, pruebas, correcciones y resultados.
- **Supervisión humana:** revisar las propuestas de IA antes de considerarlas válidas.

La generación de código mediante IA no sustituirá las pruebas ni la revisión técnica.

---

## 3. Niveles de comprobación

### 3.1. Pruebas unitarias

Se utilizarán para comprobar funciones y reglas de negocio de forma aislada.

Se priorizarán:

- Cálculo de precios por tramos acumulativos.
- Validación de identificadores fiscales españoles.
- Cálculo de impuestos.
- Cálculos monetarios y redondeos.
- Conversión entre divisas.

### 3.2. Pruebas de integración

Se utilizarán para comprobar la interacción entre los componentes del backend.

Se contemplarán:

- Creación y recuperación de clientes.
- Persistencia de simulaciones.
- Asociación de simulaciones con clientes.
- Validación de datos recibidos por la API.
- Gestión de errores y respuestas HTTP.

### 3.3. Pruebas de interfaz

Se utilizarán para comprobar los principales flujos de usuario.

Se contemplarán:

- Búsqueda de clientes.
- Visualización de tarjetas e historial.
- Actualización de simulaciones mediante controles interactivos.
- Estados de carga y error.
- Presentación responsive.

### 3.4. Comprobaciones estáticas y de compilación

Se revisarán los errores de TypeScript, la compilación de los proyectos y las herramientas de análisis disponibles.

Las comprobaciones se ejecutarán mediante comandos reproducibles y se registrarán sus resultados.

---

## 4. Casos críticos previstos

### 4.1. Facturación por tramos acumulativos

La tarifa de usuarios definida en el enunciado es:

| Tramo                   | Precio por usuario |
| ----------------------- | -----------------: |
| Usuarios 1–10           |               10 € |
| Usuarios 11–50          |                8 € |
| Usuarios 51 en adelante |                5 € |

Los tramos son acumulativos: cada usuario se factura según el tramo que le corresponde.

| Usuarios | Importe esperado sin impuestos ni extras | Estado    |
| -------: | ---------------------------------------: | --------- |
|        1 |                                     10 € | Pendiente |
|       10 |                                    100 € | Pendiente |
|       11 |                                    108 € | Pendiente |
|       15 |                                    140 € | Pendiente |
|       50 |                                    420 € | Pendiente |
|       51 |                                    425 € | Pendiente |
|      100 |                                    670 € | Pendiente |

También se comprobará el comportamiento ante cero usuarios, cantidades negativas, valores decimales y entradas no numéricas. Los resultados esperados para esas entradas inválidas se definirán en las especificaciones.

### 4.2. Validación fiscal española

Se prepararán casos válidos e inválidos para los tipos de identificadores españoles que se acuerde admitir.

Las comprobaciones deberán contemplar:

- Formato y longitud.
- Caracteres permitidos.
- Algoritmos oficiales de control.
- Identificadores con caracteres de control incorrectos.
- Entradas vacías o malformadas.

Los casos concretos se definirán después de especificar las reglas de validación de DNI, NIE y NIF de entidades.

### 4.3. Impuestos

Se comprobará que:

- El impuesto corresponde al país configurado.
- La base imponible y el impuesto se calculan por separado.
- El total es coherente con ambos importes.
- Se aplica la política de redondeo definida.
- Los países o configuraciones no admitidos reciben una respuesta controlada.

Las tasas concretas están pendientes de especificación.

### 4.4. Persistencia

Se comprobará que:

- Los clientes se almacenan correctamente.
- Las simulaciones se asocian al cliente correspondiente.
- Los cálculos guardados pueden recuperarse.
- Las referencias a clientes inexistentes se rechazan.
- Los datos inválidos no generan registros inconsistentes.

### 4.5. Conversión de divisas

Se comprobará que:

- Los importes se calculan inicialmente en euros.
- La conversión utiliza el tipo de cambio obtenido de la fuente configurada.
- Se admiten EUR, USD y GBP.
- Los importes convertidos se muestran con el formato adecuado.
- Los errores de red y las respuestas inválidas se gestionan correctamente.
- La interfaz informa del estado de carga y de los errores.

Se definirán pruebas con respuestas simuladas para evitar depender de una API pública durante las pruebas automatizadas.

### 4.6. Interfaz y experiencia de usuario

Se comprobarán los flujos principales del dashboard:

- Búsqueda por empresa o identificador fiscal.
- Visualización de clientes y simulaciones.
- Modificación del número de usuarios.
- Actualización del importe proyectado.
- Visualización en distintos tamaños de pantalla.
- Mensajes comprensibles ante errores y estados vacíos.

---

## 5. Revisión del código asistido por IA

Antes de aceptar una propuesta de implementación se revisarán los siguientes aspectos:

| Área           | Pregunta de revisión                                        |
| -------------- | ----------------------------------------------------------- |
| Requisitos     | ¿Cumple exactamente el comportamiento solicitado?           |
| Lógica         | ¿Los cálculos y condiciones son correctos?                  |
| Validación     | ¿Se comprueban las entradas externas?                       |
| Seguridad      | ¿Existen riesgos evitables o exposición de datos?           |
| Arquitectura   | ¿Respeta la separación de responsabilidades?                |
| Tipado         | ¿Los tipos representan correctamente los datos?             |
| Errores        | ¿Se gestionan los fallos previsibles?                       |
| Pruebas        | ¿Existen casos que permitan detectar regresiones?           |
| Mantenibilidad | ¿El código es comprensible y evita complejidad innecesaria? |

Cuando una propuesta requiera correcciones, se documentará la causa y la verificación posterior.

---

## 6. Estado actual de las comprobaciones

**Estado:** Preparación inicial completada; validación funcional pendiente.

| Comprobación                             | Estado    | Evidencia                                    |
| ---------------------------------------- | --------- | -------------------------------------------- |
| Compilación inicial del frontend         | Superada  | [Captura](evidence/03-frontend-build.png)    |
| Validación del esquema inicial de Prisma | Superada  | [Captura](evidence/04-prisma-validation.png) |
| Pruebas unitarias de facturación         | Pendiente | —                                            |
| Pruebas de validación fiscal             | Pendiente | —                                            |
| Pruebas de integración de la API         | Pendiente | —                                            |
| Pruebas de interfaz                      | Pendiente | —                                            |
| Pruebas de conversión de divisas         | Pendiente | —                                            |
| Revisión final de seguridad              | Pendiente | —                                            |
| Verificación de instalación desde cero   | Pendiente | —                                            |

Las comprobaciones iniciales verifican la configuración técnica, pero no acreditan el funcionamiento de las características solicitadas.

## 7. Registro de incidencias y correcciones

Las incidencias significativas se documentarán con:

- Identificador y fecha.
- Funcionalidad afectada.
- Comportamiento observado.
- Comportamiento esperado.
- Causa identificada, cuando sea conocida.
- Corrección aplicada.
- Prueba de regresión.
- Resultado de la nueva verificación.

Se enlazará la iteración correspondiente de `04-development-log.md` y, cuando proceda, la interacción de IA de `02-ai-prompts.md`.

## 8. Criterios de aceptación final

Antes de considerar finalizada la entrega, se verificará que:

1. Los requisitos obligatorios están implementados o las limitaciones se encuentran justificadas.
2. Las reglas de facturación están cubiertas por pruebas.
3. Las validaciones fiscales y de entradas funcionan correctamente.
4. Las operaciones principales de la API están comprobadas.
5. Las simulaciones se almacenan y recuperan correctamente.
6. La interfaz permite completar los flujos principales.
7. La conversión de divisas gestiona los errores previsibles.
8. Los proyectos compilan y las pruebas automatizadas pasan.
9. El README permite instalar y ejecutar la aplicación.
10. La documentación refleja fielmente el desarrollo y las verificaciones realizadas.

---

_Estrategia definida durante la fase de planificación. Los resultados se actualizarán a medida que se ejecuten las pruebas._
