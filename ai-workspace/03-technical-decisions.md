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

### DT-012 — Modelo de planes SaaS con cuota fija

**Estado:** Adoptada
**Fase:** Especificación funcional
**Fecha:** 2026-11-12

**Contexto**

El enunciado exige que cada cliente tenga un plan SaaS seleccionado, pero no especifica los planes disponibles, sus características ni sus precios.

Para implementar una simulación de facturación completa es necesario definir cómo influye el plan en el importe mensual.

**Alternativas consideradas**

1. **Plan único:** simplifica el sistema, pero limita la utilidad de la selección de planes.
2. **Tres planes con cuota fija:** permite diferenciar las suscripciones sin modificar las tarifas por usuarios.
3. **Tres planes con tarifas variables:** ofrece mayor flexibilidad, pero aumenta la complejidad de las reglas de facturación.

**Decisión inicial (sustituida el 13/11/2026 por DT-020)**

Inicialmente se propuso un modelo de tres planes con cuotas mensuales fijas:

| Plan         | Cuota inicialmente propuesta |
| ------------ | ---------------------------: |
| Starter      |                          0 € |
| Professional |                         29 € |
| Enterprise   |                         99 € |

Estas cuotas eran supuestos de diseño propios del proyecto y no precios establecidos por Roams.

**Estado: decisión sustituida.**

Tras recibir las aclaraciones oficiales de Roams el 13/11/2026, se establece que los planes son exclusivamente informativos y no modifican el precio mensual.

Se mantienen los tres planes definidos inicialmente, pero sin cuotas:

| Plan         | Cuota mensual vigente |
| ------------ | --------------------: |
| Starter      |                   0 € |
| Professional |                   0 € |
| Enterprise   |                   0 € |

El coste base mensual se calcula exclusivamente a partir de los tramos acumulativos de usuarios activos, independientemente del plan seleccionado.

Se conserva la decisión inicial para documentar la evolución del proyecto y justificar los cambios realizados.

**Decisión vigente: DT-020.**

**Justificación**

- Mantiene intactos los tramos acumulativos de usuarios exigidos por el enunciado.
- Permite ofrecer distintas opciones comerciales.
- Facilita la comprensión del desglose de la factura.
- Evita introducir reglas de facturación innecesariamente complejas.
- Permite probar de forma independiente el coste del plan y el coste por usuarios.

**Consecuencias**

- Cada cliente tendrá asignado uno de los tres planes.
- La cuota fija del plan se sumará una sola vez por simulación mensual.
- El motor de facturación deberá separar el coste del plan del coste por usuarios.
- Los importes de almacenamiento y llamadas API se añadirán cuando se definan sus tarifas.
- Los impuestos se aplicarán posteriormente sobre la base imponible correspondiente.

**Requisito relacionado:** `RF-007` de `docs/requirements.md`.

### DT-013 — Modelo de facturación de almacenamiento y llamadas API

**Estado:** Adoptada
**Fase:** Especificación funcional
**Fecha:** 2026-11-12

**Contexto**

El enunciado de SaaS-O-Matic exige considerar el almacenamiento y las llamadas API en las simulaciones de facturación, pero no proporciona tarifas ni unidades de cobro.

Es necesario establecer reglas explícitas para calcular estos componentes de forma consistente y verificable.

**Alternativas consideradas**

1. **Tarifas fijas independientes del consumo:** simplifican el cálculo, pero no reflejan las cantidades estimadas por el cliente.
2. **Tarifas proporcionales al consumo:** permiten calcular importes según los GB y las llamadas API utilizadas.
3. **Tarifas por bloques completos:** facilitan la facturación por paquetes, pero introducen saltos en el precio al superar determinados límites.

**Decisión inicial (sustituida el 13/11/2026 por DT-020)**

Inicialmente se propuso un modelo de facturación proporcional al consumo, con las siguientes tarifas:

| Concepto       | Tarifa inicialmente propuesta |
| -------------- | ----------------------------: |
| Almacenamiento |          0,10 € por GB al mes |
| Llamadas API   |   1 € por cada 1.000 llamadas |

Estas tarifas se habrían aplicado por igual a los planes Starter, Professional y Enterprise. El almacenamiento se habría facturado por GB y las llamadas API proporcionalmente, sin redondear a bloques completos de 1.000.

**Estado: decisión sustituida.**

Tras recibir las aclaraciones oficiales de Roams el 13/11/2026, se establece que:

- El coste base mensual depende exclusivamente de los tramos acumulativos de usuarios activos.
- Los planes Starter, Professional y Enterprise son informativos y no añaden cuotas.
- El almacenamiento debe registrarse y mostrarse, pero no genera costes.
- Las llamadas a la API deben registrarse y mostrarse, pero no generan costes.

Se conserva la decisión inicial para documentar la evolución del proyecto y justificar los cambios realizados.

**Decisión vigente: DT-020.**

**Fórmulas**

`costeAlmacenamiento = almacenamientoGB × 0,10`

`costeAPI = llamadasAPI / 1000`

**Justificación**

- Permite relacionar directamente el consumo estimado con el coste mensual.
- Evita saltos artificiales en la facturación de llamadas API.
- Mantiene el motor de cálculo sencillo y fácil de probar.
- Facilita mostrar un desglose comprensible de cada simulación.
- No modifica las tarifas acumulativas por usuarios exigidas por el enunciado.

**Consecuencias**

- El motor de facturación deberá calcular ambos componentes por separado.
- Los importes se incorporarán al subtotal antes de impuestos.
- Se validarán las cantidades recibidas para evitar consumos negativos o entradas inválidas.
- Se definirán pruebas para consumos nulos, valores habituales y cantidades situadas entre bloques de 1.000 llamadas.
- La política de precisión monetaria y redondeo deberá establecerse antes de implementar los cálculos.

**Limitaciones**

Las tarifas son supuestos de diseño propios del proyecto y no precios establecidos por Roams.

**Requisito relacionado:** `RF-007` de `docs/requirements.md`.

### DT-011 — Configuración fiscal simplificada por país

**Estado:** Adoptada
**Fase:** Especificación funcional
**Fecha:** 2026-11-12

**Contexto**

El enunciado de SaaS-O-Matic exige aplicar impuestos según el país del cliente, pero no establece los países admitidos ni las tasas impositivas que deben utilizarse.

Es necesario definir una configuración que permita realizar simulaciones reproducibles y comprobar que el sistema aplica correctamente diferentes porcentajes.

**Alternativas consideradas**

1. **Admitir únicamente España:** simplifica la configuración, pero no permite demostrar el comportamiento con distintos países.
2. **Utilizar una configuración estática de varios países:** permite probar diferentes tasas sin depender de servicios externos.
3. **Integrar un servicio fiscal externo:** podría ofrecer mayor cobertura, pero introduciría dependencias y complejidad innecesarias para el alcance del ejercicio.

**Decisión**

Se adopta una configuración fiscal estática con tres países:

| País     | Código ISO | Impuesto     | Tasa |
| -------- | ---------- | ------------ | ---: |
| España   | ES         | IVA          | 21 % |
| Francia  | FR         | TVA          | 20 % |
| Alemania | DE         | Umsatzsteuer | 19 % |

Las tasas se aplicarán sobre el subtotal mensual, formado por el coste de usuarios, la cuota del plan, el almacenamiento y las llamadas API.

El cálculo de impuestos se realizará en euros antes de cualquier conversión de divisas.

**Justificación**

- Permite demostrar la aplicación de impuestos según el país.
- Facilita la creación de pruebas automatizadas con resultados conocidos.
- Evita dependencias de servicios fiscales externos.
- Mantiene el alcance del proyecto controlado.
- Proporciona un comportamiento determinista para las simulaciones.

**Consecuencias**

- Solo podrán registrarse clientes de los tres países configurados.
- El backend será responsable de seleccionar y aplicar la tasa correspondiente.
- Las simulaciones deberán permitir identificar el subtotal, el impuesto y el total.
- Las tasas deberán mantenerse centralizadas para evitar inconsistencias.
- La política de precisión monetaria y redondeo deberá definirse antes de implementar el motor de facturación.

**Limitaciones**

La configuración está destinada exclusivamente a simulaciones comerciales y no constituye un sistema de facturación fiscal real.

No se contemplan exenciones, operaciones intracomunitarias con inversión del sujeto pasivo, particularidades fiscales de determinados clientes ni cambios históricos en las tasas.

**Requisito relacionado:** `RF-008` de `docs/requirements.md`.

### DT-014 — Precisión monetaria y política de redondeo

**Estado:** Adoptada
**Fase:** Especificación funcional
**Fecha:** 2026-11-12

**Contexto**

SaaS-O-Matic debe calcular importes monetarios a partir de tarifas por usuarios, cuotas de suscripción, almacenamiento, llamadas API e impuestos.

El uso directo de números de coma flotante puede producir errores de precisión en operaciones decimales, por lo que es necesario establecer una estrategia de cálculo consistente y verificable.

**Alternativas consideradas**

1. **Utilizar `Number` de JavaScript:** es sencillo, pero puede introducir errores de precisión en operaciones decimales.
2. **Realizar todos los cálculos en céntimos mediante enteros:** permite representar importes monetarios exactos, pero requiere gestionar cantidades intermedias fraccionarias y conversiones de divisas.
3. **Utilizar una biblioteca de aritmética decimal:** permite operar con valores decimales y controlar explícitamente los redondeos.

**Decisión**

Se utilizará `decimal.js` para realizar los cálculos monetarios del motor de facturación.

Se aplicará la siguiente política:

- Aritmética decimal para los cálculos monetarios.
- Redondeo `ROUND_HALF_UP`.
- Dos decimales para los importes monetarios finales.
- Cálculo de los componentes sin redondeos intermedios innecesarios.
- Redondeo del subtotal después de sumar los componentes.
- Cálculo del impuesto sobre el subtotal redondeado.
- Redondeo del impuesto a dos decimales.
- Cálculo del total mediante la suma del subtotal y el impuesto redondeados.
- Conversión de divisas a partir del total en euros, con redondeo final a dos decimales.

**Ejemplo**

Para un subtotal sin redondear de 184,005 € y una tasa impositiva del 21 %:

| Concepto                        | Resultado |
| ------------------------------- | --------: |
| Subtotal sin redondear          | 184,005 € |
| Subtotal redondeado             |  184,01 € |
| Impuesto del 21 % sin redondear | 38,6421 € |
| Impuesto redondeado             |   38,64 € |
| Total mensual                   |  222,65 € |

**Justificación**

- Evita depender de la precisión binaria de `Number` para representar cantidades monetarias.
- Permite definir reglas de redondeo explícitas.
- Facilita la creación de pruebas con resultados exactos.
- Proporciona cálculos reproducibles.
- Separa las reglas de facturación de la presentación de importes en la interfaz.

**Consecuencias**

- El backend utilizará `decimal.js` en el motor de facturación.
- Los importes persistidos deberán conservar exactamente dos decimales.
- Se evitará utilizar columnas de coma flotante para almacenar cantidades monetarias.
- Se valorará almacenar los importes finales como enteros en céntimos en SQLite.
- Los tipos de cambio recibidos de servicios externos se tratarán como valores decimales.
- El frontend utilizará importes calculados por el backend como referencia para evitar diferencias en las reglas de facturación.

**Limitaciones**

La precisión decimal no garantiza por sí sola la corrección de las reglas de negocio. Será necesario verificar mediante pruebas los tramos acumulativos, las tarifas proporcionales, los impuestos y los casos de redondeo.

La representación definitiva de los importes en SQLite se concretará durante el diseño del modelo de datos.

**Requisito relacionado:** `RT-007` de `docs/requirements.md`.

### DT-010 — Validación de identificadores fiscales españoles

**Estado:** Adoptada
**Fase:** Especificación funcional
**Fecha:** 2026-11-12

**Contexto**

El enunciado de SaaS-O-Matic exige validar estrictamente los identificadores fiscales españoles mediante sus algoritmos de control oficiales.

Una comprobación basada únicamente en expresiones regulares no resulta suficiente, ya que un identificador puede tener un formato correcto y contener un carácter de control inválido.

**Alternativas consideradas**

1. **Validación únicamente mediante expresiones regulares:** sencilla de implementar, pero insuficiente para cumplir el requisito.
2. **Utilización de una API externa de validación fiscal:** podría proporcionar verificaciones adicionales, pero introduciría dependencias externas y posibles restricciones de acceso.
3. **Implementación de algoritmos de control en el backend:** permite comprobar localmente los identificadores sin depender de servicios externos.

**Decisión**

Se implementará en el backend un módulo de validación fiscal española que admita:

- DNI/NIF de personas físicas, verificando la letra de control mediante módulo 23.
- NIE, convirtiendo los prefijos X, Y y Z en sus equivalentes numéricos antes de comprobar la letra.
- NIF de entidades, anteriormente denominado CIF, comprobando el carácter de control mediante el algoritmo correspondiente y las reglas aplicables a cada categoría.

Antes de validar, se eliminarán los espacios exteriores y se convertirán las letras a mayúsculas.

No se eliminarán automáticamente caracteres interiores, guiones ni separadores.

La validación comprobará tanto el formato como el carácter de control.

**Justificación**

- Cumple el requisito de validación algorítmica establecido en el enunciado.
- Evita depender de un servicio externo para las comprobaciones básicas.
- Permite implementar pruebas unitarias deterministas.
- Centraliza la lógica fiscal en el backend.
- Facilita distinguir entre errores de formato y errores de control.
- Permite reutilizar la validación en distintos puntos de la aplicación.

**Consecuencias**

- Se desarrollará un módulo específico para la validación de identificadores españoles.
- La validación se ejecutará antes de registrar clientes cuyo país sea España.
- Los identificadores se normalizarán antes de validarlos y almacenarlos.
- Los identificadores inválidos producirán errores controlados.
- Se incluirán pruebas para DNI/NIF, NIE y NIF de entidades.
- Los casos especiales se concretarán durante la implementación utilizando documentación oficial como referencia.
- La validación de identificadores de otros países se tratará por separado.

**Limitaciones**

La validación algorítmica no acredita que un identificador exista, esté vigente o corresponda realmente a una persona o entidad determinada.

No se realizará una consulta a la Agencia Tributaria para comprobar su situación administrativa.

**Requisito relacionado:** `RF-002` de `docs/requirements.md`.

### DT-018 — Validación simplificada de identificadores fiscales internacionales

**Estado:** Adoptada
**Fase:** Especificación funcional
**Fecha:** 2026-11-12

**Contexto**

SaaS-O-Matic admite clientes de España, Francia y Alemania.

El enunciado exige expresamente una validación estricta mediante algoritmos de control para los identificadores fiscales españoles, pero no establece requisitos equivalentes para los identificadores de otros países.

Es necesario definir qué identificadores se admitirán para Francia y Alemania y qué nivel de validación se aplicará.

**Alternativas consideradas**

1. **Aceptar cualquier identificador no vacío:** implementación sencilla, pero sin garantías mínimas de formato.
2. **Aplicar validación básica de formato y longitud:** permite rechazar entradas malformadas sin introducir complejidad innecesaria.
3. **Implementar algoritmos de control para todos los países:** proporciona una validación más completa, pero aumenta el alcance y los casos especiales que deben contemplarse.
4. **Consultar servicios fiscales externos:** permitiría realizar comprobaciones adicionales, pero introduciría dependencias y posibles restricciones de acceso.

**Decisión**

Se aplicarán las siguientes reglas:

| País            | Identificador admitido                       | Validación                      |
| --------------- | -------------------------------------------- | ------------------------------- |
| España (`ES`)   | DNI/NIF, NIE y NIF de entidades              | Formato y algoritmos de control |
| Francia (`FR`)  | SIREN, exactamente 9 dígitos                 | Formato y longitud              |
| Alemania (`DE`) | USt-IdNr., prefijo `DE` seguido de 9 dígitos | Formato y longitud              |

La validación se realizará en el backend según el país seleccionado.

Antes de validar, se eliminarán los espacios exteriores y se convertirán las letras a mayúsculas.

Para Francia y Alemania no se comprobarán los dígitos de control ni se realizarán consultas a servicios fiscales externos.

**Justificación**

- Cumple el requisito estricto de validación española del enunciado.
- Mantiene un nivel mínimo de comprobación para los demás países.
- Evita ampliar innecesariamente el alcance de la prueba técnica.
- Permite crear pruebas automatizadas deterministas.
- Centraliza las reglas de validación en el backend.
- Facilita incorporar nuevas categorías de identificadores en el futuro.

**Consecuencias**

- El backend deberá seleccionar el validador correspondiente al país.
- Los identificadores inválidos producirán errores controlados.
- Se incluirán pruebas para los formatos admitidos en los tres países.
- La documentación distinguirá claramente entre validación algorítmica y validación básica de formato.
- La ampliación futura a otros identificadores requerirá actualizar las reglas de validación y sus pruebas.

**Limitaciones**

La validación básica de Francia y Alemania no acredita la existencia, vigencia ni titularidad de los identificadores.

Para Francia únicamente se admitirá SIREN, excluyendo SIRET y el número de IVA intracomunitario francés.

Para Alemania únicamente se admitirá USt-IdNr., excluyendo otros identificadores fiscales nacionales.

Estas restricciones son simplificaciones deliberadas del simulador y no representan todas las posibilidades fiscales de cada país.

**Requisito relacionado:** `RF-002` de `docs/requirements.md`.

### DT-019 — Límites técnicos de entrada para simulaciones

**Decisión:** Establecer límites máximos explícitos para los valores numéricos utilizados en las simulaciones de facturación.

**Límites aprobados:**

- Usuarios activos: entre 0 y 100.000.
- Almacenamiento: entre 0 y 1.000.000 GB.
- Llamadas a la API: entre 0 y 100.000.000 mensuales.

Todos los límites son inclusivos y únicamente se admitirán números enteros.

**Justificación:**

- Evitar entradas desproporcionadas o potencialmente problemáticas.
- Mantener un comportamiento predecible en los cálculos de facturación.
- Facilitar la validación de solicitudes mediante Zod.
- Permitir pruebas automatizadas de valores mínimos, máximos y fuera de rango.
- Mantener una separación clara entre el límite visual del slider y el límite técnico del backend.

**Implicaciones técnicas:**

- El backend será responsable de validar los límites antes de calcular y almacenar simulaciones.
- El frontend aplicará las mismas restricciones para ofrecer mensajes de validación inmediatos.
- El slider tendrá un rango de 0 a 500 usuarios, mientras que el campo numérico permitirá introducir hasta 100.000.
- Las solicitudes que superen los límites establecidos serán rechazadas mediante respuestas HTTP controladas.
- Los valores válidos se procesarán utilizando las reglas monetarias definidas en RT-007.

**Requisitos relacionados:** `RF-004`, `RF-011`, `RT-007`.

**Estado:** Decisión aprobada. Pendiente de implementación y pruebas.

### DT-009 — Modelo de datos y persistencia histórica

**Estado:** Adoptada
**Fase:** Diseño técnico
**Fecha:** 2026-11-12

**Contexto**

SaaS-O-Matic necesita almacenar clientes y simulaciones de facturación, permitiendo consultar el historial de cálculos de cada cliente.

El modelo debe mantener la integridad de los datos, evitar duplicidades y conservar los resultados originales de las simulaciones aunque posteriormente cambien las condiciones comerciales.

**Alternativas consideradas**

1. **Una única entidad para clientes y simulaciones:** simplifica inicialmente la estructura, pero provoca duplicación de información y dificulta mantener el historial.
2. **Dos entidades relacionadas, Customer y Simulation:** separa los datos del cliente de los cálculos realizados y permite una relación de uno a muchos.
3. **Un modelo con tablas adicionales para planes, tarifas e impuestos:** ofrece mayor flexibilidad, pero introduce complejidad innecesaria para el alcance inicial del proyecto.

**Decisión**

Se utilizarán dos entidades principales en SQLite mediante Prisma ORM:

- `Customer`: almacenará los datos identificativos del cliente, su país y su plan.
- `Simulation`: almacenará los parámetros y resultados económicos de cada simulación.

Un cliente podrá tener múltiples simulaciones y cada simulación pertenecerá a un único cliente.

Se establecerá una restricción de unicidad compuesta por país e identificador fiscal normalizado.

**Persistencia monetaria**

Los importes monetarios finales se almacenarán como enteros en céntimos, evitando columnas de coma flotante.

Los cálculos se realizarán utilizando `decimal.js`, siguiendo la política de redondeo definida en `DT-014`.

El subtotal se calculará a partir de los componentes sin redondeos intermedios innecesarios. Por ello, los importes individuales almacenados en céntimos serán informativos y no se utilizarán para reconstruir el subtotal.

**Persistencia histórica**

Cada simulación conservará:

- El identificador del cliente.
- El número de usuarios activos.
- Los GB de almacenamiento.
- Las llamadas API estimadas.
- El plan utilizado.
- El país utilizado.
- El porcentaje de impuestos aplicado.
- El desglose económico y el total mensual.
- La fecha de creación.

Las simulaciones serán inmutables desde la API y no se recalcularán automáticamente cuando cambien los datos del cliente o las tarifas.

**Validaciones**

- Los usuarios activos serán números enteros no negativos.
- El almacenamiento se expresará en GB enteros no negativos.
- Las llamadas API serán números enteros no negativos.
- Los identificadores fiscales se normalizarán y validarán antes de almacenarse.
- Los datos de entrada se validarán en el backend antes de realizar operaciones de persistencia.

**Configuración comercial**

Los planes, tarifas de consumo e impuestos se definirán inicialmente mediante una configuración centralizada en el backend.

No se crearán tablas independientes para estas configuraciones en la primera versión.

**Justificación**

- Mantiene un modelo sencillo y adecuado para el alcance de la prueba.
- Evita duplicar los datos de los clientes.
- Facilita consultar el historial de simulaciones.
- Conserva los resultados económicos originales.
- Permite aplicar restricciones de integridad mediante Prisma y SQLite.
- Evita problemas de precisión en la persistencia monetaria.
- Facilita futuras ampliaciones del sistema.

**Consecuencias**

- Se definirán los modelos `Customer` y `Simulation` en `schema.prisma`.
- Se establecerá una relación de uno a muchos.
- Se utilizarán enteros para los importes monetarios almacenados en céntimos.
- Se implementará la restricción de unicidad compuesta para los identificadores fiscales.
- Se crearán pruebas para verificar las relaciones y restricciones de persistencia.
- Las tarifas y los impuestos no se almacenarán inicialmente en tablas independientes.

**Limitaciones**

El modelo está diseñado para una primera versión del simulador y no contempla facturas legales, pagos, renovaciones automáticas ni gestión avanzada de contratos.

Las simulaciones conservan sus resultados originales, pero no incluyen inicialmente un sistema de versionado completo de todas las reglas comerciales.

**Requisitos relacionados:** `RT-008`, `RF-001` y `RF-004` de `docs/requirements.md`.

### DT-015 — Conversión de divisas y gestión de tipos de cambio

**Estado:** Adoptada
**Fase:** Diseño técnico
**Fecha:** 2026-11-12

**Contexto**

SaaS-O-Matic debe permitir visualizar los importes de las simulaciones en EUR, USD y GBP mediante tipos de cambio obtenidos de una API pública.

Es necesario establecer cómo se consultarán las tasas, cómo se evitarán peticiones innecesarias y cómo se gestionarán los errores del servicio externo sin afectar al funcionamiento general de la aplicación.

**Alternativas consideradas**

1. **Consultar la API externa directamente desde el frontend:** implementación sencilla, pero distribuye la gestión de tasas y errores entre los componentes de la interfaz.
2. **Consultar la API desde el backend sin caché:** centraliza la integración, pero puede provocar peticiones repetidas innecesarias.
3. **Consultar la API desde el backend con caché temporal:** centraliza la lógica, reduce las consultas y permite gestionar respuestas antiguas como respaldo.
4. **Persistir los tipos de cambio en SQLite:** permite conservar las tasas entre reinicios, pero introduce complejidad adicional que no resulta necesaria para la primera versión.

**Decisión**

La conversión de divisas se realizará utilizando EUR como moneda base.

El backend consultará la API pública:

`https://open.er-api.com/v6/latest/EUR`

Se utilizarán los tipos de cambio correspondientes a USD y GBP.

**Gestión de caché**

- El backend mantendrá una caché de tipos de cambio en memoria.
- Las tasas obtenidas serán válidas durante una hora desde su recuperación.
- Mientras la caché sea válida, se reutilizarán las tasas almacenadas.
- Una vez transcurrida una hora, el backend intentará obtener tasas actualizadas.
- Si la actualización falla y existen tasas anteriores, podrán utilizarse como respaldo, indicando que están desactualizadas.
- Si no hay tasas disponibles, se deshabilitará temporalmente la conversión a USD y GBP, manteniendo visible el importe original en EUR.

**Precisión monetaria**

Las conversiones utilizarán `decimal.js` y el modo de redondeo `ROUND_HALF_UP`.

El total mensual en EUR se multiplicará por la tasa correspondiente y el resultado se redondeará a dos decimales.

La conversión será únicamente una transformación de presentación y no modificará los cálculos originales.

**Persistencia**

Las simulaciones conservarán sus importes originales en EUR.

No se almacenarán inicialmente los importes convertidos ni los tipos de cambio en SQLite.

La caché de tasas se perderá cuando se reinicie el backend.

**Comportamiento de la interfaz**

- El usuario podrá seleccionar EUR, USD o GBP.
- Se mostrarán estados de carga durante la obtención de tasas.
- Se informará de los errores del servicio externo.
- Se mostrará la fecha de actualización cuando esté disponible.
- Se identificarán las tasas desactualizadas.
- Los errores de conversión no impedirán consultar clientes ni simulaciones.

**Justificación**

- Centraliza la integración con el servicio externo.
- Reduce las peticiones repetidas mediante una caché temporal.
- Permite gestionar fallos del servicio sin interrumpir la aplicación.
- Mantiene la persistencia histórica independiente de las fluctuaciones de divisas.
- Evita incorporar tablas adicionales innecesarias.
- Facilita las pruebas mediante respuestas simuladas de la API externa.

**Consecuencias**

- Se implementará un servicio de tipos de cambio en el backend.
- Se validarán las respuestas de la API externa antes de utilizar sus tasas.
- Se gestionarán los estados de caché válida, desactualizada y no disponible.
- Se implementarán pruebas para conversiones, caché y errores de red.
- El frontend consumirá la información de conversión proporcionada por el backend.
- Los importes en USD y GBP tendrán carácter orientativo.

**Limitaciones**

Los tipos de cambio proceden de un servicio externo y pueden no representar cotizaciones en tiempo real.

La caché en memoria no se comparte entre diferentes instancias del backend ni sobrevive a los reinicios.

No se garantiza que una simulación histórica convertida posteriormente utilice el mismo tipo de cambio que estaba disponible cuando se creó.

**Requisitos relacionados:** `RF-009` y `RT-007` de `docs/requirements.md`.

### DT-016 — Arquitectura modular y separación de responsabilidades

**Estado:** Adoptada
**Fase:** Diseño técnico
**Fecha:** 2026-11-12

**Contexto**

SaaS-O-Matic debe implementar una API REST, un motor de facturación, persistencia de clientes y simulaciones, conversión de divisas y un dashboard interactivo.

El proyecto debe mantener una estructura clara que facilite el desarrollo incremental, las pruebas automatizadas y la revisión del código.

Es necesario decidir cómo organizar el frontend y el backend sin introducir complejidad innecesaria para el alcance de la prueba técnica.

**Alternativas consideradas**

1. **Estructura monolítica sin separación de responsabilidades:** sencilla inicialmente, pero dificulta mantener y probar las funcionalidades.
2. **Organización exclusivamente por capas técnicas:** separa responsabilidades, aunque puede dispersar el código de una misma funcionalidad.
3. **Organización modular por funcionalidades con capas internas:** agrupa el código relacionado y mantiene separadas las responsabilidades.
4. **Arquitecturas avanzadas como microservicios o arquitectura hexagonal completa:** ofrecen posibilidades adicionales, pero resultarían excesivas para el alcance inicial.

**Decisión**

Se adoptará una arquitectura cliente-servidor con:

- Frontend desarrollado con React, TypeScript y Vite.
- Backend desarrollado con Express y TypeScript.
- API REST con intercambio de datos JSON.
- Persistencia mediante Prisma ORM y SQLite.
- Validación de entradas mediante Zod.
- Cálculos monetarios mediante `decimal.js`.

El código se organizará por funcionalidades, manteniendo separadas las responsabilidades de presentación, validación, lógica de negocio y persistencia.

**Organización del frontend**

El frontend utilizará las siguientes áreas:

- `components`: componentes reutilizables.
- `features/customers`: búsqueda y visualización de clientes.
- `features/simulations`: creación y consulta de simulaciones.
- `features/currency`: selección y visualización de divisas.
- `pages`: páginas principales.
- `services`: comunicación HTTP.
- `hooks`: lógica reutilizable de React.
- `types`: definiciones TypeScript.
- `utils`: funciones auxiliares.

**Organización del backend**

El backend utilizará módulos independientes:

- `modules/customers`: registro, consulta y validación de clientes.
- `modules/simulations`: creación y consulta de simulaciones.
- `modules/billing`: motor de cálculo de facturación.
- `modules/currency`: consulta, caché y conversión de tipos de cambio.

Además, contará con:

- `config`: configuración de planes, tarifas e impuestos.
- `lib`: inicialización de dependencias compartidas, incluido Prisma.
- `middleware`: tratamiento centralizado de errores.
- `app.ts`: configuración de Express y registro de rutas.
- `server.ts`: arranque del servidor.

**Separación de capas**

Los módulos del backend utilizarán las siguientes capas cuando corresponda:

| Capa         | Responsabilidad                         |
| ------------ | --------------------------------------- |
| Routes       | Definición de endpoints                 |
| Controllers  | Gestión de peticiones y respuestas HTTP |
| Services     | Casos de uso y lógica de negocio        |
| Repositories | Acceso a datos mediante Prisma          |
| Schemas      | Validación de entradas mediante Zod     |

No será obligatorio crear todas las capas para funcionalidades que no las necesiten.

**Motor de facturación independiente**

El módulo `billing` contendrá funciones de cálculo independientes de Express y Prisma.

Se encargará de:

- Calcular tarifas acumulativas por tramos de usuarios.
- Aplicar cuotas fijas de planes.
- Calcular costes de almacenamiento.
- Calcular costes proporcionales de llamadas API.
- Aplicar impuestos.
- Obtener subtotales y totales.
- Respetar la política de precisión monetaria.

El motor recibirá datos de entrada y devolverá resultados estructurados sin realizar operaciones HTTP ni acceder a la base de datos.

**Pruebas y tratamiento de errores**

- `app.ts` estará separado de `server.ts` para facilitar las pruebas HTTP con Supertest.
- Se utilizarán validaciones de entrada en el backend.
- Los errores se transformarán en respuestas JSON consistentes.
- Las integraciones externas estarán encapsuladas en servicios.
- Se facilitará la sustitución de dependencias externas por implementaciones simuladas durante las pruebas.

**Justificación**

- Facilita localizar y mantener el código de cada funcionalidad.
- Reduce el acoplamiento entre presentación, negocio y persistencia.
- Permite desarrollar y probar el motor de facturación de forma aislada.
- Favorece la implementación incremental.
- Facilita las revisiones técnicas y la identificación de responsabilidades.
- Evita introducir patrones excesivamente complejos para una prueba de alcance limitado.

**Consecuencias**

- Se crearán módulos independientes para clientes, simulaciones, facturación y divisas.
- Las reglas de negocio no se implementarán directamente en los controladores.
- El frontend consumirá la API mediante servicios HTTP reutilizables.
- El acceso a SQLite se encapsulará mediante Prisma.
- Se implementará un tratamiento centralizado de errores.
- La estructura podrá ampliarse sin reorganizar completamente el proyecto.

**Limitaciones**

La arquitectura no pretende implementar todos los patrones de una aplicación empresarial de gran escala.

Se priorizarán la claridad, la mantenibilidad y la facilidad de pruebas frente a la introducción de abstracciones innecesarias.

**Requisito relacionado:** `RT-009` de `docs/requirements.md`.

### DT-017 — Estrategia de pruebas automatizadas y control de calidad

**Estado:** Adoptada
**Fase:** Diseño técnico
**Fecha:** 2026-11-12

**Contexto**

SaaS-O-Matic incorpora reglas de facturación acumulativa, cálculos monetarios, validación fiscal, persistencia de simulaciones, conversión de divisas y una interfaz interactiva.

Estas funcionalidades requieren una estrategia de pruebas que permita comprobar su comportamiento, detectar errores y demostrar que los requisitos se cumplen.

La prueba técnica de Roams también valora la calidad del software, el criterio técnico y la capacidad para verificar los resultados del desarrollo asistido por inteligencia artificial.

**Alternativas consideradas**

1. **Realizar únicamente comprobaciones manuales:** permite detectar problemas visuales y funcionales, pero dificulta repetir las verificaciones de manera consistente.
2. **Implementar únicamente pruebas unitarias:** resulta adecuado para comprobar algoritmos, pero no verifica completamente la integración entre API, persistencia e interfaz.
3. **Combinar pruebas unitarias, de integración y de componentes:** proporciona cobertura de las principales responsabilidades sin introducir una infraestructura excesiva.
4. **Incorporar desde el inicio una infraestructura completa de pruebas end-to-end:** permite comprobar recorridos completos, pero aumenta la complejidad y el tiempo de preparación.

**Decisión**

Se utilizará una estrategia de pruebas automatizadas con tres niveles principales:

- Pruebas unitarias mediante Vitest.
- Pruebas de integración del backend mediante Vitest y Supertest.
- Pruebas de componentes e interacciones del frontend mediante React Testing Library.

Se complementarán con comprobaciones manuales y verificaciones del build de producción.

**Pruebas unitarias**

Se priorizarán los siguientes comportamientos:

- Cálculo acumulativo de tarifas por tramos de usuarios.
- Cuotas de los planes Starter, Professional y Enterprise.
- Costes de almacenamiento y llamadas API.
- Aplicación de impuestos según el país.
- Precisión monetaria y redondeo `ROUND_HALF_UP`.
- Validación de DNI/NIF, NIE y NIF de entidades españolas.
- Validación básica de identificadores franceses y alemanes.
- Conversión de divisas y gestión de la caché de tipos de cambio.

Se incluirán casos límite, entradas inválidas y resultados esperados calculados previamente.

**Pruebas de integración**

Se comprobarán los endpoints REST y su interacción con la persistencia.

Los casos incluirán:

- Creación de clientes válidos.
- Rechazo de entradas inválidas.
- Prevención de duplicados fiscales dentro de un país.
- Creación de simulaciones.
- Asociación entre clientes y simulaciones.
- Consulta del historial.
- Conservación de los resultados originales.
- Gestión de errores HTTP y de persistencia.

Las pruebas de persistencia utilizarán una base de datos SQLite independiente de la utilizada durante el desarrollo.

**Pruebas del frontend**

Se utilizará React Testing Library para comprobar:

- Renderizado de clientes y simulaciones.
- Búsqueda por empresa e identificador fiscal.
- Interacción con formularios.
- Actualización de proyecciones mediante el slider.
- Visualización del historial.
- Selección de divisas.
- Estados de carga, error y ausencia de resultados.

**Servicios externos**

La integración con la API pública de tipos de cambio se probará utilizando respuestas simuladas.

Se verificarán:

- Respuestas válidas.
- Respuestas incorrectas o incompletas.
- Reutilización de la caché válida.
- Actualización de tasas caducadas.
- Utilización de tasas anteriores cuando falle una actualización.
- Ausencia de tasas disponibles.

Las pruebas automatizadas no dependerán de la disponibilidad real del servicio externo.

**Organización y ejecución**

- Los archivos de pruebas se situarán preferentemente junto a los módulos correspondientes.
- Se utilizarán nombres descriptivos con extensiones `.test.ts` y `.test.tsx`.
- La separación entre `app.ts` y `server.ts` permitirá probar la API con Supertest.
- Las pruebas relevantes se ejecutarán después de implementar cada funcionalidad.
- Se verificará el build de producción del frontend.
- Los resultados se registrarán en `ai-workspace/05-quality-review.md`.

**Justificación**

- Permite verificar de manera reproducible las reglas de negocio.
- Reduce el riesgo de errores en cálculos monetarios y validaciones fiscales.
- Comprueba tanto componentes aislados como integraciones.
- Facilita detectar regresiones durante el desarrollo incremental.
- Evita depender de servicios externos para ejecutar las pruebas.
- Proporciona evidencias verificables del proceso de control de calidad.

**Consecuencias**

- Se crearán pruebas unitarias para el motor de facturación y los validadores.
- Se preparará una base de datos SQLite específica para las pruebas de integración.
- Se utilizarán respuestas simuladas para la API de divisas.
- Se añadirán pruebas de interacción para los componentes principales.
- Se documentarán los resultados reales y las incidencias detectadas.
- No se considerará superada una prueba hasta haberla ejecutado.

**Criterio de finalización**

Una funcionalidad se considerará terminada cuando cumpla sus criterios de aceptación, supere las pruebas relevantes y no presente errores conocidos que impidan su funcionamiento principal.

No se establecerá inicialmente un porcentaje mínimo arbitrario de cobertura. Se priorizará la verificación de los comportamientos críticos y los casos límite.

**Limitaciones**

La estrategia inicial no incluye una infraestructura completa de pruebas end-to-end con navegador real.

Las pruebas automatizadas se complementarán con comprobaciones manuales de la experiencia de usuario y del diseño responsive.

La existencia de pruebas no garantiza por sí sola la ausencia de errores, por lo que será necesario revisar también los resultados y los casos no cubiertos.

**Requisito relacionado:** `RT-010` de `docs/requirements.md`.

## DT-020 — Revisión de las reglas de facturación tras aclaración oficial

**Fecha:** 13 de noviembre de 2026.

**Contexto:** Durante el análisis inicial de SaaS-O-Matic se identificaron varios aspectos del enunciado que no estaban completamente definidos. Se tomaron decisiones propias para concretar las tarifas de los planes, el almacenamiento y las llamadas a la API.

Posteriormente, se consultaron estas cuestiones al equipo de Roams y se recibió una aclaración por correo electrónico.

### Aclaraciones recibidas

1. **Idioma de la documentación:** puede redactarse en español, sin que ello afecte a la evaluación.
2. **Planes de suscripción:** son datos informativos del cliente y no modifican el precio. Los nombres de los planes pueden definirse libremente.
3. **Almacenamiento y llamadas a la API:** deben registrarse y mostrarse en las simulaciones, pero no generan costes adicionales.
4. **Aspectos no especificados:** deben resolverse mediante decisiones propias, justificadas y documentadas en `/ai-workspace`.

### Decisión adoptada

Se actualiza el modelo de facturación con las siguientes reglas:

- El precio base mensual se calcula exclusivamente mediante los tramos acumulativos de usuarios activos.
- Los primeros 10 usuarios cuestan 10 € por usuario.
- Los usuarios del 11 al 50 cuestan 8 € por usuario.
- A partir del usuario 51, el coste es de 5 € por usuario.
- Los planes Starter, Professional y Enterprise se mantienen como opciones informativas, sin cuota adicional.
- El almacenamiento en GB y las llamadas a la API continúan registrándose, pero no aumentan el importe de la simulación.
- Se mantienen los impuestos por país definidos previamente como una decisión propia del proyecto, diferenciando el coste base de usuarios del importe final con impuestos.

### Impacto técnico

Será necesario revisar:

- El motor de facturación y sus funciones de cálculo.
- Las pruebas automatizadas afectadas por las tarifas anteriores.
- La estructura de los datos monetarios de las simulaciones.
- Los requisitos funcionales y demás documentación que mencione tarifas adicionales.
- La información económica presentada en el futuro dashboard.

### Justificación

Esta modificación permite ajustar la implementación a las aclaraciones oficiales, evitar funcionalidades económicas no solicitadas y mantener la trazabilidad de las decisiones tomadas durante el desarrollo.

Se conservan las decisiones iniciales como parte del historial del proyecto, indicando que quedan sustituidas por esta revisión en todo lo relativo a las tarifas de planes, almacenamiento y llamadas a la API.

---

## 4. Decisiones pendientes

Las siguientes cuestiones deberán resolverse antes de implementar las funcionalidades afectadas.

| ID  | Decisión pendiente | Motivo |
| --- | ------------------ | ------ |

Estas decisiones se desarrollarán durante la fase de especificaciones y arquitectura.

No quedan decisiones técnicas iniciales pendientes de resolución.

Durante la implementación podrán identificarse nuevas decisiones o ajustes, que se documentarán en este archivo antes de aplicarse.

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
