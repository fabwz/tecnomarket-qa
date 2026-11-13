import { token } from "dockdi";
import { Elysia } from "elysia";
import type { ListOrdersPlugin } from "./list-orders/list-orders.plugin";
import type { PlaceOrderPlugin } from "./place-order/place-order.plugin";

export class OrderCheckoutPlugin {
	constructor(
		private readonly placeOrder: PlaceOrderPlugin,
		private readonly listOrders: ListOrdersPlugin,
	) {}

	plugin() {
		return new Elysia().use(this.placeOrder.plugin()).use(this.listOrders.plugin());
	}
}

export const OrderCheckoutPluginToken = token(OrderCheckoutPlugin);
