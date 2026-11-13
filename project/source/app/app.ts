import { Elysia } from "elysia";
import type { ExceptionsPlugin } from "@infra/plugins/exceptions.plugin";
import type { AccountAccessPlugin } from "./account-access/account-access.plugin";
import type { OrderCheckoutPlugin } from "./order-checkout/order-checkout.plugin";
import type { ProductCatalogPlugin } from "./product-catalog/product-catalog.plugin";
import type { ShoppingCartPlugin } from "./shopping-cart/shopping-cart.plugin";

export class App {
	constructor(
		private readonly exceptions: ExceptionsPlugin,
		private readonly accountAccess: AccountAccessPlugin,
		private readonly productCatalog: ProductCatalogPlugin,
		private readonly shoppingCart: ShoppingCartPlugin,
		private readonly orderCheckout: OrderCheckoutPlugin,
	) {}

	build() {
		return new Elysia()
			.use(this.exceptions.plugin())
			.use(this.accountAccess.plugin())
			.use(this.productCatalog.plugin())
			.use(this.shoppingCart.plugin())
			.use(this.orderCheckout.plugin());
	}
}
