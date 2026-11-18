# Especificación de requisitos — SaaS-O-Matic

**Proyecto:** Dynamic Billing & Subscription Optimizer
**Versión:** 1.0
**Estado:** Especificación consolidada. La implementación y las comprobaciones vigentes se registran en `ai-workspace/05-quality-review.md`.

## 1. Objetivo

SaaS-O-Matic es una herramienta interna destinada a facilitar al equipo comercial la gestión de clientes y la simulación de costes de suscripciones SaaS.

La aplicación permitirá registrar empresas, calcular presupuestos mensuales en función de su consumo estimado, consultar simulaciones anteriores y visualizar importes en distintas divisas.

El desarrollo incluirá un frontend interactivo, una API REST y persistencia mediante SQLite.

## 2. Alcance funcional

### 2.1. Gestión de clientes

**RF-001 — Registro de clientes**

El sistema permitirá crear clientes mediante el endpoint `POST /customers`.

Cada cliente deberá incluir:

- Nombre de la empresa.
- Identificador fiscal correspondiente al país del cliente, según las categorías admitidas en RF-002.
- Correo electrónico de contacto.
- País.
- Plan SaaS seleccionado.

**Criterios de aceptación**

- El endpoint recibe los datos necesarios para registrar un cliente.
- Los campos obligatorios se validan.
- Los clientes válidos se almacenan en SQLite.
- Las entradas inválidas generan una respuesta de error controlada.
- El nombre de la empresa y el correo electrónico de contacto son obligatorios.
- El correo electrónico debe tener un formato válido.
- El país debe ser uno de los admitidos: ES, FR o DE.
- El plan debe ser Starter, Professional o Enterprise.
- El identificador fiscal se normaliza y valida según RF-002.
- No se permite registrar dos clientes con la misma combinación de país e identificador fiscal normalizado, conforme a RT-008.
- Un registro correcto devuelve una respuesta HTTP 201 con los datos del cliente creado.
- Los errores de validación y los identificadores fiscales duplicados generan respuestas HTTP controladas sin crear registros.

**RF-002 — Validación de identificadores fiscales por país**

Cuando el país del cliente sea España (`ES`), el sistema deberá validar estrictamente su identificador fiscal mediante los algoritmos de control correspondientes.

Se admitirán las siguientes categorías:

| Identificador                  | Formato general                                | Validación                                                                      |
| ------------------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| DNI/NIF de persona física      | 8 dígitos y una letra                          | Letra de control calculada mediante módulo 23                                   |
| NIE                            | X, Y o Z, 7 dígitos y una letra                | Sustitución del prefijo por 0, 1 o 2 y cálculo de la letra mediante módulo 23   |
| NIF de entidades (antiguo CIF) | Letra inicial, 7 dígitos y carácter de control | Algoritmo de control y tipo de carácter permitido según la categoría de entidad |

**Normalización de entradas**

Antes de ejecutar la validación:

- Se eliminarán los espacios en blanco iniciales y finales.
- Se convertirán las letras a mayúsculas.
- No se eliminarán automáticamente caracteres interiores, guiones ni separadores.
- El identificador normalizado será el utilizado para las comprobaciones y su almacenamiento.

**Reglas de validación**

- Se comprobará el formato y la longitud del identificador.
- Se verificará el carácter de control mediante el algoritmo correspondiente.
- Para el NIF de entidades se comprobará que el tipo de carácter de control sea válido para su categoría.
- Se rechazarán identificadores con caracteres no permitidos o controles incorrectos.
- La validación se realizará en el backend antes de registrar al cliente.
- Los identificadores inválidos producirán una respuesta de error controlada.

**Criterios de aceptación**

- Se aceptan DNI/NIF válidos de personas físicas.
- Se aceptan NIE válidos con prefijos X, Y y Z.
- Se aceptan NIF de entidades válidos según las categorías admitidas.
- Se rechazan identificadores con letras o dígitos de control incorrectos.
- Se rechazan identificadores malformados.
- Se aceptan entradas válidas con letras minúsculas o espacios exteriores, después de normalizarlas.
- Se incluyen pruebas unitarias con casos válidos, inválidos y límites relevantes.
- La validación no depende únicamente de expresiones regulares.

**Limitaciones**

La validación comprobará la estructura y los algoritmos de control del identificador, pero no verificará su existencia, vigencia ni situación administrativa ante la Agencia Tributaria.

Los casos especiales de NIF que requieran reglas adicionales se concretarán al diseñar el validador, utilizando documentación oficial como referencia.

**Validación de identificadores fiscales internacionales**

Para los clientes de Francia (`FR`) y Alemania (`DE`) se realizará una validación básica de formato y longitud, sin aplicar algoritmos de control.

| País            | Identificador admitido          | Formato requerido                             | Tipo de validación             |
| --------------- | ------------------------------- | --------------------------------------------- | ------------------------------ |
| España (`ES`)   | DNI/NIF, NIE y NIF de entidades | Según categoría                               | Formato y algoritmo de control |
| Francia (`FR`)  | SIREN                           | Exactamente 9 dígitos                         | Formato y longitud             |
| Alemania (`DE`) | USt-IdNr.                       | Prefijo `DE` seguido de exactamente 9 dígitos | Formato y longitud             |

**Reglas adicionales**

- La validación se seleccionará según el país del cliente.
- Se aplicará la normalización común antes de comprobar el identificador.
- Se rechazarán los identificadores que no cumplan el formato definido para su país.
- No se comprobará el dígito de control de los identificadores franceses o alemanes.
- No se realizarán consultas a servicios fiscales externos.
- La validación básica no acreditará la existencia, vigencia ni titularidad del identificador.
- Se incluirán pruebas automatizadas para los formatos válidos e inválidos de los tres países.

**Limitación de alcance**

Para Francia se admitirá únicamente SIREN, sin incluir SIRET ni el número de IVA intracomunitario francés.

Para Alemania se admitirá únicamente USt-IdNr., sin incluir otros identificadores fiscales nacionales.

Esta selección constituye una simplificación funcional del simulador y no pretende representar todos los identificadores legalmente válidos en ambos países.


**Referencias técnicas**

- `DT-010`: validación de identificadores fiscales españoles.
- `DT-018`: validación simplificada de identificadores fiscales internacionales.

**Nota sobre los criterios de aceptación**

La validación de identificadores españoles incluirá la comprobación del carácter de control correspondiente, además del formato y la longitud.

Para Francia y Alemania se comprobarán únicamente el formato y la longitud, conforme al alcance simplificado definido para el proyecto.

**RF-003 — Búsqueda de clientes**

El dashboard permitirá buscar clientes registrados por nombre de empresa o identificador fiscal mediante un campo de búsqueda.

**Comportamiento de la búsqueda**

- La búsqueda admitirá coincidencias parciales tanto en el nombre de empresa como en el identificador fiscal.
- La búsqueda no distinguirá entre mayúsculas y minúsculas.
- Los identificadores fiscales se buscarán utilizando su representación normalizada, conforme a RF-002.
- Los resultados se actualizarán mientras el usuario escribe, sin necesidad de pulsar un botón de búsqueda.
- Cuando el campo de búsqueda esté vacío, se mostrarán todos los clientes registrados.
- La búsqueda se realizará mediante la API del backend.
- El frontend mostrará un estado de carga durante las consultas.
- Cuando no existan coincidencias, se mostrará un mensaje informativo.
- Si se produce un error durante la consulta, se mostrará un aviso y se ofrecerá la posibilidad de reintentarla.

**Criterios de aceptación**

- El usuario puede buscar clientes por nombre de empresa o identificador fiscal.
- Las búsquedas parciales devuelven los clientes que contienen el texto introducido.
- Las búsquedas producen los mismos resultados independientemente de las mayúsculas y minúsculas utilizadas.
- Los resultados se actualizan al modificar el texto de búsqueda.
- Un campo de búsqueda vacío permite consultar todos los clientes registrados.
- Los resultados corresponden únicamente a clientes almacenados en SQLite.
- La interfaz muestra correctamente los estados de carga, ausencia de resultados y error.
- El usuario puede reintentar una búsqueda fallida.
- Se incluyen pruebas automatizadas para búsquedas parciales, búsquedas sin distinción de mayúsculas y minúsculas y búsquedas sin coincidencias.


### 2.2. Simulaciones

**RF-004 — Creación de simulaciones**

El sistema permitirá crear simulaciones mediante `POST /simulations`.

Cada solicitud incluirá:

- Identificador del cliente.
- Número de usuarios activos.
- Almacenamiento estimado.
- Número estimado de llamadas a la API.

**Criterios de aceptación**

- El endpoint `POST /simulations` recibe el identificador del cliente, el número de usuarios activos, el almacenamiento estimado en GB y el número estimado de llamadas a la API.
- Se comprueba que el cliente indicado existe antes de crear la simulación.
- El número de usuarios activos debe ser un entero comprendido entre 0 y 100.000, ambos incluidos.
- El almacenamiento estimado debe expresarse en GB enteros comprendidos entre 0 y 1.000.000, ambos incluidos.
- El número estimado de llamadas a la API debe ser un entero comprendido entre 0 y 100.000.000, ambos incluidos.
- Se rechazan las solicitudes con campos obligatorios ausentes, valores negativos, cantidades decimales o tipos de datos incorrectos.
- El presupuesto se calcula conforme a las reglas de precios por tramos de RF-006, los costes adicionales de RF-007 y los impuestos de RF-008.
- Los cálculos monetarios siguen la política de precisión definida en RT-007.
- La simulación se almacena en SQLite junto con sus entradas, los importes calculados en céntimos enteros de EUR y las instantáneas históricas definidas en RT-008.
- Una creación correcta devuelve HTTP 201 con el identificador de la simulación y los datos necesarios para consultar su resultado.
- Si el cliente no existe o los datos son inválidos, la API devuelve un error HTTP controlado y no almacena ninguna simulación.
- Se incluyen pruebas automatizadas para la creación correcta, los valores límite, las entradas inválidas y los clientes inexistentes.


**RF-005 — Historial de simulaciones**

El dashboard permitirá consultar el historial de simulaciones almacenadas de cada cliente, mostrando sus datos originales y los importes calculados.

**Comportamiento del historial**

- Cada simulación estará asociada a un cliente registrado.
- Las simulaciones se mostrarán en orden cronológico descendente, desde la más reciente hasta la más antigua.
- Si dos simulaciones tienen la misma fecha de creación, se utilizará su identificador como criterio secundario de ordenación.
- Inicialmente se mostrarán un máximo de 10 simulaciones por cliente.
- Cuando existan más resultados, se ofrecerá un botón «Mostrar más» para cargar las siguientes 10 simulaciones.
- El botón desaparecerá cuando no existan más simulaciones disponibles.
- No se mostrarán registros duplicados al cargar nuevas páginas del historial.
- Las simulaciones históricas conservarán los valores originales de entrada, los importes calculados y las instantáneas del plan, país y porcentaje de impuestos.
- La consulta del historial no modificará los registros almacenados.
- Los importes originales se conservarán en EUR. Su visualización en otras divisas seguirá RF-009 y no modificará los datos persistidos.
- La interfaz mostrará estados de carga, historial vacío y error de consulta.

**Criterios de aceptación**

- El historial muestra únicamente las simulaciones asociadas al cliente seleccionado.
- Las simulaciones se recuperan desde SQLite.
- Los resultados aparecen ordenados por fecha de creación descendente y, en caso de empate, por identificador.
- La primera carga devuelve como máximo 10 simulaciones.
- El botón «Mostrar más» permite recuperar las siguientes 10 sin duplicar resultados anteriores.
- El botón no se muestra cuando se han recuperado todas las simulaciones.
- Cada simulación permite consultar sus entradas originales y los importes calculados.
- Los datos históricos no cambian cuando se modifica el plan o el país del cliente.
- Cambiar la divisa de visualización no altera los importes originales almacenados.
- La interfaz informa correctamente de los estados de carga, ausencia de simulaciones y errores.
- Se incluyen pruebas automatizadas para la asociación de clientes, ordenación, paginación, ausencia de duplicados e inmutabilidad histórica.

**Referencias técnicas**

- `RT-008`: modelo de datos y persistencia histórica.
- `RF-009`: conversión de divisas para visualización.
- `CP-008`: comportamiento del historial y carga incremental.


### 2.3. Motor de facturación

**RF-006 — Precio acumulativo por usuarios**

El coste mensual por usuarios se calculará utilizando los siguientes tramos:

| Usuarios       | Precio por usuario |
| -------------- | -----------------: |
| 1–10           |               10 € |
| 11–50          |                8 € |
| 51 en adelante |                5 € |

Los tramos son acumulativos. El precio de un tramo solo se aplica a los usuarios incluidos en él.

**Ejemplo obligatorio**

Para 15 usuarios:

- Primeros 10 usuarios: 10 × 10 € = 100 €.
- Siguientes 5 usuarios: 5 × 8 € = 40 €.
- **Total por usuarios: 140 € mensuales.**

**Criterios de aceptación**

- El cálculo respeta los tramos acumulativos.
- Se verifican especialmente los límites de 10, 11, 50 y 51 usuarios.
- El resultado es determinista para una misma entrada.

**Casos de prueba de referencia**

Los siguientes resultados se utilizarán como referencia para verificar el motor de facturación:

| Usuarios activos | Coste mensual por usuarios |
| ---------------: | -------------------------: |
|                0 |                        0 € |
|                1 |                       10 € |
|               10 |                      100 € |
|               11 |                      108 € |
|               15 |                      140 € |
|               50 |                      420 € |
|               51 |                      425 € |
|              100 |                      670 € |

**Fórmula de cálculo**

Para un número entero no negativo de usuarios `n`:

`costeUsuarios = min(n, 10) × 10 + min(max(n - 10, 0), 40) × 8 + max(n - 50, 0) × 5`

**Validación de entrada**

- El número de usuarios debe ser un entero no negativo.
- No se aceptarán valores negativos, decimales ni entradas que no representen un número válido.
- El valor 0 es válido y produce un coste por usuarios de 0 €.
- El límite máximo técnico admitido por la API se establecerá antes de implementar la validación correspondiente.


### RF-007 — Planes de suscripción y datos de consumo sin coste adicional

El precio base mensual de una suscripción se calculará exclusivamente a partir del número de usuarios activos, aplicando los tramos acumulativos definidos en los requisitos de facturación.

El plan seleccionado, el almacenamiento y las llamadas a la API serán datos informativos y no modificarán el precio.

Los planes disponibles son Starter, Professional y Enterprise. El almacenamiento y las llamadas estimadas a la API deben conservarse y mostrarse en cada simulación, pero los tres conceptos son informativos y no añaden costes. Estas reglas incorporan las aclaraciones oficiales de Roams del 13/11/2026 (`DT-020`).

**Criterios de aceptación**

- El cliente debe tener asignado uno de los tres planes disponibles: Starter, Professional o Enterprise.
- El plan, el almacenamiento y las llamadas a la API no alteran el coste de usuarios.
- El almacenamiento y las llamadas a la API se conservan en cada simulación.
- El subtotal coincide con el coste calculado según RF-006; los impuestos se aplican conforme a RF-008.
- Los importes se calculan inicialmente en euros.
- Los cálculos monetarios siguen la política de precisión y redondeo establecida en RT-007.
- Se incluyen pruebas automatizadas que verifican que el plan, el almacenamiento y las llamadas a la API no modifican el precio.


**RF-008 — Impuestos por país**

El sistema aplicará una tasa impositiva al subtotal mensual de cada simulación según el país del cliente.

Para esta prueba técnica se utilizará una configuración fiscal simplificada con tres países admitidos:

| País     | Código ISO | Impuesto     | Tasa |
| -------- | ---------- | ------------ | ---: |
| España   | ES         | IVA          | 21 % |
| Francia  | FR         | TVA          | 20 % |
| Alemania | DE         | Umsatzsteuer | 19 % |

Estas tasas representan una simplificación de diseño para SaaS-O-Matic. No constituyen una implementación completa de la normativa fiscal aplicable a operaciones SaaS B2B internacionales.

**Reglas de cálculo**

La base imponible será el coste de usuarios calculado según RF-006 y RF-007. Los planes, el almacenamiento y las llamadas a la API no añaden costes.

El impuesto se calculará aplicando la tasa correspondiente al país del cliente.

El subtotal se redondeará a dos decimales antes de calcular el impuesto. El importe del impuesto se calculará sobre ese subtotal redondeado y también se redondeará a dos decimales utilizando `decimal.js` y `ROUND_HALF_UP`, conforme a RT-007.

`impuesto = subtotal × tasaImpositiva`

`total = subtotal + impuesto`

La tasa se representará internamente como un valor decimal; por ejemplo, el 21 % corresponderá a `0.21`.

**Ejemplo actualizado de impuestos por país (13/11/2026)**

Para una simulación con 15 usuarios activos y un subtotal de 140 €, calculado exclusivamente mediante los tramos acumulativos de usuarios:

| País            | Subtotal | Impuesto | Total mensual |
| --------------- | -------: | -------: | ------------: |
| España (21 %)   | 140,00 € |  29,40 € |  **169,40 €** |
| Francia (20 %)  | 140,00 € |  28,00 € |  **168,00 €** |
| Alemania (19 %) | 140,00 € |  26,60 € |  **166,60 €** |

El plan de suscripción, el almacenamiento y las llamadas a la API no generan costes adicionales.

Los porcentajes de impuestos son decisiones propias del proyecto, documentadas en `/ai-workspace`, y se utilizan como una simplificación para las simulaciones.

**Referencia:** DT-020 y aclaraciones oficiales de Roams del 13/11/2026.

**Criterios de aceptación**

- El cliente debe pertenecer a uno de los tres países admitidos.
- El sistema identifica el país mediante su código ISO.
- Se aplica la tasa correspondiente al país del cliente.
- El impuesto se calcula sobre el subtotal completo.
- La simulación permite consultar por separado el subtotal, el impuesto y el total.
- No se permite registrar clientes con países que no estén configurados.
- El cálculo del impuesto se realiza antes de convertir el importe a otras divisas.
- El cálculo de impuestos utiliza la política de precisión monetaria y redondeo definida en RT-007.

**Limitaciones**

La configuración fiscal es estática y está destinada exclusivamente a la simulación comercial de esta prueba técnica.

No se contemplan reglas especiales por tipo de cliente, operaciones intracomunitarias, exenciones fiscales ni cambios históricos de tasas.


### 2.4. Conversión de divisas

**RF-009 — Conversión de divisas**

El sistema conservará EUR como moneda de cálculo y permitirá convertir los importes a las divisas válidas disponibles que comunique el backend. USD y GBP deben estar disponibles cuando la fuente de tasas las proporcione.

**Moneda base**

- Todos los cálculos de facturación se realizarán en EUR.
- Los importes originales de las simulaciones se almacenarán únicamente en EUR.
- La selección de una divisa diferente modificará exclusivamente la visualización.
- Los cambios de divisa no alterarán los resultados históricos almacenados.

**Obtención de tipos de cambio**

El backend consultará la siguiente API pública:

`https://open.er-api.com/v6/latest/EUR`

El backend expondrá las tasas válidas mediante `GET /currency/rates`, junto con la moneda base y la fecha de actualización.

El backend validará que la respuesta del servicio sea correcta y que contenga tasas numéricas, positivas y utilizables.

**Caché de tipos de cambio**

- Los tipos de cambio obtenidos se conservarán en una caché en memoria.
- La duración de la caché válida será de una hora desde su obtención.
- Mientras la caché sea válida, no será necesario consultar nuevamente el servicio externo.
- Una vez transcurrida una hora, el backend intentará obtener tasas actualizadas.
- Si la actualización falla y existen tasas anteriores, se utilizarán como respaldo y la interfaz indicará expresamente que están desactualizadas.
- Si no existen tasas disponibles, se conservará el importe en EUR y se informará del problema.

**Precisión monetaria**

- Las conversiones utilizarán `decimal.js`.
- Se aplicará el redondeo `ROUND_HALF_UP`.
- Los importes convertidos se mostrarán con dos decimales.
- Se convertirá el total mensual original en EUR, sin recalcular los componentes de la facturación en otra moneda.

**Comportamiento del frontend**

- El usuario podrá seleccionar EUR y las divisas disponibles comunicadas por el backend.
- La interfaz mostrará un estado de carga mientras se obtienen los tipos de cambio.
- Se mostrará la fecha de actualización de las tasas cuando esté disponible.
- Si se utilizan tasas desactualizadas, la interfaz lo indicará claramente.
- Si la conversión no está disponible, se mostrará un mensaje informativo y se mantendrá visible el importe original en EUR.
- Los errores del servicio externo no impedirán consultar los clientes ni sus simulaciones.

**Limitaciones**

Las conversiones a USD y GBP tendrán carácter orientativo y no constituirán importes de facturación legal.

La caché en memoria se perderá cuando se reinicie el backend. No se implementará inicialmente persistencia de tipos de cambio.

**Criterios de aceptación**

- El sistema permite seleccionar EUR y las divisas válidas devueltas por el backend, incluidas USD y GBP cuando estén disponibles.
- El importe en EUR coincide con el resultado original de la simulación.
- Las conversiones utilizan tasas obtenidas de la API pública.
- Los resultados convertidos respetan la política de precisión monetaria.
- Las consultas repetidas durante una hora reutilizan la caché válida.
- Los fallos de actualización permiten utilizar tasas anteriores, identificadas como desactualizadas.
- Cuando no hay tasas disponibles, se mantiene visible el importe en EUR.
- La interfaz informa de los estados de carga y error.
- Los importes históricos almacenados no cambian al seleccionar otra divisa.
- Se incluyen pruebas automatizadas para conversiones, caché y errores del servicio externo.

**Decisión relacionada:** `DT-015` de `ai-workspace/03-technical-decisions.md`.

### 2.5. Dashboard

**RF-010 — Visualización de clientes**

El dashboard mostrará los clientes registrados mediante tarjetas adaptables a distintos tamaños de pantalla, facilitando la consulta de su información y el acceso a sus simulaciones.

**Información de las tarjetas**

Cada tarjeta mostrará, como mínimo:

- Nombre de la empresa.
- Identificador fiscal.
- País.
- Plan SaaS seleccionado.

Cada tarjeta permitirá acceder al historial de simulaciones del cliente correspondiente.

**Comportamiento del dashboard**

- Las tarjetas se organizarán mediante un diseño responsive, adaptándose a pantallas de escritorio, tabletas y dispositivos móviles.
- El listado de clientes se obtendrá mediante la API del backend.
- La búsqueda y el filtrado de clientes seguirán las reglas establecidas en RF-003.
- Cada cliente tendrá acceso a su propio historial de simulaciones, conforme a RF-005.
- Los importes de las simulaciones podrán visualizarse en EUR y en las divisas disponibles siguiendo RF-009.
- Se mostrará un estado de carga mientras se recuperan los clientes.
- Si todavía no existen clientes registrados, se mostrará un mensaje informativo.
- Si se produce un error al recuperar los clientes, se mostrará un aviso y una opción para reintentar la consulta.

**Criterios de aceptación**

- El dashboard muestra tarjetas correspondientes a los clientes registrados.
- Cada tarjeta identifica correctamente al cliente mediante su nombre, identificador fiscal, país y plan.
- Las tarjetas permiten acceder al historial del cliente correspondiente.
- La interfaz se adapta a distintos tamaños de pantalla sin perder funcionalidades esenciales.
- La búsqueda de clientes funciona conforme a RF-003.
- El historial de simulaciones funciona conforme a RF-005.
- La visualización de importes en distintas divisas respeta RF-009.
- Se muestran correctamente los estados de carga, listado vacío y error de consulta.
- El usuario puede reintentar la carga de clientes cuando se produce un error.
- Se incluyen pruebas de interfaz para la visualización de tarjetas, el acceso al historial y los estados de carga, vacío y error.

**Referencias funcionales**

- `RF-003`: búsqueda de clientes.
- `RF-005`: historial de simulaciones.
- `RF-009`: conversión de divisas.


**RF-011 — Simulación interactiva**

El usuario podrá modificar el número de usuarios mediante un control deslizante (_slider_) y visualizar una proyección del coste mensual.

**Configuración y comportamiento del selector de usuarios**

- El slider tendrá un valor mínimo de 0 usuarios y un máximo de 500 usuarios.
- El incremento del slider será de 1 usuario.
- El valor inicial al crear una nueva simulación será de 10 usuarios.
- Al consultar una simulación existente, se mostrará el número de usuarios registrado originalmente.
- Se incluirá un campo numérico sincronizado con el slider para permitir la introducción de cantidades superiores a 500 usuarios.
- El campo numérico permitirá introducir valores enteros comprendidos entre 0 y 100.000 usuarios, ambos incluidos, conforme a los límites de validación del backend.
- Si el usuario introduce un valor superior a 500, el campo conservará ese valor y el slider permanecerá visualmente en su posición máxima.
- Si el usuario introduce un valor comprendido entre 0 y 500, ambos controles mostrarán el mismo número de usuarios.
- La modificación del número de usuarios actualizará inmediatamente la estimación mensual.
- El cálculo utilizará las tarifas acumulativas por tramos y las demás condiciones de la simulación.
- Los cambios realizados en el slider o el campo numérico no se guardarán automáticamente.
- La simulación únicamente se persistirá cuando el usuario confirme expresamente su creación.
- Los cambios de una vista previa no modificarán las simulaciones históricas almacenadas.

**Criterios de aceptación**

- Una nueva simulación comienza con 10 usuarios.
- El slider permite seleccionar todos los valores enteros entre 0 y 500, con incrementos de 1.
- El campo numérico permite introducir entre 0 y 100.000 usuarios, incluidos los valores superiores al máximo visual del slider (500).
- Los dos controles permanecen sincronizados cuando el valor está dentro del rango del slider.
- Cuando el valor supera 500, el campo numérico conserva la cantidad introducida y el slider permanece visualmente en 500.
- No se aceptan cantidades negativas ni decimales como valores válidos para calcular una simulación.
- La proyección del coste mensual se actualiza inmediatamente al modificar el número de usuarios.
- Los cálculos de 10, 11, 50 y 51 usuarios respetan las tarifas acumulativas por tramos de RF-006.
- La vista previa utiliza las mismas reglas de facturación, costes adicionales, impuestos y precisión monetaria que las simulaciones persistidas.
- La interfaz distingue claramente entre una proyección no guardada y una simulación almacenada.
- Mover el slider o modificar el campo numérico no crea registros en la base de datos.
- Una simulación solo se almacena cuando el usuario confirma expresamente su creación.
- Al consultar una simulación histórica, se muestra su número original de usuarios y sus resultados almacenados, sin modificarlos.
- Se incluyen pruebas automatizadas para los valores límite, la sincronización de controles, el cálculo de la vista previa y la ausencia de persistencia automática.

**Referencias funcionales y técnicas**

- `RF-004`: creación y persistencia de simulaciones.
- `RF-006`: facturación acumulativa por tramos.
- `RF-007`: costes adicionales.
- `RF-008`: impuestos.
- `RT-007`: precisión monetaria.
- `CP-009`: comportamiento del selector de usuarios.


**RF-012 — Diseño responsive**

La interfaz se adaptará a pantallas de escritorio, tabletas y dispositivos móviles, manteniendo accesibles y utilizables las funcionalidades principales de SaaS-O-Matic.

**Comportamiento responsive**

- El dashboard adaptará la distribución de las tarjetas de clientes al espacio disponible.
- Los formularios de registro de clientes y creación de simulaciones serán utilizables en pantallas pequeñas.
- El campo de búsqueda y los controles de navegación permanecerán accesibles en dispositivos móviles.
- El historial de simulaciones se presentará de forma legible, evitando que su contenido quede oculto o inaccesible.
- El slider y el campo numérico de usuarios podrán utilizarse tanto con ratón como con controles táctiles.
- Los importes, los mensajes de validación y los estados de carga y error se mostrarán correctamente en diferentes tamaños de pantalla.
- Se evitará el desplazamiento horizontal de la página provocado por elementos que no se adapten al ancho disponible.
- Los controles interactivos tendrán etiquetas identificables y podrán utilizarse mediante teclado cuando corresponda.

**Criterios de aceptación**

- Las funcionalidades principales son utilizables en escritorio, tableta y móvil.
- Las tarjetas de clientes se reorganizan correctamente según el ancho disponible.
- Los formularios pueden completarse sin perder acceso a campos o botones.
- La búsqueda, el historial y la selección de divisas funcionan en pantallas pequeñas.
- El slider y el campo numérico permiten modificar los usuarios en dispositivos móviles.
- No aparecen elementos cortados ni desplazamiento horizontal innecesario en los tamaños de pantalla evaluados.
- Los mensajes de error y validación permanecen visibles y legibles.
- Se realizan comprobaciones visuales en resoluciones representativas de móvil, tableta y escritorio.
- Se incluyen pruebas de interfaz para los comportamientos responsive que puedan verificarse automáticamente.

**Referencias funcionales**

- `RF-003`: búsqueda de clientes.
- `RF-005`: historial de simulaciones.
- `RF-009`: conversión de divisas.
- `RF-010`: visualización de clientes.
- `RF-011`: simulación interactiva.


---

## 3. Requisitos técnicos

**RT-001 — API REST**

El backend expondrá, como mínimo, los endpoints obligatorios `POST /customers` y `POST /simulations`.

Podrán incorporarse endpoints de consulta adicionales para satisfacer las necesidades del dashboard.

**RT-002 — Persistencia**

La aplicación utilizará SQLite para almacenar los clientes y las simulaciones.

**RT-003 — Validación de entradas**

Las entradas externas deberán validarse antes de ejecutar operaciones de negocio o persistencia.

**RT-004 — Gestión de errores**

La API devolverá respuestas de error coherentes y la interfaz mostrará mensajes adecuados ante fallos previsibles.

**RT-005 — Reproducibilidad**

El repositorio incluirá instrucciones para instalar dependencias, configurar el entorno y ejecutar la aplicación.

**RT-006 — Evidencias del desarrollo asistido por IA**

El repositorio incluirá `ai-workspace/`, con planificación, interacciones relevantes, decisiones, revisiones y evidencias reales.

**RT-007 — Precisión monetaria y política de redondeo**

El sistema utilizará la biblioteca `decimal.js` para realizar los cálculos monetarios y evitar los errores de precisión asociados a los números de coma flotante de JavaScript.

**Reglas de cálculo**

- Los cálculos monetarios se realizarán utilizando aritmética decimal.
- Se utilizará el modo de redondeo `ROUND_HALF_UP`.
- Los importes monetarios finales se expresarán con dos decimales.
- Los componentes de la factura se calcularán sin redondeos intermedios innecesarios.
- El subtotal se obtendrá sumando los componentes y redondeando el resultado a dos decimales.
- El impuesto se calculará sobre el subtotal redondeado y se redondeará a dos decimales.
- El total mensual será la suma del subtotal y el impuesto, ambos redondeados.
- La conversión de divisas se realizará sobre el total mensual en euros y el resultado se redondeará a dos decimales.
- El backend será la fuente de verdad para los importes de las simulaciones almacenadas.

**Ejemplo de redondeo**

Para un subtotal sin redondear de 184,005 € y un IVA del 21 %:

| Concepto                    |      Importe |
| --------------------------- | -----------: |
| Subtotal antes del redondeo |    184,005 € |
| Subtotal redondeado         |     184,01 € |
| IVA antes del redondeo      |    38,6421 € |
| IVA redondeado              |      38,64 € |
| **Total mensual**           | **222,65 €** |

**Criterios de aceptación**

- Los cálculos no dependen de operaciones monetarias con `Number` de JavaScript.
- Se aplica consistentemente el redondeo `ROUND_HALF_UP`.
- Los importes monetarios se redondean a dos decimales antes de su persistencia y se almacenan como números enteros de céntimos de euro, conforme a RT-008.
- El frontend y el backend no utilizan reglas de facturación contradictorias.
- Se incluyen pruebas automatizadas para casos de redondeo y precisión decimal.
- Los tipos de cambio externos se convierten a valores decimales antes de realizar operaciones monetarias.

**Decisión relacionada:** `DT-014` de `ai-workspace/03-technical-decisions.md`.

**RT-008 — Modelo de datos y persistencia histórica**

El sistema utilizará SQLite mediante Prisma ORM para almacenar clientes y simulaciones de facturación.

Se definirán dos entidades principales: `Customer` y `Simulation`, relacionadas mediante una asociación de uno a muchos.

**Entidad Customer**

Representará a un cliente registrado en el sistema.

| Campo         | Descripción                                           |
| ------------- | ----------------------------------------------------- |
| `id`          | Identificador único del cliente                       |
| `companyName` | Nombre de la empresa                                  |
| `taxId`       | Identificador fiscal normalizado                      |
| `email`       | Correo electrónico de contacto                        |
| `country`     | Código del país: ES, FR o DE                          |
| `plan`        | Plan seleccionado: Starter, Professional o Enterprise |
| `createdAt`   | Fecha de creación del cliente                         |

El identificador fiscal será único dentro de cada país mediante una restricción compuesta sobre `country` y `taxId`.

**Entidad Simulation**

Representará una simulación de facturación realizada para un cliente.

| Campo              | Descripción                                   |
| ------------------ | --------------------------------------------- |
| `id`               | Identificador único de la simulación          |
| `customerId`       | Referencia al cliente                         |
| `activeUsers`      | Número de usuarios activos                    |
| `storageGb`        | Almacenamiento utilizado en GB                |
| `apiCalls`         | Número estimado de llamadas API               |
| `planSnapshot`     | Plan utilizado al realizar la simulación      |
| `countrySnapshot`  | País utilizado al realizar la simulación      |
| `taxRateSnapshot`  | Porcentaje de impuestos aplicado              |
| `usersCostCents`   | Coste de usuarios en céntimos                 |
| `planCostCents`    | Cuota del plan en céntimos                    |
| `storageCostCents` | Coste de almacenamiento en céntimos           |
| `apiCostCents`     | Coste de llamadas API en céntimos             |
| `subtotalCents`    | Subtotal mensual en céntimos                  |
| `taxCents`         | Importe de impuestos en céntimos              |
| `totalCents`       | Total mensual en euros, expresado en céntimos |
| `createdAt`        | Fecha de creación de la simulación            |

**Relaciones y restricciones**

- Un cliente podrá tener cero o muchas simulaciones.
- Cada simulación pertenecerá a un único cliente.
- `activeUsers` será un número entero no negativo.
- `storageGb` será un número entero no negativo.
- `apiCalls` será un número entero no negativo.
- Los importes monetarios persistidos se representarán mediante enteros en céntimos.
- Los cálculos monetarios utilizarán `decimal.js` y la política definida en `RT-007`.
- Los datos de entrada se validarán antes de persistirlos.

**Persistencia histórica**

Cada simulación conservará los parámetros utilizados y los importes calculados en el momento de su creación.

El plan, país y porcentaje de impuestos se almacenarán como una instantánea de las condiciones aplicadas.

Las simulaciones históricas no se recalcularán automáticamente cuando cambien los datos del cliente o la configuración comercial.

Los registros de simulación serán inmutables desde la API: no se ofrecerán operaciones para modificar sus resultados.

**Configuración comercial**

Las tarifas de usuarios, planes, almacenamiento, llamadas API e impuestos se mantendrán inicialmente en una configuración centralizada del backend.

No se crearán tablas independientes para estas configuraciones en la primera versión.

**Consideración sobre el desglose económico**

El motor de cálculo conservará la precisión decimal necesaria antes de redondear el subtotal. Los importes individuales almacenados en céntimos tendrán carácter informativo y no se utilizarán para reconstruir el subtotal mediante una nueva suma de componentes redondeados.

Esto evita contradicciones con la política de redondeo establecida en `RT-007`.

**Criterios de aceptación**

- Prisma permite crear y consultar clientes y simulaciones.
- No se pueden registrar dos clientes con el mismo identificador fiscal dentro de un mismo país.
- Se pueden consultar todas las simulaciones asociadas a un cliente.
- Cada simulación conserva sus condiciones originales de cálculo.
- Los importes monetarios se almacenan sin utilizar columnas de coma flotante.
- Las entradas inválidas producen errores controlados.
- Se incluyen pruebas de persistencia, relaciones y restricciones.

**Decisión relacionada:** `DT-009` de `ai-workspace/03-technical-decisions.md`.

**RT-009 — Arquitectura modular y separación de responsabilidades**

SaaS-O-Matic utilizará una arquitectura cliente-servidor con frontend React y backend Express, ambos desarrollados en TypeScript.

La aplicación se organiza por funcionalidades y mantiene separadas las responsabilidades de presentación, validación, lógica de negocio y persistencia.

**Arquitectura general**

- **Frontend:** React, TypeScript y Vite.
- **Backend:** Express y TypeScript.
- **Base de datos:** SQLite mediante Prisma ORM.
- **Comunicación:** API REST con intercambio de datos JSON.
- **Validación:** Zod en el backend.
- **Cálculos monetarios:** `decimal.js`.

**Estructura actual del frontend**

```text
frontend/src/
├── api/
├── features/
│   ├── customers/
│   ├── simulations/
│   └── currency/
├── types/
├── App.tsx
└── main.tsx
```

Las llamadas HTTP están en `api/`; la interfaz se organiza por funcionalidad en `features/`.

**Estructura actual del backend**

El backend se organiza mediante las siguientes carpetas:

```text
backend/src/
├── modules/
│   ├── customers/
│   ├── simulations/
│   ├── billing/
│   └── currency/
├── lib/
├── middleware/
├── app.ts
└── server.ts
```

Los módulos agrupan las rutas, validaciones, servicios y pruebas relacionadas:

- `modules/customers`: registro, consulta y validación de clientes.
- `modules/simulations`: creación y consulta de simulaciones.
- `modules/billing`: cálculo de tarifas por usuarios, impuestos y totales.
- `modules/currency`: obtención, almacenamiento temporal y conversión de tipos de cambio.
- `lib`: inicialización y acceso a herramientas compartidas, incluido Prisma.
- `middleware`: gestión centralizada de errores y funcionalidades transversales.
- `app.ts`: configuración de Express y registro de rutas.
- `server.ts`: arranque del servidor HTTP.

**Separación de capas del backend**

Los módulos utilizarán, cuando corresponda, las siguientes capas:

| Capa         | Responsabilidad                                                  |
| ------------ | ---------------------------------------------------------------- |
| Routes       | Definir los endpoints y conectar las rutas con sus controladores |
| Controllers  | Gestionar las peticiones y respuestas HTTP                       |
| Services     | Implementar los casos de uso y coordinar la lógica de negocio    |
| Repositories | Encapsular las operaciones de persistencia mediante Prisma       |
| Schemas      | Validar los datos de entrada mediante Zod                        |

**Motor de facturación independiente**

El módulo `billing` implementa las reglas de facturación mediante funciones independientes de Express y Prisma.

Sus responsabilidades incluirán:

- Calcular el precio acumulativo por tramos de usuarios.
- Mantener los planes, el almacenamiento y las llamadas API como datos informativos, sin coste adicional.
- Obtener el subtotal.
- Aplicar los impuestos correspondientes.
- Calcular el total mensual.
- Aplicar la política de precisión monetaria definida en `RT-007`.

El motor recibirá los parámetros necesarios y devolverá un resultado estructurado, sin acceder directamente a la base de datos ni gestionar peticiones HTTP.

**Comunicación y tratamiento de errores**

- El frontend accederá al backend mediante servicios HTTP reutilizables.
- Las peticiones de entrada se validarán en el backend.
- Los errores se gestionarán de forma centralizada y producirán respuestas JSON coherentes.
- Las integraciones externas, como la API de divisas, estarán encapsuladas en servicios del backend.
- La aplicación deberá gestionar adecuadamente los errores de red, validación y persistencia.

**Facilidad de pruebas**

- `app.ts` estará separado de `server.ts` para permitir pruebas HTTP con Supertest sin iniciar un servidor permanente.
- El motor de facturación podrá probarse mediante pruebas unitarias sin base de datos.
- Los servicios y repositorios podrán probarse de manera independiente cuando resulte apropiado.
- Las dependencias externas podrán sustituirse por implementaciones simuladas durante las pruebas.

**Criterios de aceptación**

- El código está organizado por funcionalidades y responsabilidades.
- Los componentes React no contienen reglas de facturación duplicadas.
- Los controladores no implementan directamente los algoritmos de facturación.
- El motor de facturación no depende de Express ni de Prisma.
- El acceso a SQLite está encapsulado mediante Prisma.
- La validación de entradas se realiza en el backend.
- Las respuestas de error siguen una estructura consistente.
- La arquitectura permite ejecutar pruebas unitarias y de integración.
- No se incorporan patrones o abstracciones innecesarias para el alcance de la aplicación.

**Decisión relacionada:** `DT-016` de `ai-workspace/03-technical-decisions.md`.

**RT-010 — Estrategia de pruebas automatizadas y control de calidad**

SaaS-O-Matic contará con una estrategia de pruebas automatizadas para verificar las reglas de negocio, la API REST, la persistencia y el comportamiento de la interfaz.

Se priorizarán los cálculos de facturación, la validación fiscal, los casos límite y la gestión de errores.

**Herramientas**

- **Vitest:** ejecución de pruebas unitarias y de integración.
- **Supertest:** pruebas de los endpoints HTTP del backend.
- **React Testing Library:** pruebas de componentes e interacciones del frontend.
- **SQLite:** base de datos de pruebas independiente de la utilizada durante el desarrollo.

**Pruebas unitarias**

Se comprobarán de forma aislada las funciones y servicios que implementan reglas de negocio.

Los casos prioritarios incluirán:

- Cálculo acumulativo de usuarios para 0, 1, 10, 11, 15, 50 y 51 usuarios.
- Verificación de que los planes y los datos de consumo no alteran el precio.
- Conservación de almacenamiento y llamadas a la API como datos informativos.
- Aplicación de los impuestos de España, Francia y Alemania.
- Precisión decimal y redondeo `ROUND_HALF_UP`.
- Validación de DNI/NIF, NIE y NIF de entidades españolas.
- Validación básica de SIREN francés y USt-IdNr. alemán.
- Conversión de divisas y gestión de la caché de tipos de cambio.

**Pruebas de integración del backend**

Se utilizarán Vitest y Supertest para comprobar:

- Creación de clientes mediante la API REST.
- Rechazo de datos de entrada inválidos.
- Detección de identificadores fiscales duplicados dentro de un mismo país.
- Creación y persistencia de simulaciones.
- Asociación entre clientes y simulaciones.
- Consulta del historial de simulaciones.
- Conservación de las condiciones y resultados originales de cada simulación.
- Respuestas HTTP y JSON de error consistentes.
- Comportamiento ante fallos de servicios externos.

Las pruebas que requieran persistencia utilizarán una base de datos SQLite de pruebas separada.

**Pruebas del frontend**

Se utilizará React Testing Library para verificar:

- Renderizado de tarjetas de clientes.
- Búsqueda por nombre de empresa o identificador fiscal.
- Introducción y validación de datos en formularios.
- Interacción con el slider de usuarios.
- Actualización de las proyecciones de facturación.
- Consulta y visualización del historial.
- Selección de divisas.
- Estados de carga, error y ausencia de resultados.

**Pruebas de servicios externos**

Las respuestas de la API pública de tipos de cambio se simularán durante las pruebas automatizadas.

Se comprobarán los siguientes escenarios:

- Respuesta válida con códigos de divisa de tres letras y tasas positivas; USD y GBP se esperan cuando la fuente las ofrezca.
- Respuesta incorrecta o incompleta.
- Caché válida.
- Caché caducada con actualización correcta.
- Fallo de actualización con tasas anteriores disponibles.
- Fallo de actualización sin tasas disponibles.

Las pruebas automatizadas no dependerán de que la API pública esté accesible en el momento de su ejecución.

**Organización de las pruebas**

Los archivos de pruebas se situarán preferentemente cerca de los módulos que verifican, utilizando nombres descriptivos con las extensiones `.test.ts` o `.test.tsx`.

La separación entre `app.ts` y `server.ts` permitirá probar las rutas HTTP sin iniciar un servidor permanente.

**Control de calidad**

- Las pruebas relevantes se ejecutarán después de implementar cada módulo.
- Se verificará el build de producción del frontend.
- Se revisarán los casos límite y las respuestas de error.
- Se registrarán los resultados reales de las comprobaciones en `ai-workspace/05-quality-review.md`.
- No se declarará superada una prueba que no se haya ejecutado.
- Los errores conocidos y las limitaciones se documentarán de forma explícita.

**Criterios de aceptación**

- El motor de facturación dispone de pruebas unitarias para sus reglas críticas.
- Los algoritmos de validación fiscal cuentan con casos válidos e inválidos.
- Los endpoints principales disponen de pruebas de integración.
- La persistencia se prueba utilizando una base de datos independiente.
- La integración de divisas se prueba sin depender de solicitudes reales a Internet.
- Los componentes principales del dashboard disponen de pruebas de interacción.
- Los comandos de pruebas pueden ejecutarse de forma reproducible.
- Los resultados de las pruebas se documentan con evidencias reales.

**Criterio de finalización**

Una funcionalidad se considerará terminada cuando cumpla sus criterios de aceptación, supere las pruebas relevantes y no presente errores conocidos que impidan su funcionamiento principal.

No se establecerá inicialmente un porcentaje mínimo arbitrario de cobertura. Se priorizará la verificación efectiva de las reglas de negocio y los escenarios críticos.

**Decisión relacionada:** `DT-017` de `ai-workspace/03-technical-decisions.md`.

---

## 4. Decisiones de diseño

Las decisiones que concretan aspectos no especificados por el enunciado se documentan en `ai-workspace/03-technical-decisions.md`. Las aclaraciones recibidas de Roams prevalecen sobre las hipótesis anteriores.

## 5. Registro de cuestiones de especificación

| ID     | Cuestión                                                                                                                     | Impacto                                                     |
| ------ | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| CP-001 | Sustituida por AR-001: los planes son informativos y no añaden cuotas                                                        | Aclaración oficial de Roams                                 |
| CP-002 | Sustituida por AR-002: el almacenamiento no genera costes adicionales                                                       | Aclaración oficial de Roams                                 |
| CP-003 | Sustituida por AR-003: las llamadas a la API no generan costes adicionales                                                  | Aclaración oficial de Roams                                 |
| CP-004 | Resuelta: España (21 %), Francia (20 %) y Alemania (19 %)                                                                    | Configuración fiscal simplificada para simulaciones         |
| CP-005 | Resuelta: SIREN para Francia y USt-IdNr. para Alemania                                                                       | Validación básica de formato y longitud, definida en RF-002 |
| CP-006 | Resuelta: decimal.js, ROUND_HALF_UP y dos decimales                                                                          | Política de cálculo monetario definida en RT-007            |
| CP-007 | Resuelta: caché de divisas de 1 hora, uso de tasas anteriores ante fallos y mantenimiento de EUR si no hay tasas disponibles | Política de contingencia definida en DT-015 y RF-009        |
| CP-008 | Resuelta: historial por cliente, orden descendente y 10 registros iniciales con opción «Mostrar más»                         | Historial en RF-005 y acceso desde el dashboard en RF-010    |
| CP-009 | Resuelta: slider de 0 a 500 usuarios, incremento de 1, valor inicial de 10 y campo numérico para cantidades superiores       | Vista previa inmediata sin guardado automático              |

Todas las cuestiones de especificación identificadas durante el desarrollo quedaron resueltas mediante decisiones explícitas y documentadas. El registro refleja las aclaraciones disponibles para esta entrega.

## 6. Trazabilidad y pruebas

Cada requisito funcional podrá relacionarse con:

- Una o varias decisiones técnicas.
- Los componentes o endpoints que lo implementan.
- Las pruebas que verifican su comportamiento.
- Las iteraciones de desarrollo correspondientes.

Los resultados de las pruebas se registrarán en `ai-workspace/05-quality-review.md` y las iteraciones en `ai-workspace/04-development-log.md`.

## 7. Estado del documento

Esta es la especificación consolidada de SaaS-O-Matic e incorpora las aclaraciones oficiales recibidas el 13/11/2026. Define el comportamiento esperado; el avance y las verificaciones de la implementación se mantienen en `ai-workspace/05-quality-review.md`.

---

## Aclaraciones oficiales de Roams — 13/11/2026

Estas aclaraciones sustituyen las hipótesis iniciales incompatibles:

| ID | Aclaración | Aplicación en el proyecto |
| -- | ---------- | ------------------------- |
| AR-001 | Los planes son informativos. | No se añade cuota por Starter, Professional o Enterprise. |
| AR-002 | El almacenamiento debe registrarse y mostrarse. | No genera costes. |
| AR-003 | Las llamadas API deben registrarse y mostrarse. | No generan costes. |
| AR-004 | El importe base depende solo de usuarios. | Se aplican los tramos acumulativos de RF-006. |
| AR-005 | La simulación presenta los datos y resultados económicos. | Se muestran consumo, subtotal, impuesto y total. |
| AR-006 | Se permite documentar en español y adoptar decisiones justificadas. | Las decisiones propias se registran en `ai-workspace/03-technical-decisions.md`. |
