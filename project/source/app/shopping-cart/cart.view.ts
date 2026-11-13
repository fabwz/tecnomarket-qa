import type { Cart } from "@core/shopping-cart";

export const toCartView = (cart: Cart) => ({
	lines: cart.lines.map((line) => ({
		productId: line.id,
		name: line.name,
		unitPrice: line.unitPrice,
		quantity: line.quantity,
		subtotal: line.computeSubtotal(),
	})),
	itemCount: cart.countItems(),
	total: cart.computeTotal(),
});
