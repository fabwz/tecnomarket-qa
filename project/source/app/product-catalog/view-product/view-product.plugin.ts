import { token } from "dockdi";
import { Elysia } from "elysia";
import type { AuthPlugin } from "@infra/plugins/auth.plugin";
import type { ViewProductHandler } from "./view-product.handler";
import { viewProductParams } from "./view-product.schema";

export class ViewProductPlugin {
	constructor(
		private readonly handler: ViewProductHandler,
		private readonly auth: AuthPlugin,
	) {}

	plugin() {
		return new Elysia()
			.use(this.auth.plugin())
			.get("/products/:id", ({ params }) => this.handler.execute(params), { auth: true, params: viewProductParams });
	}
}

export const ViewProductPluginToken = token(ViewProductPlugin);
