import type { BuyerId, Order, OrderId, OrderRepository } from "@core/order-checkout";

export class OrderStore implements OrderRepository {
	private readonly orders = new Map<OrderId, Order>();

	add(order: Order): void {
		this.orders.set(order.id, order);
	}

	listByBuyer(buyerId: BuyerId): readonly Order[] {
		return [...this.orders.values()].filter((order) => order.buyerId === buyerId);
	}
}
