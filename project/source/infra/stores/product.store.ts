import type { Product, ProductId, ProductRepository } from "@core/product-catalog";

export class ProductStore implements ProductRepository {
	private readonly products = new Map<ProductId, Product>();

	add(product: Product): void {
		this.products.set(product.id, product);
	}

	findById(id: ProductId): Product | undefined {
		return this.products.get(id);
	}

	list(): readonly Product[] {
		return [...this.products.values()];
	}
}
