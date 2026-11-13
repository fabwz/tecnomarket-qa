import { ProductError, ProductId, type ProductRepository } from "@core/product-catalog";
import { toProductView } from "../product.view";
import type { ViewProductParams } from "./view-product.schema";

export class ViewProductHandler {
	constructor(private readonly products: ProductRepository) {}

	execute(params: ViewProductParams) {
		const product = this.products.findById(ProductId.parse(params.id));
		if (!product) throw ProductError.of("product_not_found");
		return toProductView(product);
	}
}
