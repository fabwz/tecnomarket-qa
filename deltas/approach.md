# Approach — Proyecto de automatización de pruebas (TecnoMarket)

Qué hay que construir, cómo lo vamos a abordar y qué falta. El detalle de cada prueba a escribir está en `specifies.md`.

## 1. Objetivo

Validar de forma automática el comportamiento de una plataforma de comercio electrónico (TecnoMarket), detectar defectos temprano y generar evidencia objetiva de los resultados. Esto implica:

1. Analizar los requerimientos y derivar casos de uso.
2. Diseñar casos de prueba.
3. Automatizar pruebas unitarias.
4. Automatizar pruebas integrales (E2E).
5. Justificar las buenas prácticas aplicadas.
6. Generar un reporte de ejecución.
7. Investigar pruebas de seguridad y proponer una estrategia para incorporarlas.

Regla transversal: **toda acción realizada debe estar evidenciada y justificada**.

## 2. Sistema bajo prueba

El enunciado no trae código, así que hay que construir un sistema mínimo pero funcional sobre el que se ejecuten las pruebas.

### 2.1 Requerimientos funcionales

| ID | Requerimiento | Qué exige |
|---|---|---|
| REQ-01 | Registro de usuarios | Crear cuenta con nombre completo, correo, teléfono y contraseña. Validar que el correo no esté registrado y que la contraseña cumpla políticas mínimas de seguridad. |
| REQ-02 | Inicio de sesión | Autenticar con correo y contraseña. Acceso solo con credenciales válidas. Mensajes informativos para credenciales incorrectas y para cuenta inexistente. |
| REQ-03 | Gestión de productos | Con sesión activa: ver catálogo, consultar detalle de producto y agregar uno o varios artículos al carrito. La cantidad de elementos y el monto total se actualizan automáticamente. |
| REQ-04 | Confirmación de compra | Revisar el carrito y confirmar. Generar número único de pedido, almacenar la transacción y mostrar resumen con detalle de artículos y monto total cancelado. |
| REQ-05 | Historial de pedidos | Con sesión activa: listar pedidos con fecha, número de pedido, cantidad de productos y monto total. |

### 2.2 Reglas de negocio definidas por el equipo

El enunciado no da valores concretos (por ejemplo, habla de "políticas mínimas de seguridad definidas por la organización"). Estas son las reglas que implementamos y contra las que se prueba:

| ID | Regla | REQ |
|---|---|---|
| RN-01 | Todos los campos del registro son obligatorios. | 01 |
| RN-02 | Nombre completo: 3 a 100 caracteres. | 01 |
| RN-03 | Correo con formato válido y único (sin distinguir mayúsculas). | 01 |
| RN-04 | Teléfono: exactamente 8 dígitos numéricos. | 01 |
| RN-05 | Contraseña: 8 a 64 caracteres, con mayúscula, minúscula, número y carácter especial. Se almacena cifrada. | 01 |
| RN-06 | Login solo con correo y contraseña válidos. La contraseña distingue mayúsculas, el correo no. Mensajes distintos para cuenta inexistente y contraseña incorrecta. | 02 |
| RN-07 | Catálogo, detalle, carrito, compra e historial requieren sesión activa. | 02–05 |
| RN-08 | Cantidad a agregar: entero ≥ 1 y ≤ stock. Producto sin stock no se puede agregar. | 03 |
| RN-09 | Cantidad de elementos = suma de cantidades por línea. Total = suma de precio × cantidad. Se recalculan automáticamente. | 03 |
| RN-10 | Si el producto ya está en el carrito, la cantidad se acumula en la misma línea y el acumulado tampoco puede superar el stock. | 03 |
| RN-11 | No se puede confirmar una compra con carrito vacío. | 04 |
| RN-12 | Cada pedido recibe un número único (`PED-AAAAMMDD-NNNN`), se guarda con fecha, detalle y total. Al confirmar se vacía el carrito y se descuenta stock. | 04 |
| RN-13 | La confirmación es todo o nada: si falla una validación (ej. stock insuficiente) no se guarda el pedido ni se descuenta stock. | 04 |
| RN-14 | El historial solo muestra pedidos del usuario autenticado, del más reciente al más antiguo. | 05 |

### 2.3 Casos de uso

| ID | Caso de uso | Actor | REQ |
|---|---|---|---|
| CU-01 | Registrar usuario | Visitante | 01 |
| CU-02 | Iniciar sesión | Visitante | 02 |
| CU-03 | Consultar catálogo | Cliente autenticado | 03 |
| CU-04 | Consultar detalle de producto (extiende CU-03) | Cliente autenticado | 03 |
| CU-05 | Agregar producto al carrito | Cliente autenticado | 03 |
| CU-06 | Revisar carrito (incluido por CU-07) | Cliente autenticado | 04 |
| CU-07 | Confirmar compra | Cliente autenticado | 04 |
| CU-08 | Consultar historial de pedidos | Cliente autenticado | 05 |

## 3. Qué hay que hacer, por parte

### Parte 1 — Análisis de requerimientos
- Identificar y documentar casos de uso.
- Elaborar el diagrama de casos de uso.
- Identificar actores, flujos principales y flujos alternos.
- Determinar reglas de negocio.
- Elaborar matriz de trazabilidad requerimientos ↔ casos de uso.

### Parte 2 — Diseño de casos de prueba
Para cada caso de uso:
- Diseñar casos de prueba funcionales.
- Aplicar técnicas: **partición de equivalencia, análisis de valores límite, casos positivos, casos negativos**.
- Definir por caso: **datos de entrada, resultado esperado, prioridad, criterio de aprobación**.

### Parte 3 — Pruebas unitarias automatizadas
Validar funcionalidades individuales. Mínimo a automatizar:
- Registro de usuario.
- Inicio de sesión.
- Validación de contraseña.
- Agregado de productos al carrito.
- Confirmación de compra.

Restricción: organizadas **por funcionalidad en archivos independientes** (el enunciado da como ejemplo `registro`, `login`, `carrito`, `compras`).

### Parte 4 — Pruebas integrales / E2E automatizadas
Validar el flujo completo del negocio. Mínimo tres escenarios:

| Escenario | Flujo |
|---|---|
| 1 | Registro → Login → Agregar producto → Comprar |
| 2 | Login → Consultar productos → Agregar productos → Compra |
| 3 | Login → Consultar historial de pedidos |

Deben incluir: **datos controlados, preparación del entorno antes de ejecutar, limpieza posterior cuando sea necesario y validación de resultados esperados**.

### Parte 5 — Buenas prácticas de automatización (hay que justificarlas)
Para cada una, documentar cómo se aplicó en el proyecto:

| Práctica | Qué significa | Cómo lo aplicamos |
|---|---|---|
| Organización del código | Estructura clara y modular, menor impacto ante cambios. | Capas `core` (por bounded context) / `infra` / `app` (slices acción-entidad) con regla de dependencias, slices verticales en HTTP y pruebas en `testing/functions` (unitarias) y `testing/integration`, un archivo por funcionalidad o escenario. |
| Independencia entre pruebas | Cada prueba corre sin depender de otra (evita falsos positivos/negativos). | Estado reiniciado antes de cada prueba (`beforeEach`); ninguna prueba usa datos creados por otra. |
| Reutilización de código | Funciones comunes centralizadas. | Helpers compartidos: fábricas de usuarios/productos, cliente de la API, seed y limpieza. |
| Datos de prueba controlados | Resultados repetibles y consistentes. | Fixtures fijos (U1–U3, P-001–P-004, ver `specifies.md`) restaurados antes de cada prueba. |
| Entornos reproducibles | Mismos resultados entre máquinas y miembros del equipo. | `package.json` con scripts, lockfile, versión de runtime fijada y, opcionalmente, Dockerfile. |
| Generación de evidencia | Demostrar calidad objetivamente y facilitar el análisis de errores. | Reporte automático (HTML + JSON/JUnit), logs y capturas de la ejecución guardados en `reports/`. |

### Parte 6 — Reporte de resultados
Generado al finalizar la ejecución automatizada. Debe incluir:

1. Cantidad total de pruebas ejecutadas.
2. Pruebas aprobadas.
3. Pruebas fallidas.
4. Porcentaje de éxito.
5. Evidencias de ejecución.
6. Defectos encontrados.
7. Conclusiones del equipo.

Herramienta libre, compatible con el framework (Mochawesome, Allure, HTML Report, etc.).

Nota sobre defectos: registrar los defectos reales que aparezcan durante el desarrollo y la ejecución (ID, caso que lo detectó, descripción, severidad, estado). Si no aparece ninguno, el reporte debe decirlo explícitamente en lugar de dejar la sección vacía.

### Parte 7 — Investigación y estrategia de pruebas de seguridad
Solo investigación y propuesta escrita; el enunciado no pide ejecutar pruebas de seguridad.

**Investigación** (documentar):
1. Qué son las pruebas de seguridad.
2. Objetivos.
3. Principales vulnerabilidades en aplicaciones web.
4. Diferencias entre pruebas funcionales y pruebas de seguridad.
5. Herramientas utilizadas.

**Estrategia de implementación** (debe contemplar):

| Componente | Qué definir |
|---|---|
| Identificación de riesgos | Riesgos de seguridad asociados a cada funcionalidad del sistema. |
| Selección de pruebas | Cuáles aplican. Ejemplos del enunciado: validación de autenticación, control de acceso, gestión de sesiones, validación de entradas, protección ante inyección SQL, protección ante XSS. |
| Herramientas | Herramientas apropiadas para ejecutarlas. |
| Integración al ciclo de pruebas | En qué momento del desarrollo y las pruebas se ejecutan las actividades de seguridad. |
| Evidencias | Entregables y reportes que demuestren la ejecución. |

Ancla con el sistema: varios riesgos ya aparecen en nuestras reglas y casos de prueba (contraseña cifrada, aislamiento del historial entre usuarios, acceso sin sesión, intento de inyección SQL en el login). Conviene referenciarlos para que la estrategia no quede genérica.

## 4. Decisiones técnicas

| Tema | Decisión |
|---|---|
| Lenguaje | TypeScript estricto (`strict`, `noUncheckedIndexedAccess`). |
| Runtime | Bun. |
| Framework de pruebas | Vitest (ejecutado con `bunx --bun vitest`). |
| HTTP | Elysia. Solo backend (API), sin frontend. |
| Validación | Zod 4. Las reglas de dominio (RN-02 a RN-05, RN-08) se definen una sola vez en `core` como esquemas Zod y los esquemas HTTP las reutilizan. |
| Inyección de dependencias | dockdi: tokens tipados, el compilador valida que los argumentos del constructor coincidan. |
| Persistencia | Stores en memoria (`Map`). Sin SQLite ni infraestructura externa; cada prueba arranca con un contenedor nuevo. |
| IDs | `uuidv7` para usuarios, pedidos y sesiones. El número de pedido `PED-AAAAMMDD-NNNN` es aparte (RN-12). |
| Manejo de errores | Los casos de uso devuelven `Result<T, E>` con `Exception` tipadas (unión discriminada por `code`, definida en `core/kernel/exceptions.ts`). No se lanza nada por reglas de negocio. Solo el plugin `exceptions` las traduce a HTTP. |
| Unitarias (`testing/functions`) | Llaman directamente a validadores y casos de uso de `core`, con stores en memoria. Sin Elysia. |
| Integrales / E2E (`testing/integration`) | Llaman a la app Elysia en proceso con `app.handle(new Request(...))` (sin abrir puertos), en secuencia, reproduciendo el flujo de negocio. |
| Reporte | Reporter HTML de Vitest + salida JSON/JUnit; el porcentaje de éxito se calcula del JSON. |

### Convenciones de nombres

- **Bounded contexts** (en `core` y en `app`): sustantivo en plural, 5–7 letras → `kernel`, `users`, `catalog`, `carts`, `orders`.
- **Casos de uso y slices:** `acción-entidad` en kebab-case, mismo nombre en `core` y en `app` (un caso de uso en `core` ↔ un slice en `app`).
- **Archivos fijos por contexto:** `entity.ts` y `contracts.ts`; `rules.ts` solo cuando el contexto tiene reglas propias (`orders` no las tiene: sus reglas viven en `place-order`).
- **Archivos fijos por slice:** `route.ts`, `handler.ts`, `schema.ts`.
- **Carpetas de `infra`:** una sola palabra de 6–7 letras → `stores`, `plugins`, `shared`.
- **Archivos de `infra`:** `<implementación>.<rol>.ts` → `user.store.ts`, `system.clock.ts`, `uuid.generator.ts`, `bun.hasher.ts`; la clase es `<Implementación><Rol>`.
- **Sin comentarios** en el código: los nombres y la estructura deben explicarse solos.
- **Idioma del código:** identificadores y mensajes de error en inglés (`.claude/rules/code-english-only.md`); la documentación sigue en español.
- Los puertos de persistencia se llaman `*Store` (no `*Repository`).

### Regla de dependencias entre capas

```
app ──► core ◄── infra
 └─► infra/plugins   (único punto de infra que app puede importar)
```

- `core` no importa nada de `app`, `infra`, Elysia ni dockdi. Define los **puertos** (`contracts.ts`) y `infra` los implementa.
- Dentro de `core`, `carts` y `orders` pueden importar de `catalog` y `carts` (flujo de compra); ningún contexto importa de `orders`, y `users` no depende de ninguno.
- `infra/stores` e `infra/shared` implementan los puertos de `core`.
- `infra/plugins` son plugins de Elysia (container, auth, exceptions); consumen casos de uso de `core` vía el contenedor y no importan `app`.
- `app` solo usa casos de uso de `core` (vía contenedor) y los plugins de `infra/plugins`.
- `scripts/server.dock.ts` es la única raíz de composición (el contenedor dockdi de la app): enlaza tokens con implementaciones y exporta `createDock(overrides?)`. Lo usan `server.boot.ts` y `testing/support`. Los tokens viven en `source/tokens.ts`.

### Estructura propuesta

```
project/
├─ scripts/
│  ├─ server.dock.ts                # raíz de composición: createDock(overrides?)
│  └─ server.boot.ts                # arranque: createDock + createApp y escucha
├─ source/
│  ├─ env.ts                        # (existe) configuración tipada
│  ├─ tokens.ts                     # tokens dockdi de puertos y casos de uso
│  │
│  ├─ core/                         # dominio: puro, sin dependencias de framework
│  │  ├─ kernel/
│  │  │  ├─ response.ts             # Result<T, E>, ok(), err()
│  │  │  ├─ validation.ts           # parse(schema, input) -> Result con validation_failed
│  │  │  ├─ exceptions.ts           # Exception (unión discriminada por code) + constructores
│  │  │  └─ contracts.ts            # Clock, IdGenerator
│  │  ├─ users/
│  │  │  ├─ entity.ts               # User, Session
│  │  │  ├─ rules.ts                # Zod: nombre, correo, teléfono, contraseña
│  │  │  ├─ contracts.ts            # UserStore, SessionStore, PasswordHasher
│  │  │  ├─ register-user.ts        # CU-01
│  │  │  ├─ login-user.ts           # CU-02 (sesión con vencimiento de 30 min)
│  │  │  └─ resolve-session.ts      # token -> perfil, o session_required (lo usa el plugin auth)
│  │  ├─ catalog/
│  │  │  ├─ entity.ts               # Product
│  │  │  ├─ rules.ts                # disponibilidad (stock > 0) y vista del producto
│  │  │  ├─ contracts.ts            # ProductStore
│  │  │  ├─ list-products.ts        # CU-03
│  │  │  └─ view-product.ts         # CU-04
│  │  ├─ carts/
│  │  │  ├─ entity.ts               # Cart y funciones puras (agregar línea, cantidad, total)
│  │  │  ├─ rules.ts                # cantidad entera ≥ 1 (el tope de stock se valida en add-cart-item)
│  │  │  ├─ contracts.ts            # CartStore
│  │  │  ├─ add-cart-item.ts        # CU-05
│  │  │  └─ view-cart.ts            # CU-06
│  │  └─ orders/
│  │     ├─ entity.ts               # Order, OrderLine
│  │     ├─ contracts.ts            # OrderStore, OrderNumberGenerator
│  │     ├─ place-order.ts          # CU-07 (todo o nada, RN-13)
│  │     └─ list-orders.ts          # CU-08
│  │
│  ├─ infra/
│  │  ├─ stores/                    # implementaciones en memoria de los *Store
│  │  │  ├─ user.store.ts
│  │  │  ├─ session.store.ts        # token opaco -> userId
│  │  │  ├─ product.store.ts
│  │  │  ├─ cart.store.ts
│  │  │  └─ order.store.ts
│  │  ├─ plugins/                   # plugins de Elysia
│  │  │  ├─ container.plugin.ts     # expone el contenedor al contexto
│  │  │  ├─ auth.plugin.ts          # macro `auth`: resuelve sesión o 401 (RN-07)
│  │  │  └─ exceptions.plugin.ts    # Exception -> código HTTP + cuerpo uniforme
│  │  └─ shared/                    # adaptadores de puertos no persistentes
│  │     ├─ bun.hasher.ts           # Bun.password (cifrado, RN-05)
│  │     ├─ system.clock.ts
│  │     ├─ uuid.generator.ts       # uuidv7
│  │     └─ daily.generator.ts      # secuencia diaria del número de pedido
│  │
│  └─ app/                          # capa HTTP: slices agrupados por bounded context
│     ├─ app.ts                     # createApp(dock): ensambla plugins y contextos
│     ├─ users/
│     │  ├─ index.ts                # agrupa los slices del contexto
│     │  ├─ register-user/          # POST /auth/register
│     │  │  ├─ route.ts · handler.ts · schema.ts
│     │  └─ login-user/             # POST /auth/login
│     ├─ catalog/
│     │  ├─ index.ts
│     │  ├─ list-products/          # GET /products
│     │  └─ view-product/           # GET /products/:id
│     ├─ carts/
│     │  ├─ index.ts
│     │  ├─ view-cart/              # GET /cart
│     │  └─ add-cart-item/          # POST /cart/items
│     └─ orders/
│        ├─ index.ts
│        ├─ place-order/            # POST /orders
│        └─ list-orders/            # GET /orders
│
└─ testing/
   ├─ functions/                    # pruebas unitarias, un archivo por funcionalidad
   │  ├─ registro.test.ts
   │  ├─ password.test.ts
   │  ├─ login.test.ts
   │  ├─ catalogo.test.ts
   │  ├─ carrito.test.ts
   │  ├─ compras.test.ts
   │  └─ historial.test.ts
   ├─ integration/                  # un archivo por escenario
   │  ├─ escenario1-registro-compra.test.ts
   │  ├─ escenario2-login-compra.test.ts
   │  └─ escenario3-historial.test.ts
   └─ support/                      # compartido por ambos tipos
      ├─ fixtures.ts                # U1–U3, P-001–P-004
      ├─ test-dock.ts               # dock nuevo + seed por prueba
      ├─ factories.ts               # fábricas de usuarios y productos
      └─ api-client.ts              # cliente tipado sobre app.handle
```

`reports/` (salida de la ejecución) y `docs/` (análisis, diagrama, matriz, casos) viven en la raíz del repositorio, fuera de `project/`.

### API (capa app)

| Slice | Método y ruta | CU | Sesión | Respuestas |
|---|---|---|---|---|
| `users/register-user` | `POST /auth/register` | CU-01 | No | 201; 400 validación; 409 correo duplicado |
| `users/login-user` | `POST /auth/login` | CU-02 | No | 200 con token; 401 contraseña incorrecta; 404 cuenta inexistente |
| `catalog/list-products` | `GET /products` | CU-03 | Sí | 200; 401 |
| `catalog/view-product` | `GET /products/:id` | CU-04 | Sí | 200; 401; 404 |
| `carts/view-cart` | `GET /cart` | CU-06 | Sí | 200 con líneas, cantidad y total; 401 |
| `carts/add-cart-item` | `POST /cart/items` | CU-05 | Sí | 200; 400 cantidad inválida; 409 stock insuficiente o agotado; 404; 401 |
| `orders/place-order` | `POST /orders` | CU-07 | Sí | 201 con resumen; 409 stock insuficiente; 422 carrito vacío; 401 |
| `orders/list-orders` | `GET /orders` | CU-08 | Sí | 200 más reciente primero; 401 |

La sesión viaja como `Authorization: Bearer <token>`; el token es opaco y se resuelve contra `SessionStore`.

### Cómo se prueba cada capa

- **Aislamiento por prueba:** `createDock(overrides?)` (en `scripts/server.dock.ts`) devuelve un contenedor nuevo con stores vacíos y acepta `overrides` (un `Module` de dockdi). `beforeEach` crea uno y carga el seed (U1–U3, P-001–P-004); no hay estado global que limpiar. La "limpieza posterior" de los E2E se cumple descartando el dock en `afterEach`.
- **Determinismo:** `Clock`, `IdGenerator` y `OrderNumberGenerator` son puertos. Las pruebas inyectan versiones fijas (fecha, ids), así `PED-AAAAMMDD-NNNN` es predecible.
- **Hash en pruebas:** `PasswordHasher` real con costo bajo, o una versión rápida inyectada para las unitarias; un caso verifica que lo guardado no es la contraseña en claro.
- **Seguridad de tipos en pruebas:** los tests aserten sobre `result.ok` y `result.error.code`, no sobre mensajes de texto.

### Qué hay que implementar (checklist)

**Base**
- [x] `tsconfig`: alias `@env`, `@tokens`, `@core/*`, `@infra/*`, `@app/*`, `@scripts/*`, `@testing/*`. `vitest.config.ts` los toma con `resolve.tsconfigPaths: true` (Vite 8), sin duplicarlos.
- [x] `core/kernel`: `Result`, `Exception` (con constructores) y puertos `Clock` / `IdGenerator`.
- [x] `source/tokens.ts` (tokens del kernel; los de cada contexto se agregan con su implementación).
- [x] `scripts/server.dock.ts` con `createDock(overrides?)`: contenedor nuevo por llamada, `override` aplicado sobre un `scope()` hijo.
- [x] `infra/shared`: `system.clock.ts`, `uuid.generator.ts`, `bun.hasher.ts`, `daily.generator.ts` (los dos últimos con sus contratos en `users/contracts.ts` y `orders/contracts.ts`).

**Core** (`entity.ts`, `contracts.ts` y, si aplica, `rules.ts` por contexto, más los casos de uso)
- [x] `kernel/validation.ts` (`parse` con Zod).
- [x] `users`: reglas Zod (nombre, correo normalizado a minúsculas, teléfono, contraseña; RN-02 a RN-05), `register-user`, `login-user`, `resolve-session`.
- [x] `catalog`: `list-products`, `view-product`.
- [x] `carts`: funciones puras del carrito, `add-cart-item`, `view-cart` (RN-08 a RN-10).
- [x] `orders`: `place-order`, `list-orders` (RN-11 a RN-14).

**Infra**
- [ ] `stores`: user, session, product, cart, order.
- [x] `shared`: `bun.hasher.ts` (bcrypt síncrono) y `daily.generator.ts`, con sus contratos en `users` y `orders`.
- [ ] `plugins`: container, auth, exceptions.

**App**
- [ ] 8 slices (`route.ts`, `handler.ts`, `schema.ts`) agrupados en 4 contextos con su `index.ts`.
- [ ] `app.ts` con `createApp(dock)` y `scripts/server.boot.ts`.

**Testing**
- [ ] `support/` (fixtures, test-dock, factories, api-client).
- [ ] 7 archivos en `functions/` (66 casos) y 3 en `integration/`.
- [ ] Configuración de reportes (HTML, JSON, JUnit) hacia `reports/`.

### Riesgos técnicos a validar temprano
- **Vitest sobre Bun:** correr con `bunx --bun vitest` y confirmar con un caso mínimo que Elysia (`app.handle`) y `Bun.password` funcionan dentro de Vitest. Si no, usar un hasher puro de prueba.
- **Alias de rutas:** resuelto con `resolve.tsconfigPaths: true` (Vite 8.3). Validado con `bunx --bun vitest run`.
- **Reporter HTML:** requiere `@vitest/ui`, que hoy no está en `package.json`.
- **API de dockdi:** resuelto. `createDock(overrides)` recibe un `Module` que usa `container.override(token).toValue(...)` sobre un `scope()` hijo. Validado con un test temporal (ya eliminado).
- **Extensión de archivos:** `.test.ts` en lugar de `.test.js`; la matriz de trazabilidad del Word hoy dice `.js` y debe alinearse, además de las rutas (`testing/functions`, `testing/integration`).
- **Alcance de "E2E":** se plantea a nivel de API. Si se exigiera interfaz, el plan B es una página mínima y Playwright solo para los 3 escenarios. Falta confirmar que el nivel API es aceptable.

## 5. Entregables y estado

| # | Entregable | Estado |
|---|---|---|
| 1 | Documento de análisis de requerimientos y casos de uso | Hecho (Word) |
| 2 | Diagrama de casos de uso | Hecho (Mermaid, incluido en el Word) |
| 3 | Matriz de trazabilidad | Hecho (Word); ajustar extensión `.js` → `.ts` si se confirma |
| 4 | Casos de prueba diseñados | Hecho (66 casos, ver `specifies.md`) |
| 5 | Código fuente de pruebas unitarias | Pendiente |
| 6 | Código fuente de pruebas integrales | Pendiente |
| 7 | Justificación de buenas prácticas | Pendiente |
| 8 | Reporte de ejecución de pruebas | Pendiente |
| 9 | Investigación sobre pruebas de seguridad | Pendiente |
| 10 | Estrategia de implementación de pruebas de seguridad | Pendiente |
| 11 | Presentación final del proyecto | Pendiente |

## 6. Peso de cada componente (total 110 puntos)

| Componente | Puntos |
|---|---|
| Automatización de pruebas unitarias | 15 |
| Automatización de pruebas integrales | 15 |
| Análisis de requerimientos y casos de uso | 10 |
| Casos de prueba diseñados | 10 |
| Buenas prácticas de automatización | 10 |
| Reporte de pruebas | 10 |
| Investigación sobre pruebas de seguridad | 10 |
| Estrategia de implementación de pruebas de seguridad | 10 |
| Presentación y calidad del proyecto | 10 |
| Diagrama de casos de uso | 5 |
| Matriz de trazabilidad | 5 |

Criterio de "excelente" en lo automatizado: **todas** las pruebas implementadas siguiendo buenas prácticas y flujos completos correctamente validados. En el reporte: profesional, completo y con métricas claras.

## 7. Orden de trabajo sugerido

1. Validar Bun + Vitest con un caso mínimo (resuelve el riesgo técnico principal).
2. Construir el sistema mínimo: `core` (reglas y casos de uso) e `infra` primero, slices de `app` después.
3. Armar `testing/support` (fixtures, test-dock, factories, cliente) (de ahí dependen todas las pruebas).
4. Escribir las pruebas unitarias (`testing/functions`) por archivo, empezando por contraseña y registro.
5. Escribir los 3 escenarios en `testing/integration`.
6. Configurar reporte y ejecutar la suite completa; registrar defectos y evidencias.
7. Redactar justificación de buenas prácticas con lo realmente aplicado.
8. Investigación y estrategia de seguridad (puede avanzar en paralelo desde el paso 2).
9. Presentación final.