import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { listOrdersRoute } from "./list-orders/route";
import { placeOrderRoute } from "./place-order/route";

export const orderCheckoutRoutes = (dock: Container) =>
	new Elysia().use(placeOrderRoute(dock)).use(listOrdersRoute(dock));
