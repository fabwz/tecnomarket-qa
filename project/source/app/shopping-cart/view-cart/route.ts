import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { authPlugin } from "@infra/plugins/auth.plugin";
import { viewCart } from "./handler";

export const viewCartRoute = (dock: Container) =>
	new Elysia().use(authPlugin(dock)).get("/cart", ({ account }) => viewCart(dock, account), { auth: true });
