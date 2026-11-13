import type { Order } from "@core/order-checkout";

export const toOrderView = (order: Order) => ({
	id: order.id,
	number: order.number,
	placedAt: order.placedAt,
	itemCount: order.countItems(),
	total: order.computeTotal(),
	lines: order.lines.map((line) => ({
		productId: line.id,
		name: line.name,
		unitPrice: line.unitPrice,
		quantity: line.quantity,
		subtotal: line.computeSubtotal(),
	})),
});
