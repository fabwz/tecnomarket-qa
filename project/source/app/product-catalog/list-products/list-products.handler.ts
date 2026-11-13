import type { ProductRepository } from "@core/product-catalog";
import { toProductView } from "../product.view";

export class ListProductsHandler {
	constructor(private readonly products: ProductRepository) {}

	execute() {
		return this.products.list().map(toProductView);
	}
}
