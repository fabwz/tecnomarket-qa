import type { Container } from "dockdi";
import { ProductError, ProductId } from "@core/product-catalog";
import { ProductRepositoryToken } from "@tokens";
import { toProductView } from "../product.view";
import type { ViewProductParams } from "./schema";

export const viewProduct = (dock: Container, params: ViewProductParams) => {
	const product = dock.resolve(ProductRepositoryToken).findById(ProductId.parse(params.id));
	if (!product) throw ProductError.of("product_not_found");
	return toProductView(product);
};
