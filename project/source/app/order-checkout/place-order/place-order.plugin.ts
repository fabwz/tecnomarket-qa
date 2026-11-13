import { Elysia } from "elysia";
import type { AuthPlugin } from "@infra/plugins/auth.plugin";
import type { PlaceOrderHandler } from "./place-order.handler";

export class PlaceOrderPlugin {
	constructor(
		private readonly handler: PlaceOrderHandler,
		private readonly auth: AuthPlugin,
	) {}

	plugin() {
		return new Elysia()
			.use(this.auth.plugin())
			.post("/orders", ({ account, status }) => status(201, this.handler.execute(account)), { auth: true });
	}
}
