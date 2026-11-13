import { Elysia } from "elysia";
import type { AuthPlugin } from "@infra/plugins/auth.plugin";
import type { AddCartItemHandler } from "./add-cart-item.handler";
import { addCartItemBody } from "./add-cart-item.schema";

export class AddCartItemPlugin {
	constructor(
		private readonly handler: AddCartItemHandler,
		private readonly auth: AuthPlugin,
	) {}

	plugin() {
		return new Elysia()
			.use(this.auth.plugin())
			.post("/cart/items", ({ account, body }) => this.handler.execute(account, body), {
				auth: true,
				body: addCartItemBody,
			});
	}
}
