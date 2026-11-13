import { Container, type Module } from "dockdi";
import { accountAccessModule } from "@app/account-access/account-access.module";
import { appModule } from "@app/app.module";
import { orderCheckoutModule } from "@app/order-checkout/order-checkout.module";
import { productCatalogModule } from "@app/product-catalog/product-catalog.module";
import { shoppingCartModule } from "@app/shopping-cart/shopping-cart.module";
import { pluginsModule } from "@infra/plugins/plugins.module";
import { sharedModule } from "@infra/shared/shared.module";
import { storesModule } from "@infra/stores/stores.module";

export function createDock(overrides?: Module): Container {
	const dock = new Container()
		.load(
			sharedModule,
			storesModule,
			pluginsModule,
			accountAccessModule,
			productCatalogModule,
			shoppingCartModule,
			orderCheckoutModule,
			appModule,
		)
		.scope();
	overrides?.(dock);
	return dock;
}
