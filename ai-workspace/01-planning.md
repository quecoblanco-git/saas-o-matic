# 01 — Planificación inicial de SaaS-O-Matic

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

### 2.2. Simulaciones de facturación

El sistema deberá permitir:

- Registrar simulaciones mediante `POST /simulations`.
- Asociar cada simulación a un cliente existente.
- Introducir el número de usuarios activos, almacenamiento contratado y llamadas estimadas a la API.
- Calcular el coste mensual mediante tarificación acumulativa por tramos.
- Aplicar el impuesto correspondiente al país del cliente.
- Persistir los datos y resultados de cada simulación.
- Consultar las simulaciones guardadas.

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

##
