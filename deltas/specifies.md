# Specifies — Pruebas a escribir y su estado

Lista completa de las pruebas del proyecto, con su estado. El contexto, las reglas de negocio y las decisiones técnicas están en `approach.md`.

## 1. Resumen

| Concepto | Cantidad |
|---|---|
| Casos de prueba unitarios diseñados | 66 |
| Escenarios E2E a implementar | 3 |
| Archivos de pruebas unitarias | 7 |
| Archivos de pruebas E2E | 3 |
| Prioridad Alta / Media / Baja | 35 / 25 / 6 |
| Automatizados | 0 de 69 |
| Aprobados | 0 de 69 |

### Estados

| Estado | Significado |
|---|---|
| Pendiente | Diseñado, aún sin código. |
| Escrito | Código listo, sin ejecutar o sin pasar. |
| Aprueba | Se ejecuta y el resultado coincide con lo esperado **y** se cumple el criterio de aprobación. |
| Falla | Se ejecuta y no cumple. Registrar el defecto. |
| Bloqueado | No se puede ejecutar (falta funcionalidad o dato). Anotar el motivo. |

Un caso aprueba solo si se cumplen las dos condiciones: resultado esperado y criterio de aprobación (lo que se verifica en el estado del sistema, por ejemplo en los datos guardados).

Criterio de aceptación propuesto para la ejecución completa: todos los casos de prioridad **Alta** aprueban y el total de aprobados llega al menos a **90 %**.

### Mínimo exigido por el enunciado

| Mínimo requerido | Dónde se cubre | Estado |
|---|---|---|
| Registro de usuario | `registro.test.ts` | Pendiente |
| Inicio de sesión | `login.test.ts` | Pendiente |
| Validación de contraseña | `password.test.ts` | Pendiente |
| Agregado de productos al carrito | `carrito.test.ts` | Pendiente |
| Confirmación de compra | `compras.test.ts` | Pendiente |
| Escenario E2E 1 | `testing/integration/escenario1-registro-compra.test.ts` | Pendiente |
| Escenario E2E 2 | `testing/integration/escenario2-login-compra.test.ts` | Pendiente |
| Escenario E2E 3 | `testing/integration/escenario3-historial.test.ts` | Pendiente |

`catalogo.test.ts` e `historial.test.ts` no están en el mínimo, pero cubren REQ-03 y REQ-05 completos.

## 2. Datos de prueba controlados

Se restauran antes de **cada** prueba para garantizar independencia y repetibilidad.

| ID | Dato | Valores | Uso |
|---|---|---|---|
| U1 | Usuario registrado | `ana.mora@tecnomarket.test` / `Segura#2026` | Login, duplicados y compras |
| U2 | Usuario sin pedidos | `luis.vega@tecnomarket.test` / `Clave#2026x` | Carrito vacío e historial vacío |
| U3 | Usuario con 2 pedidos | `maria.rojas@tecnomarket.test` / `Pedido#2026` | Historial |
| P-001 | Teclado mecánico | ₡35 000, stock 5 | Carrito y compras |
| P-002 | Mouse inalámbrico | ₡12 500, stock 10 | Carrito y compras |
| P-003 | Monitor 24" | ₡95 000, stock 2 | Stock insuficiente al confirmar |
| P-004 | Cable HDMI | ₡4 500, stock 0 | Producto agotado |

## 3. Archivos de pruebas unitarias

| Archivo | Casos | Estado |
|---|---|---|
| `testing/functions/registro.test.ts` | 13 | Pendiente |
| `testing/functions/password.test.ts` | 8 | Pendiente |
| `testing/functions/login.test.ts` | 10 | Pendiente |
| `testing/functions/catalogo.test.ts` | 8 | Pendiente |
| `testing/functions/carrito.test.ts` | 14 | Pendiente |
| `testing/functions/compras.test.ts` | 7 | Pendiente |
| `testing/functions/historial.test.ts` | 6 | Pendiente |

### Qué ejercita cada archivo

| Archivo | Piezas bajo prueba |
|---|---|
| `registro.test.ts`, `password.test.ts` | Objetos de valor de `account-access` (`FullName`, `EmailAddress`, `PhoneNumber`, `PlainPassword`), `Account.register` y el handler `register-user`. |
| `login.test.ts` | Handler `login-user`, `Session.start` y su vencimiento (`isActiveAt`). |
| `catalogo.test.ts` | `Product.isInStock` y los handlers `list-products` y `view-product`. |
| `carrito.test.ts` | `Cart.addItem`, `ItemQuantity` y los handlers `add-cart-item` y `view-cart`. |
| `compras.test.ts` | Handler `place-order`: `Product.withdraw`, `Order.place`, `OrderNumbering` y `Cart.clear`. |
| `historial.test.ts` | Handler `list-orders` (orden y aislamiento por comprador). |

Dos ajustes de lectura, porque el sistema es una API sin interfaz:

- Donde el caso dice "redirección al inicio de sesión" (CP-LOG-09, CP-CAT-03, CP-DET-04, CP-CAR-11, CP-REV-03, CP-COM-06, CP-HIS-05) el resultado esperado es **401 con `session_required`**. Esos casos pasan por el plugin `auth`, es decir, por `app.handle`; el vencimiento de la sesión se valida además en `Session.isActiveAt`.
- Donde el caso dice "mensaje de campo obligatorio en cada campo" (CP-REG-06) el reporte de todos los campos lo da la validación de forma de `app` (Zod). Los objetos de valor de `core` lanzan solo el primer error, que es lo que verifica el nivel unitario de dominio.

## 4. Casos de prueba unitarios

Técnicas: partición de equivalencia, valores límite, positivos y negativos. Los casos de contraseña (CP-REG-14 a CP-REG-21) van en `password.test.ts` porque prueban el validador de contraseña y no el flujo de registro.

### CU-01 Registrar usuario

Escenarios E2E que lo recorren: E2E-01

| ID | Tipo / técnica | Descripción | Datos de entrada | Resultado esperado | Criterio de aprobación | Prioridad | Archivo | Estado |
|---|---|---|---|---|---|---|---|---|
| CP-REG-01 | Positivo | Registro con datos válidos. | Nombre: Carlos Mora Solís; correo: carlos.mora@tecnomarket.test; teléfono: 88776655; contraseña: Segura#2026 | Mensaje de registro exitoso. | Existe 1 usuario con ese correo y la contraseña no está en texto plano. | Alta | `registro.test.ts` | Pendiente |
| CP-REG-02 | Negativo | Correo ya registrado. | Datos válidos con correo ana.mora@tecnomarket.test (U1) | Mensaje de correo ya registrado. | Sigue existiendo un solo usuario con ese correo. | Alta | `registro.test.ts` | Pendiente |
| CP-REG-03 | Negativo | Correo duplicado escrito en mayúsculas. | Correo: ANA.MORA@TECNOMARKET.TEST; demás datos válidos | Mensaje de correo ya registrado. | No se crea un segundo usuario. | Media | `registro.test.ts` | Pendiente |
| CP-REG-04 | Partición | Correo inválido sin arroba. | Correo: carlos.moratecnomarket.test | Mensaje de correo electrónico inválido. | No se crea el usuario. | Media | `registro.test.ts` | Pendiente |
| CP-REG-05 | Partición | Correo inválido sin dominio. | Correo: carlos@ | Mensaje de correo electrónico inválido. | No se crea el usuario. | Media | `registro.test.ts` | Pendiente |
| CP-REG-06 | Negativo | Todos los campos vacíos. | Nombre, correo, teléfono y contraseña vacíos | Mensaje de campo obligatorio en cada campo. | No se crea el usuario. | Alta | `registro.test.ts` | Pendiente |
| CP-REG-07 | Límite | Nombre con el mínimo de 3 caracteres. | Nombre: Ana; correo: limite3@tecnomarket.test; demás datos válidos | Registro exitoso. | Existe el usuario con nombre de 3 caracteres. | Media | `registro.test.ts` | Pendiente |
| CP-REG-08 | Límite | Nombre con 2 caracteres (bajo el mínimo). | Nombre: An; demás datos válidos | Mensaje de longitud de nombre inválida. | No se crea el usuario. | Media | `registro.test.ts` | Pendiente |
| CP-REG-09 | Límite | Nombre con el máximo de 100 caracteres. | Nombre de 100 caracteres; correo: limite100@tecnomarket.test | Registro exitoso. | Existe el usuario con nombre de 100 caracteres. | Baja | `registro.test.ts` | Pendiente |
| CP-REG-10 | Límite | Nombre con 101 caracteres (sobre el máximo). | Nombre de 101 caracteres; demás datos válidos | Mensaje de longitud de nombre inválida. | No se crea el usuario. | Baja | `registro.test.ts` | Pendiente |
| CP-REG-11 | Límite | Teléfono con 7 dígitos. | Teléfono: 8877665 | Mensaje de teléfono inválido. | No se crea el usuario. | Media | `registro.test.ts` | Pendiente |
| CP-REG-12 | Límite | Teléfono con 9 dígitos. | Teléfono: 887766554 | Mensaje de teléfono inválido. | No se crea el usuario. | Media | `registro.test.ts` | Pendiente |
| CP-REG-13 | Partición | Teléfono con letras. | Teléfono: 8877abcd | Mensaje de teléfono inválido. | No se crea el usuario. | Media | `registro.test.ts` | Pendiente |
| CP-REG-14 | Límite | Contraseña con el mínimo de 8 caracteres. | Contraseña: Abcd#123; correo: pass8@tecnomarket.test | Registro exitoso. | Existe el usuario. | Alta | `password.test.ts` | Pendiente |
| CP-REG-15 | Límite | Contraseña con 7 caracteres. | Contraseña: Abc#123 | Mensaje con los requisitos de la contraseña. | No se crea el usuario. | Alta | `password.test.ts` | Pendiente |
| CP-REG-16 | Partición | Contraseña sin mayúscula. | Contraseña: segura#2026 | Mensaje con los requisitos de la contraseña. | No se crea el usuario. | Alta | `password.test.ts` | Pendiente |
| CP-REG-17 | Partición | Contraseña sin minúscula. | Contraseña: SEGURA#2026 | Mensaje con los requisitos de la contraseña. | No se crea el usuario. | Alta | `password.test.ts` | Pendiente |
| CP-REG-18 | Partición | Contraseña sin número. | Contraseña: Segura#Clave | Mensaje con los requisitos de la contraseña. | No se crea el usuario. | Alta | `password.test.ts` | Pendiente |
| CP-REG-19 | Partición | Contraseña sin carácter especial. | Contraseña: Segura2026x | Mensaje con los requisitos de la contraseña. | No se crea el usuario. | Alta | `password.test.ts` | Pendiente |
| CP-REG-20 | Límite | Contraseña con el máximo de 64 caracteres. | Contraseña de 64 caracteres que cumple la política; correo: pass64@tecnomarket.test | Registro exitoso. | Existe el usuario. | Baja | `password.test.ts` | Pendiente |
| CP-REG-21 | Límite | Contraseña con 65 caracteres. | Contraseña de 65 caracteres que cumple la política | Mensaje con los requisitos de la contraseña. | No se crea el usuario. | Baja | `password.test.ts` | Pendiente |

### CU-02 Iniciar sesión

Escenarios E2E que lo recorren: E2E-01, E2E-02, E2E-03

| ID | Tipo / técnica | Descripción | Datos de entrada | Resultado esperado | Criterio de aprobación | Prioridad | Archivo | Estado |
|---|---|---|---|---|---|---|---|---|
| CP-LOG-01 | Positivo | Inicio de sesión con credenciales válidas. | Correo: ana.mora@tecnomarket.test; contraseña: Segura#2026 (U1) | Acceso concedido y se muestra el catálogo. | Existe una sesión activa para U1. | Alta | `login.test.ts` | Pendiente |
| CP-LOG-02 | Negativo | Contraseña incorrecta. | Correo de U1; contraseña: Incorrecta#1 | Mensaje de credenciales incorrectas. | No se crea sesión. | Alta | `login.test.ts` | Pendiente |
| CP-LOG-03 | Negativo | Cuenta inexistente. | Correo: noexiste@tecnomarket.test; contraseña: Segura#2026 | Mensaje indicando que la cuenta no existe. | No se crea sesión. | Alta | `login.test.ts` | Pendiente |
| CP-LOG-04 | Negativo | Correo vacío. | Correo vacío; contraseña: Segura#2026 | Mensaje de campo obligatorio. | No se crea sesión. | Media | `login.test.ts` | Pendiente |
| CP-LOG-05 | Negativo | Contraseña vacía. | Correo de U1; contraseña vacía | Mensaje de campo obligatorio. | No se crea sesión. | Media | `login.test.ts` | Pendiente |
| CP-LOG-06 | Partición | Correo con formato inválido. | Correo: ana.mora.tecnomarket.test | Mensaje de correo electrónico inválido. | No se crea sesión. | Baja | `login.test.ts` | Pendiente |
| CP-LOG-07 | Negativo | La contraseña distingue mayúsculas. | Correo de U1; contraseña: SEGURA#2026 | Mensaje de credenciales incorrectas. | No se crea sesión. | Media | `login.test.ts` | Pendiente |
| CP-LOG-08 | Positivo | El correo no distingue mayúsculas. | Correo: ANA.MORA@TECNOMARKET.TEST; contraseña: Segura#2026 | Acceso concedido. | Existe una sesión activa para U1. | Media | `login.test.ts` | Pendiente |
| CP-LOG-09 | Negativo | Acceso al catálogo sin sesión. | Abrir la URL del catálogo sin iniciar sesión | Redirección al inicio de sesión. | No se muestran productos. | Alta | `login.test.ts` | Pendiente |
| CP-LOG-10 | Partición | Intento de inyección SQL en el correo. | Correo: ' OR '1'='1; contraseña: cualquiera | Mensaje de correo inválido o credenciales incorrectas. | No se crea sesión y no hay error del servidor. | Alta | `login.test.ts` | Pendiente |

### CU-03 Consultar catálogo

Escenarios E2E que lo recorren: E2E-02

| ID | Tipo / técnica | Descripción | Datos de entrada | Resultado esperado | Criterio de aprobación | Prioridad | Archivo | Estado |
|---|---|---|---|---|---|---|---|---|
| CP-CAT-01 | Positivo | Ver el catálogo con productos. | Sesión de U1; catálogo con P-001 a P-004 | Se listan 4 productos con nombre, precio y disponibilidad. | La cantidad de productos mostrados es 4. | Alta | `catalogo.test.ts` | Pendiente |
| CP-CAT-02 | Negativo | Catálogo sin productos. | Sesión de U1; catálogo sin productos | Mensaje de catálogo vacío. | No se muestra ningún producto y no hay errores. | Baja | `catalogo.test.ts` | Pendiente |
| CP-CAT-03 | Negativo | Catálogo sin sesión. | Abrir el catálogo sin sesión | Redirección al inicio de sesión. | No se muestran productos. | Alta | `catalogo.test.ts` | Pendiente |
| CP-CAT-04 | Partición | Producto sin stock en el catálogo. | Sesión de U1; producto P-004 (stock 0) | P-004 aparece como agotado. | P-004 no tiene opción activa de agregar. | Media | `catalogo.test.ts` | Pendiente |

### CU-04 Consultar detalle de producto

Escenarios E2E que lo recorren: E2E-02

| ID | Tipo / técnica | Descripción | Datos de entrada | Resultado esperado | Criterio de aprobación | Prioridad | Archivo | Estado |
|---|---|---|---|---|---|---|---|---|
| CP-DET-01 | Positivo | Detalle de un producto existente. | Sesión de U1; producto P-001 | Se muestran nombre, descripción, precio ₡35 000 y stock 5. | Los datos mostrados coinciden con la base de datos. | Alta | `catalogo.test.ts` | Pendiente |
| CP-DET-02 | Partición | Detalle de un producto agotado. | Sesión de U1; producto P-004 | Se muestra el detalle con la marca de agotado. | No se permite agregar al carrito. | Media | `catalogo.test.ts` | Pendiente |
| CP-DET-03 | Negativo | Producto inexistente. | Sesión de U1; identificador 9999 | Mensaje de producto no encontrado. | No hay error del servidor. | Media | `catalogo.test.ts` | Pendiente |
| CP-DET-04 | Negativo | Detalle sin sesión. | Abrir el detalle de P-001 sin sesión | Redirección al inicio de sesión. | No se muestra el detalle. | Media | `catalogo.test.ts` | Pendiente |

### CU-05 Agregar producto al carrito

Escenarios E2E que lo recorren: E2E-01, E2E-02

| ID | Tipo / técnica | Descripción | Datos de entrada | Resultado esperado | Criterio de aprobación | Prioridad | Archivo | Estado |
|---|---|---|---|---|---|---|---|---|
| CP-CAR-01 | Positivo · Límite | Agregar 1 unidad (cantidad mínima). | Sesión de U1; P-001; cantidad 1 | Carrito con 1 elemento y total ₡35 000. | Cantidad = 1 y total = 35 000. | Alta | `carrito.test.ts` | Pendiente |
| CP-CAR-02 | Positivo | Agregar el mismo producto dos veces. | P-001 cantidad 1, dos veces seguidas | Una sola línea con cantidad 2 y total ₡70 000. | El carrito tiene 1 línea con cantidad 2. | Alta | `carrito.test.ts` | Pendiente |
| CP-CAR-03 | Positivo | Agregar dos productos distintos. | P-001 cantidad 1 y P-002 cantidad 2 | Carrito con 3 elementos y total ₡60 000. | Cantidad de elementos = 3 y total = 60 000. | Alta | `carrito.test.ts` | Pendiente |
| CP-CAR-04 | Límite | Cantidad 0. | P-001; cantidad 0 | Mensaje de cantidad inválida. | El carrito no cambia. | Alta | `carrito.test.ts` | Pendiente |
| CP-CAR-05 | Límite | Cantidad negativa. | P-001; cantidad -1 | Mensaje de cantidad inválida. | El carrito no cambia. | Alta | `carrito.test.ts` | Pendiente |
| CP-CAR-06 | Límite | Cantidad igual al stock. | P-001 (stock 5); cantidad 5 | Se agrega y el total es ₡175 000. | Cantidad = 5 y total = 175 000. | Alta | `carrito.test.ts` | Pendiente |
| CP-CAR-07 | Límite | Cantidad mayor al stock en 1. | P-001 (stock 5); cantidad 6 | Mensaje de stock insuficiente. | El carrito no cambia. | Alta | `carrito.test.ts` | Pendiente |
| CP-CAR-08 | Negativo | Acumulado que supera el stock. | P-001 ya con cantidad 3; agregar cantidad 3 | Mensaje de stock insuficiente. | La cantidad en el carrito sigue en 3. | Media | `carrito.test.ts` | Pendiente |
| CP-CAR-09 | Partición | Cantidad no numérica o decimal. | P-001; cantidad abc y luego 1.5 | Mensaje de cantidad inválida en ambos casos. | El carrito no cambia. | Media | `carrito.test.ts` | Pendiente |
| CP-CAR-10 | Negativo | Producto sin stock. | P-004 (stock 0); cantidad 1 | No se permite agregar; mensaje de producto agotado. | El carrito no cambia. | Alta | `carrito.test.ts` | Pendiente |
| CP-CAR-11 | Negativo | Agregar con la sesión expirada. | Sesión expirada; P-001; cantidad 1 | Redirección al inicio de sesión. | No se modifica ningún carrito. | Media | `carrito.test.ts` | Pendiente |

### CU-06 Revisar carrito

Escenarios E2E que lo recorren: E2E-01, E2E-02

| ID | Tipo / técnica | Descripción | Datos de entrada | Resultado esperado | Criterio de aprobación | Prioridad | Archivo | Estado |
|---|---|---|---|---|---|---|---|---|
| CP-REV-01 | Positivo | Revisar un carrito con productos. | Carrito con P-001 × 1 y P-002 × 2 | Se listan las líneas con subtotales ₡35 000 y ₡25 000 y total ₡60 000. | La suma de subtotales es igual al total mostrado. | Alta | `carrito.test.ts` | Pendiente |
| CP-REV-02 | Negativo | Revisar un carrito vacío. | Sesión de U2 sin productos en el carrito | Mensaje de carrito vacío y confirmación deshabilitada. | No se puede iniciar la compra. | Media | `carrito.test.ts` | Pendiente |
| CP-REV-03 | Negativo | Abrir el carrito sin sesión. | Abrir el carrito sin sesión | Redirección al inicio de sesión. | No se muestra ningún carrito. | Media | `carrito.test.ts` | Pendiente |

### CU-07 Confirmar compra

Escenarios E2E que lo recorren: E2E-01, E2E-02

| ID | Tipo / técnica | Descripción | Datos de entrada | Resultado esperado | Criterio de aprobación | Prioridad | Archivo | Estado |
|---|---|---|---|---|---|---|---|---|
| CP-COM-01 | Positivo | Compra con dos productos. | Carrito con P-001 × 1 y P-002 × 2 | Se genera el número de pedido y se muestra el resumen con 2 artículos y total ₡60 000. | Hay 1 pedido en BD con 2 líneas y total 60 000, el carrito queda vacío y el stock queda en P-001 = 4 y P-002 = 8. | Alta | `compras.test.ts` | Pendiente |
| CP-COM-02 | Positivo | Números de pedido únicos. | Dos compras consecutivas del mismo usuario | Cada compra recibe un número distinto. | No hay números de pedido repetidos en BD. | Alta | `compras.test.ts` | Pendiente |
| CP-COM-03 | Negativo | Compra con carrito vacío. | Sesión de U2 con carrito vacío | No se permite confirmar; mensaje de carrito vacío. | No se crea ningún pedido. | Alta | `compras.test.ts` | Pendiente |
| CP-COM-04 | Negativo | Stock insuficiente al confirmar. | Carrito con P-003 × 2 y el stock de P-003 baja a 1 antes de confirmar | Mensaje de stock insuficiente de P-003. | No se guarda el pedido y el stock no cambia. | Alta | `compras.test.ts` | Pendiente |
| CP-COM-05 | Negativo | Doble confirmación. | Carrito con P-001 × 1; dos clics seguidos en confirmar | Se muestra un solo resumen de compra. | Hay 1 solo pedido en BD. | Media | `compras.test.ts` | Pendiente |
| CP-COM-06 | Negativo | Confirmar con la sesión expirada. | Carrito con productos; sesión expirada | Redirección al inicio de sesión. | No se guarda ningún pedido. | Media | `compras.test.ts` | Pendiente |
| CP-COM-07 | Positivo | Consistencia del monto total. | Carrito con P-002 × 3 y P-001 × 1 | El resumen muestra total ₡72 500. | El total del resumen = 37 500 + 35 000 = 72 500 y coincide con BD. | Alta | `compras.test.ts` | Pendiente |

### CU-08 Consultar historial de pedidos

Escenarios E2E que lo recorren: E2E-03

| ID | Tipo / técnica | Descripción | Datos de entrada | Resultado esperado | Criterio de aprobación | Prioridad | Archivo | Estado |
|---|---|---|---|---|---|---|---|---|
| CP-HIS-01 | Positivo | Historial de un usuario con pedidos. | Sesión de U3 (2 pedidos) | Se listan 2 pedidos con fecha, número, cantidad de productos y monto. | Los datos coinciden con los pedidos de U3 en BD. | Alta | `historial.test.ts` | Pendiente |
| CP-HIS-02 | Negativo | Historial de un usuario sin pedidos. | Sesión de U2 (sin pedidos) | Mensaje indicando que no tiene pedidos. | La lista está vacía y no hay errores. | Media | `historial.test.ts` | Pendiente |
| CP-HIS-03 | Positivo | Orden del historial. | Sesión de U3 con pedidos de fechas distintas | El pedido más reciente aparece primero. | Las fechas están en orden descendente. | Media | `historial.test.ts` | Pendiente |
| CP-HIS-04 | Negativo | Aislamiento entre usuarios. | Sesión de U1; U3 tiene pedidos | U1 no ve los pedidos de U3. | Ningún número de pedido de U3 aparece en la lista de U1. | Alta | `historial.test.ts` | Pendiente |
| CP-HIS-05 | Negativo | Historial sin sesión. | Abrir el historial sin sesión | Redirección al inicio de sesión. | No se muestra ningún pedido. | Alta | `historial.test.ts` | Pendiente |
| CP-HIS-06 | Positivo | Pedido nuevo en el historial. | Sesión de U1 después de confirmar la compra del caso de compra exitosa | El nuevo pedido aparece de primero con monto ₡60 000. | El número de pedido coincide con el del resumen de compra. | Alta | `historial.test.ts` | Pendiente |

## 5. Escenarios E2E

Cada escenario:
- Corre sobre el estado inicial restaurado (seed) y deja el entorno limpio al terminar.
- Valida resultados en cada paso y el estado final en el sistema.
- No depende de otro escenario.

### E2E-01 — Registro → Login → Agregar producto → Comprar

Casos de uso: CU-01, CU-02, CU-05, CU-06, CU-07.

| Paso | Acción | Verificación |
|---|---|---|
| 1 | Registrar un usuario nuevo con datos válidos | Registro exitoso; el usuario existe y la contraseña no está en texto plano |
| 2 | Iniciar sesión con ese usuario | Sesión activa |
| 3 | Agregar P-001 × 1 | Carrito con 1 elemento y total ₡35 000 |
| 4 | Revisar carrito | Una línea, subtotal ₡35 000 |
| 5 | Confirmar compra | Número de pedido con formato `PED-AAAAMMDD-NNNN`; resumen con 1 artículo y total ₡35 000 |
| Final | Estado del sistema | 1 pedido guardado; carrito vacío; stock de P-001 = 4 |

Estado: Pendiente

### E2E-02 — Login → Consultar productos → Agregar productos → Compra

Casos de uso: CU-02, CU-03, CU-04, CU-05, CU-06, CU-07.

| Paso | Acción | Verificación |
|---|---|---|
| 1 | Iniciar sesión con U1 | Sesión activa |
| 2 | Consultar catálogo | Se listan los productos con nombre, precio y disponibilidad |
| 3 | Consultar detalle de P-001 | Nombre, descripción, precio ₡35 000 y stock 5 |
| 4 | Agregar P-001 × 1 y P-002 × 2 | Carrito con 3 elementos y total ₡60 000 |
| 5 | Confirmar compra | Número de pedido único; resumen con 2 artículos y total ₡60 000 |
| Final | Estado del sistema | 1 pedido nuevo con 2 líneas; carrito vacío; stock P-001 = 4 y P-002 = 8 |

Estado: Pendiente

### E2E-03 — Login → Consultar historial de pedidos

Casos de uso: CU-02, CU-08.

| Paso | Acción | Verificación |
|---|---|---|
| 1 | Iniciar sesión con U3 | Sesión activa |
| 2 | Consultar historial | 2 pedidos con fecha, número, cantidad de productos y monto total |
| 3 | Revisar orden y datos | Más reciente primero; coincide con los pedidos de U3 en los datos de prueba |
| 4 | Revisar aislamiento | No aparece ningún pedido de otros usuarios |

Estado: Pendiente

## 6. Cobertura por requerimiento

| Requerimiento | Casos de uso | Casos unitarios | Archivo(s) unitario(s) | E2E |
|---|---|---|---|---|
| REQ-01 | CU-01 | CP-REG-01 a CP-REG-21 | `registro.test.ts`, `password.test.ts` | E2E-01 |
| REQ-02 | CU-02 | CP-LOG-01 a CP-LOG-10 | `login.test.ts` | E2E-01, E2E-02, E2E-03 |
| REQ-03 | CU-03, CU-04, CU-05 | CP-CAT-01 a 04, CP-DET-01 a 04, CP-CAR-01 a 11 | `catalogo.test.ts`, `carrito.test.ts` | E2E-01, E2E-02 |
| REQ-04 | CU-06, CU-07 | CP-REV-01 a 03, CP-COM-01 a 07 | `carrito.test.ts`, `compras.test.ts` | E2E-01, E2E-02 |
| REQ-05 | CU-08 | CP-HIS-01 a 06 | `historial.test.ts` | E2E-03 |

## 7. Qué falta antes de poder ejecutar

Hecho:
- Configuración de Vitest con alias de rutas y dock de composición con `override` para pruebas.
- Modelo de dominio en `core` (kernel compartido y 4 contextos) y adaptadores `infra/shared` (reloj, ids, hasher, numeración de pedidos).

Pendiente:
- `infra`: 5 stores en memoria, enlaces en el dock y plugins de Elysia (`container`, `auth`, `exceptions`).
- `app`: 8 slices con sus handlers (aquí viven los casos de uso) y la clase `App`.
- `testing/support`: fixtures, dock de prueba con seed, fábricas y cliente de API.
- Escribir los 66 casos unitarios y los 3 escenarios E2E.
- Configurar el reporte (HTML + JSON/JUnit); falta `@vitest/ui` para el HTML.
- Ajustar la matriz de trazabilidad del documento (extensión `.test.ts` y rutas `testing/functions` y `testing/integration`).

## 8. Registro de defectos

Completar durante la ejecución.

| ID | Caso que lo detectó | Descripción | Severidad | Estado |
|---|---|---|---|---|
| — | — | — | — | — |