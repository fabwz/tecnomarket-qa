import type { Product } from "./entity";

export interface ProductStore {
	list(): readonly Product[];
	findById(id: string): Product | undefined;
	save(product: Product): void;
}
