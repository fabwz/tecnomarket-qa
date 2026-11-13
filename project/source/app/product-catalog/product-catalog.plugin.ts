import { Elysia } from "elysia";
import type { ListProductsPlugin } from "./list-products/list-products.plugin";
import type { ViewProductPlugin } from "./view-product/view-product.plugin";

export class ProductCatalogPlugin {
	constructor(
		private readonly listProducts: ListProductsPlugin,
		private readonly viewProduct: ViewProductPlugin,
	) {}

	plugin() {
		return new Elysia().use(this.listProducts.plugin()).use(this.viewProduct.plugin());
	}
}
