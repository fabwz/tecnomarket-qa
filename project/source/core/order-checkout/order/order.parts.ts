import { Entity, type EntityState } from "@core/shared-kernel";
import type { LineName, LinePrice, LineProductId, LineQuantity } from "./order.vos";

export type OrderLineState = EntityState<LineProductId> & {
	readonly name: LineName;
	readonly unitPrice: LinePrice;
	readonly quantity: LineQuantity;
};

export interface OrderLine extends OrderLineState {}

export class OrderLine extends Entity<OrderLineState> {
	computeSubtotal(): number {
		return this.unitPrice * this.quantity;
	}
}
