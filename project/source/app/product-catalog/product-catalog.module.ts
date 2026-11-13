import type { Module } from "dockdi";
import { AuthPluginToken } from "@infra/plugins/auth.plugin";
import { ProductRepositoryToken } from "@tokens";
import { ListProductsHandler, ListProductsHandlerToken } from "./list-products/list-products.handler";
import { ListProductsPlugin, ListProductsPluginToken } from "./list-products/list-products.plugin";
import { ViewProductHandler, ViewProductHandlerToken } from "./view-product/view-product.handler";
import { ViewProductPlugin, ViewProductPluginToken } from "./view-product/view-product.plugin";
import { ProductCatalogPlugin, ProductCatalogPluginToken } from "./product-catalog.plugin";

export const productCatalogModule: Module = (c) => {
	c.bind(ListProductsHandlerToken).toClass(ListProductsHandler, [ProductRepositoryToken]).inSingleton();
	c.bind(ListProductsPluginToken).toClass(ListProductsPlugin, [ListProductsHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(ViewProductHandlerToken).toClass(ViewProductHandler, [ProductRepositoryToken]).inSingleton();
	c.bind(ViewProductPluginToken).toClass(ViewProductPlugin, [ViewProductHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(ProductCatalogPluginToken)
		.toClass(ProductCatalogPlugin, [ListProductsPluginToken, ViewProductPluginToken])
		.inSingleton();
};
