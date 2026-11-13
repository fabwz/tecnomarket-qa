import type { Account } from "@core/account-access";
import { BuyerId, type OrderRepository } from "@core/order-checkout";
import { toOrderView } from "../order.view";

export class ListOrdersHandler {
	constructor(private readonly orders: OrderRepository) {}

	execute(account: Account) {
		return this.orders
			.listByBuyer(BuyerId.parse(account.id))
			.toReversed()
			.sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime())
			.map(toOrderView);
	}
}
