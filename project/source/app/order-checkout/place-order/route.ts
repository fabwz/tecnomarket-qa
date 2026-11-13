import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { authPlugin } from "@infra/plugins/auth.plugin";
import { placeOrder } from "./handler";

export const placeOrderRoute = (dock: Container) =>
	new Elysia()
		.use(authPlugin(dock))
		.post("/orders", ({ account, status }) => status(201, placeOrder(dock, account)), { auth: true });
