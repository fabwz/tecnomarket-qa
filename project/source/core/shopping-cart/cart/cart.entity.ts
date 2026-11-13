import { Entity, type EntityState } from "@core/shared-kernel";
import { CartError } from "./cart.errors";
import { CartLine } from "./cart.parts";
import { fitsStock } from "./cart.policies";
import type { CartProductId, ItemName, ItemPrice, ItemQuantity, ShopperId } from "./cart.vos";

export type CartState = EntityState<ShopperId> & { readonly lines: readonly CartLine[] };

export type CartItem = {
	readonly productId: CartProductId;
	readonly name: ItemName;
	readonly unitPrice: ItemPrice;
	readonly quantity: ItemQuantity;
};

export interface Cart extends CartState {}

export class Cart extends Entity<CartState> {
	static openFor(shopperId: ShopperId): Cart {
		return new Cart({ id: shopperId, lines: [] });
	}

	isEmpty(): boolean {
		return this.lines.length === 0;
	}

	countItems(): number {
		return this.lines.reduce((sum, line) => sum + line.quantity, 0);
	}

	computeTotal(): number {
		return this.lines.reduce((sum, line) => sum + line.computeSubtotal(), 0);
	}

	addItem(item: CartItem, stock: number): Cart {
		const existing = this.lines.find((line) => line.id === item.productId);
		const inCart = existing?.quantity ?? 0;
		if (!fitsStock({ inCart, requested: item.quantity, stock })) {
			throw CartError.of("quantity_exceeds_stock", { available: Math.max(stock - inCart, 0), requested: item.quantity });
		}

		const lines = existing
			? this.lines.map((line) => (line === existing ? line.increaseBy(item.quantity) : line))
			: [...this.lines, CartLine.restore({ id: item.productId, name: item.name, unitPrice: item.unitPrice, quantity: item.quantity })];
		return this.with({ lines });
	}

	clear(): Cart {
		return this.with({ lines: [] });
	}
}
