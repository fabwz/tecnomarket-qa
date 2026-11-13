import { Entity, type EntityState } from "@core/shared-kernel";
import { OrderError } from "./order.errors";
import { OrderLine, type OrderLineState } from "./order.parts";
import type { BuyerId, OrderId, OrderNumber } from "./order.vos";

export type OrderState = EntityState<OrderId> & {
	readonly number: OrderNumber;
	readonly buyerId: BuyerId;
	readonly lines: readonly OrderLine[];
	readonly placedAt: Date;
};

export type OrderPlacement = Omit<OrderState, "lines" | "placedAt"> & { readonly lines: readonly OrderLineState[] };

export interface Order extends OrderState {}

export class Order extends Entity<OrderState> {
	static place(input: OrderPlacement, now: Date): Order {
		if (input.lines.length === 0) throw OrderError.of("empty_order");
		return new Order({ ...input, lines: input.lines.map((line) => OrderLine.restore(line)), placedAt: now });
	}

	countItems(): number {
		return this.lines.reduce((sum, line) => sum + line.quantity, 0);
	}

	computeTotal(): number {
		return this.lines.reduce((sum, line) => sum + line.computeSubtotal(), 0);
	}
}
