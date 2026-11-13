import type { Order } from "./order.entity";
import type { BuyerId } from "./order.vos";

export interface OrderRepository {
	add(order: Order): void;
	listByBuyer(buyerId: BuyerId): readonly Order[];
}
