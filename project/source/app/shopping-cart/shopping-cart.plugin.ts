import { token } from "dockdi";
import { Elysia } from "elysia";
import type { AddCartItemPlugin } from "./add-cart-item/add-cart-item.plugin";
import type { ViewCartPlugin } from "./view-cart/view-cart.plugin";

export class ShoppingCartPlugin {
	constructor(
		private readonly viewCart: ViewCartPlugin,
		private readonly addCartItem: AddCartItemPlugin,
	) {}

	plugin() {
		return new Elysia().use(this.viewCart.plugin()).use(this.addCartItem.plugin());
	}
}

export const ShoppingCartPluginToken = token(ShoppingCartPlugin);
