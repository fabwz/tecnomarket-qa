import { token } from "dockdi";
import { Elysia } from "elysia";
import type { AuthPlugin } from "@infra/plugins/auth.plugin";
import type { ViewCartHandler } from "./view-cart.handler";

export class ViewCartPlugin {
	constructor(
		private readonly handler: ViewCartHandler,
		private readonly auth: AuthPlugin,
	) {}

	plugin() {
		return new Elysia()
			.use(this.auth.plugin())
			.get("/cart", ({ account }) => this.handler.execute(account), { auth: true });
	}
}

export const ViewCartPluginToken = token(ViewCartPlugin);
