import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { authPlugin } from "@infra/plugins/auth.plugin";
import { addCartItem } from "./handler";
import { addCartItemBody } from "./schema";

export const addCartItemRoute = (dock: Container) =>
	new Elysia()
		.use(authPlugin(dock))
		.post("/cart/items", ({ account, body }) => addCartItem(dock, account, body), {
			auth: true,
			body: addCartItemBody,
		});
