import type { Module } from "dockdi";
import { ExceptionsPluginToken } from "@infra/plugins/exceptions.plugin";
import { AccountAccessPluginToken } from "./account-access/account-access.plugin";
import { App, AppToken } from "./app";
import { OrderCheckoutPluginToken } from "./order-checkout/order-checkout.plugin";
import { ProductCatalogPluginToken } from "./product-catalog/product-catalog.plugin";
import { ShoppingCartPluginToken } from "./shopping-cart/shopping-cart.plugin";

export const appModule: Module = (c) => {
	c.bind(AppToken)
		.toClass(App, [
			ExceptionsPluginToken,
			AccountAccessPluginToken,
			ProductCatalogPluginToken,
			ShoppingCartPluginToken,
			OrderCheckoutPluginToken,
		])
		.inSingleton();
};
