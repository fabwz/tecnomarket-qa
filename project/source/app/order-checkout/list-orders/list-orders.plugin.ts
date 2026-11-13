import { token } from "dockdi";
import { Elysia } from "elysia";
import type { AuthPlugin } from "@infra/plugins/auth.plugin";
import type { ListOrdersHandler } from "./list-orders.handler";

export class ListOrdersPlugin {
	constructor(
		private readonly handler: ListOrdersHandler,
		private readonly auth: AuthPlugin,
	) {}

	plugin() {
		return new Elysia()
			.use(this.auth.plugin())
			.get("/orders", ({ account }) => this.handler.execute(account), { auth: true });
	}
}

export const ListOrdersPluginToken = token(ListOrdersPlugin);
