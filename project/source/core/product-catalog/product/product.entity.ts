import { Entity, type EntityState } from "@core/shared-kernel";
import { ProductError } from "./product.errors";
import { StockUnits, type ProductDescription, type ProductId, type ProductName, type UnitPrice } from "./product.vos";

export type ProductState = EntityState<ProductId> & {
	readonly name: ProductName;
	readonly description: ProductDescription;
	readonly price: UnitPrice;
	readonly stock: StockUnits;
};

export interface Product extends ProductState {}

export class Product extends Entity<ProductState> {
	static offer(input: ProductState): Product {
		return new Product(input);
	}

	isInStock(): boolean {
		return this.stock > 0;
	}

	withdraw(units: StockUnits): Product {
		if (units > this.stock) throw ProductError.of("insufficient_stock", { available: this.stock, requested: units });
		return this.with({ stock: StockUnits.parse(this.stock - units) });
	}
}
