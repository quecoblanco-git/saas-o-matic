# AI-Assisted Development Log

## 1. Objetivo

Este documento describe el uso de herramientas de inteligencia
artificial durante el desarrollo de SaaS-O-Matic.

El objetivo es registrar cómo se ha utilizado la IA como
apoyo para el análisis de requisitos, el diseño técnico,
la implementación, las pruebas y la documentación.

## 2. Herramientas utilizadas

### ChatGPT

Se ha utilizado ChatGPT como asistente de desarrollo para:

- Analizar y desglosar los requisitos funcionales y técnicos.
- Planificar la estructura del proyecto.
- Evaluar decisiones de arquitectura.
- Proponer implementaciones y mejoras de código.
- Preparar casos de prueba automatizados.
- Analizar errores y revisar resultados.
- Elaborar documentación técnica.

## 3. Metodología de trabajo

El desarrollo se ha organizado en pasos incrementales:

1. Identificar el requisito o problema.
2. Analizar las posibles soluciones.
3. Implementar un cambio concreto.
4. Ejecutar las comprobaciones correspondientes.
5. Revisar el resultado y corregir errores.
6. Registrar los avances mediante commits de Git.

La implementación se ha validado mediante pruebas
automatizadas, comprobaciones de TypeScript, compilaciones
y verificaciones manuales de la interfaz.

## 4. Responsabilidad sobre el código

Las propuestas generadas con asistencia de IA se han
incorporado al proyecto mediante un proceso de revisión
y comprobación.

Las decisiones de implementación, la ejecución de pruebas
y la aceptación de los resultados forman parte del
proceso de desarrollo.

El uso de IA no sustituye la necesidad de comprender
el funcionamiento del sistema ni de verificar que cumple
los requisitos de la prueba técnica.

## 5. Caso práctico: motor de facturación

### Problema

El sistema debía calcular la facturación mensual utilizando
tarifas progresivas por usuarios activos y distintos tipos
impositivos según el país del cliente.

Además, la aplicación debía ofrecer una vista previa
interactiva sin guardar automáticamente cada cambio.

### Uso de inteligencia artificial

Se utilizó ChatGPT como apoyo para:

- Desglosar las reglas de facturación en casos concretos.
- Diseñar una función reutilizable para calcular los importes.
- Identificar casos límite en los tramos de usuarios.
- Preparar las validaciones de entrada.
- Proponer una API para calcular vistas previas sin persistencia.
- Diseñar pruebas automatizadas para los cálculos.
- Revisar la sincronización entre el formulario y la vista previa.

### Decisiones de implementación

Se decidió centralizar el cálculo en el backend para evitar
que el frontend y el servidor utilizaran reglas diferentes.

La API de vista previa reutiliza la misma lógica de cálculo
que se emplea al guardar una simulación.

Los importes monetarios se representan en céntimos enteros
y se almacenan junto con los datos históricos utilizados
en el cálculo.

La vista previa se actualiza al modificar los parámetros,
pero no crea registros en la base de datos.

### Validación

La solución se comprobó mediante:

- Pruebas unitarias del cálculo por tramos.
- Pruebas de impuestos para España, Francia y Alemania.
- Pruebas de validación de parámetros.
- Pruebas de la API de vista previa.
- Pruebas del componente React.
- Comprobaciones manuales de actualización de importes.
- Compilaciones de TypeScript y Vite.

### Resultado

El sistema permite consultar el importe estimado de una
simulación en tiempo real y guardar el resultado únicamente
cuando el usuario confirma la operación.

Este caso refleja el uso de IA como apoyo para diseñar,
implementar y verificar una funcionalidad completa.

## 6. Caso práctico: historial paginado de simulaciones

### Problema

La aplicación debía permitir consultar las simulaciones
guardadas de cada cliente mediante un historial paginado.

También era necesario gestionar correctamente el cambio
entre clientes y evitar que las respuestas asíncronas
mostrasen información de un cliente anterior.

### Uso de inteligencia artificial

Se utilizó ChatGPT como apoyo para:

- Diseñar la carga incremental del historial.
- Implementar la paginación mediante bloques de 10 registros.
- Gestionar los estados de carga y error.
- Evitar la aparición de simulaciones duplicadas.
- Identificar posibles condiciones de carrera.
- Proponer mecanismos para ignorar respuestas antiguas.
- Diseñar pruebas automatizadas de cambios entre clientes.

### Decisiones de implementación

Se implementó una primera consulta que obtiene hasta
10 simulaciones del cliente seleccionado.

Cuando existen más resultados disponibles, el usuario
puede pulsar el botón "Mostrar más" para solicitar
la siguiente página.

El componente utiliza un identificador de versión
del historial para comprobar si una respuesta
asíncrona sigue correspondiendo a la selección actual.

Cuando el usuario cambia de cliente, se invalida
la versión anterior y se reinicia la paginación.

También se evita añadir simulaciones cuyo identificador
ya exista en el listado.

### Validación

Se prepararon pruebas automatizadas para comprobar:

- La carga de las primeras 10 simulaciones.
- La obtención de páginas adicionales.
- La ausencia de registros duplicados.
- El cambio entre diferentes clientes.
- La exclusión de respuestas antiguas.
- La selección automática del cliente desde el listado.

### Resultado

El historial permite consultar progresivamente las
simulaciones guardadas de cada cliente.

La protección frente a respuestas asíncronas antiguas
evita que una petición de paginación anterior incorpore
simulaciones de otro cliente al listado actual.

Este caso demuestra cómo el uso de IA ayudó a identificar
y comprobar problemas relacionados con el estado de
React y las operaciones asíncronas.
