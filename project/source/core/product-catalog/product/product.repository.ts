import type { Product } from "./product.entity";
import type { ProductId } from "./product.vos";

export interface ProductRepository {
	add(product: Product): void;
	findById(id: ProductId): Product | undefined;
	list(): readonly Product[];
}
