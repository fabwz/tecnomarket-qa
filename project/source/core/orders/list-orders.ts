import { ok, type Result } from "@core/kernel/response";
import type { OrderStore } from "./contracts";
import type { Order } from "./entity";

export class ListOrders {
	constructor(private readonly orders: OrderStore) {}

	execute(userId: string): Result<readonly Order[], never> {
		const newestFirst = this.orders
			.listByUser(userId)
			.toReversed()
			.sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime());
		return ok(newestFirst);
	}
}
