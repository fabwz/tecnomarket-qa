import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { exceptionsPlugin } from "@infra/plugins/exceptions.plugin";
import { accountAccessRoutes } from "./account-access";
import { orderCheckoutRoutes } from "./order-checkout";
import { productCatalogRoutes } from "./product-catalog";
import { shoppingCartRoutes } from "./shopping-cart";

export const createApp = (dock: Container) =>
	new Elysia()
		.use(exceptionsPlugin)
		.use(accountAccessRoutes(dock))
		.use(productCatalogRoutes(dock))
		.use(shoppingCartRoutes(dock))
		.use(orderCheckoutRoutes(dock));
