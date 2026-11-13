import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { authPlugin } from "@infra/plugins/auth.plugin";
import { listOrders } from "./handler";

export const listOrdersRoute = (dock: Container) =>
	new Elysia().use(authPlugin(dock)).get("/orders", ({ account }) => listOrders(dock, account), { auth: true });
