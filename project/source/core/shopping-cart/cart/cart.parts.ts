import { Entity, type EntityState } from "@core/shared-kernel";
import { ItemQuantity, type CartProductId, type ItemName, type ItemPrice } from "./cart.vos";

export type CartLineState = EntityState<CartProductId> & {
	readonly name: ItemName;
	readonly unitPrice: ItemPrice;
	readonly quantity: ItemQuantity;
};

export interface CartLine extends CartLineState {}

export class CartLine extends Entity<CartLineState> {
	computeSubtotal(): number {
		return this.unitPrice * this.quantity;
	}

	increaseBy(quantity: ItemQuantity): CartLine {
		return this.with({ quantity: ItemQuantity.parse(this.quantity + quantity) });
	}
}
