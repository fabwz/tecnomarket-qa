import type { Product } from "@core/product-catalog";

export const toProductView = (product: Product) => ({
	id: product.id,
	name: product.name,
	description: product.description,
	price: product.price,
	stock: product.stock,
	available: product.isInStock(),
});
