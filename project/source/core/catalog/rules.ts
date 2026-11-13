import type { Product, ProductView } from "./entity";

export const isAvailable = (product: Product): boolean => product.stock > 0;

export const toView = (product: Product): ProductView => ({ ...product, available: isAvailable(product) });
