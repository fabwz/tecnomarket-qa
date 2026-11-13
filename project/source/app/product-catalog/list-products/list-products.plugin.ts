import { token } from "dockdi";
import { Elysia } from "elysia";
import type { AuthPlugin } from "@infra/plugins/auth.plugin";
import type { ListProductsHandler } from "./list-products.handler";

export class ListProductsPlugin {
	constructor(
		private readonly handler: ListProductsHandler,
		private readonly auth: AuthPlugin,
	) {}

	plugin() {
		return new Elysia().use(this.auth.plugin()).get("/products", () => this.handler.execute(), { auth: true });
	}
}

export const ListProductsPluginToken = token(ListProductsPlugin);
