# TecnoMarket QA

Proyecto #2 de ISW622: automatización de pruebas (unitarias e integrales) sobre una API mínima de comercio electrónico, con reporte de resultados y una estrategia de pruebas de seguridad.

El enunciado no trae código, así que construimos el sistema bajo prueba (una API en memoria) y sobre él escribimos las pruebas.

## Estado actual

| Parte | Estado |
|---|---|
| Análisis de requerimientos, casos de uso, diagrama y matriz de trazabilidad | Hecho (documento Word) |
| 66 casos de prueba diseñados | Hecho (`deltas/specifies.md`) |
| Sistema bajo prueba (dominio, infraestructura, API) | Hecho |
| Utilidades de prueba (datos controlados, dock aislado, cliente de API) | Hecho |
| **66 pruebas unitarias** (`testing/functions`) | **Pendiente** |
| **3 escenarios integrales** (`testing/integration`) | **Pendiente** |
| Reporte de ejecución (HTML + JSON/JUnit) | Pendiente |
| Justificación de buenas prácticas | Pendiente |
| Investigación y estrategia de seguridad | Pendiente |
| Presentación final | Pendiente |

El detalle completo, con la lista de lo que falta, está en [`deltas/approach.md`](deltas/approach.md).

## Puesta en marcha

Requisito: [Bun](https://bun.sh) (el proyecto corre sobre Bun y Vitest se ejecuta con `--bun`).

```bash
cd project
bun install
```

### Comandos

Todos se ejecutan desde la carpeta `project/`.

| Qué quieres hacer | Comando |
|---|---|
| Correr todas las pruebas | `bunx --bun vitest run` |
| Correr pruebas en modo observador | `bunx --bun vitest` |
| Correr un solo archivo | `bunx --bun vitest run testing/functions/carrito.test.ts` |
| Revisar tipos (TypeScript estricto) | `bunx tsc --noEmit` |
| Levantar la API a mano | `bun scripts/server.boot.ts` (puerto 3000, o `PORT=4000`) |

Al levantar la API a mano el catálogo empieza vacío: los productos de prueba los carga `testing/utilities`, no el arranque.

## Cómo está organizado

```
.
├─ deltas/                 documentación de trabajo (en español)
│  ├─ approach.md          qué construir, decisiones, estructura y estado
│  └─ specifies.md         las 66 pruebas unitarias y los 3 escenarios, con su estado
├─ .claude/rules/          reglas de código y de commits del proyecto
└─ project/
   ├─ scripts/             server.dock.ts (composición) y server.boot.ts (arranque)
   ├─ source/
   │  ├─ core/             dominio puro (reglas de negocio)
   │  ├─ infra/            adaptadores: stores en memoria, plugins, errores a HTTP
   │  └─ app/              API: un slice por caso de uso (plugin + handler + schema)
   └─ testing/
      ├─ functions/        pruebas unitarias, un archivo por funcionalidad
      ├─ integration/      escenarios de punta a punta, un archivo por escenario
      └─ utilities/        datos, dobles, fábricas y cliente de API compartidos
```

### Las tres capas

- **`core`**: el dominio. Cinco contextos (`shared-kernel`, `account-access`, `product-catalog`, `shopping-cart`, `order-checkout`) con entidades, objetos de valor y reglas. No importa nada de afuera: ni Elysia, ni Zod, ni otro contexto. Lanza `DomainError` con códigos cerrados (`email_taken`, `insufficient_stock`…).
- **`infra`**: implementa lo que `core` necesita. Stores en memoria (los datos mueren con el proceso), hasher de contraseñas, reloj, generador de ids y los plugins de Elysia (`auth` y `exceptions`).
- **`app`**: la API. Cada caso de uso es un slice en `app/<contexto>/<accion-entidad>/` con tres archivos: `.plugin.ts` (la ruta), `.handler.ts` (la lógica del caso de uso) y `.schema.ts` (validación de la petición con Zod).

Las clases reciben sus dependencias por constructor y se enlazan con [dockdi](https://www.npmjs.com/package/dockdi) en módulos (`*.module.ts`). Todo se arma en `scripts/server.dock.ts`.

### API

| Método y ruta | Caso de uso | Requiere sesión |
|---|---|---|
| `POST /auth/register` | CU-01 Registrar usuario | No |
| `POST /auth/login` | CU-02 Iniciar sesión | No |
| `GET /products` | CU-03 Consultar catálogo | Sí |
| `GET /products/:id` | CU-04 Detalle de producto | Sí |
| `GET /cart` | CU-06 Revisar carrito | Sí |
| `POST /cart/items` | CU-05 Agregar al carrito | Sí |
| `POST /orders` | CU-07 Confirmar compra | Sí |
| `GET /orders` | CU-08 Historial de pedidos | Sí |

La sesión viaja en el encabezado `Authorization: Bearer <token>` y dura 30 minutos. Los errores responden siempre `{ code, message, details }` con estos estados: 400 datos inválidos, 401 sin sesión o credenciales incorrectas, 404 no existe, 409 conflicto (correo repetido o stock), 422 pedido vacío.

## Cómo escribir una prueba

Cada prueba crea su propio mundo con `createTestDock()`: un contenedor nuevo con reloj controlado, ids predecibles, hasher rápido y datos cargados. Así ninguna prueba depende de otra.

```ts
import { expect, test } from "vitest";
import { createTestDock } from "@testing/utilities/test-dock";
import { expectOk } from "@testing/utilities/api-client";
import { accountFixtures } from "@testing/utilities/fixtures";

test("el carrito suma cantidad y total", async () => {
  const { api } = createTestDock();
  const { email, password } = accountFixtures.ana;
  const { token } = expectOk(await api.login({ email, password }));

  expectOk(await api.addItem({ productId: "P-001", quantity: 1 }, token));
  const cart = expectOk(await api.addItem({ productId: "P-002", quantity: 2 }, token));

  expect(cart.itemCount).toBe(3);
  expect(cart.total).toBe(60000);
});
```

Qué ofrece `testing/utilities`:

| Pieza | Para qué sirve |
|---|---|
| `createTestDock({ accounts, products, orders })` | Mundo nuevo por prueba. Cada bandera en `false` omite esa parte de los datos (por ejemplo catálogo vacío). Devuelve `{ dock, clock, api }`. |
| `clock.advance(ms)` | Mover el tiempo, por ejemplo para vencer una sesión (30 min). |
| `ApiClient` (`api`) | Un método por endpoint, con tipos tomados de los handlers. |
| `expectOk` / `expectFailure` | Verifican éxito o error y devuelven el cuerpo ya tipado. Para errores, comparar `code`, no el texto del mensaje. |
| `fixtures` | Los datos controlados del spec (tabla de abajo). |
| `factories` | Construyen entidades de dominio, y `registrationInput()` da un registro válido que se puede modificar. |

Para probar el dominio sin HTTP, se importan directamente sus piezas (`EmailAddress.parse(...)`, `Cart.addItem(...)`) desde `@core/<contexto>`; para un handler suelto, se resuelve del dock con el token que exporta su archivo.

### Datos de prueba

| ID | Dato | Valores |
|---|---|---|
| U1 (`ana`) | Usuario registrado | `ana.mora@tecnomarket.test` / `Segura#2026` |
| U2 (`luis`) | Usuario sin pedidos | `luis.vega@tecnomarket.test` / `Clave#2026x` |
| U3 (`maria`) | Usuario con 2 pedidos | `maria.rojas@tecnomarket.test` / `Pedido#2026` |
| P-001 | Teclado mecánico | ₡35 000, stock 5 |
| P-002 | Mouse inalámbrico | ₡12 500, stock 10 |
| P-003 | Monitor 24" | ₡95 000, stock 2 |
| P-004 | Cable HDMI | ₡4 500, stock 0 |

## Convenciones

- **Código en inglés**: nombres y mensajes de error. La documentación sí va en español.
- **Sin comentarios** en el código: los nombres deben explicarse solos.
- **Archivos de prueba en `.test.ts`**, con los nombres de `deltas/specifies.md` (`registro`, `password`, `login`, `catalogo`, `carrito`, `compras`, `historial`).
- **Commits** en inglés con formato `tipo(alcance): asunto`, entre 40 y 50 caracteres en total, en imperativo. Tipos válidos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. Ejemplo: `test(carrito): cover quantity limits`.
- Se hace `git add` por ruta, nunca `git add .`.

Las reglas completas están en `.claude/rules/`.

## Cómo avanzar el trabajo

1. Elige un archivo pendiente de `deltas/specifies.md` (sección 3) y escribe sus casos tal como están descritos: mismos datos de entrada y mismo criterio de aprobación.
2. Corre solo ese archivo hasta que pase, luego toda la suite y `bunx tsc --noEmit`.
3. Si una prueba falla porque el sistema se comporta distinto a lo esperado, **no ajustes la prueba para que pase**: es un defecto real. Anótalo en la sección 8 de `specifies.md` (ID, caso, descripción, severidad, estado). Si no aparece ninguno, el reporte debe decirlo explícitamente.
4. Actualiza el estado del caso en `specifies.md` y haz commit.

Notas para leer los casos del spec: el sistema es solo una API, así que "redirección al inicio de sesión" significa **401 con `session_required`**, y "mensaje de campo obligatorio en cada campo" (CP-REG-06) lo da la validación de la petición, que reporta todos los campos a la vez. Hay una tabla con las piezas que ejercita cada archivo en la sección 3 de `specifies.md`.

## Criterio de aceptación propuesto

Todos los casos de prioridad Alta aprueban y el total de aprobados llega al menos al 90 %. El porcentaje de éxito del reporte se calcula a partir de la salida JSON de Vitest.
