import type { Product } from "@core/catalog/entity";

export type CartLine = {
	readonly productId: string;
	readonly name: string;
	readonly unitPrice: number;
	readonly quantity: number;
};

export type Cart = { readonly userId: string; readonly lines: readonly CartLine[] };

export type CartLineView = CartLine & { readonly subtotal: number };

export type CartView = {
	readonly lines: readonly CartLineView[];
	readonly itemCount: number;
	readonly total: number;
};

export const emptyCart = (userId: string): Cart => ({ userId, lines: [] });

export const lineSubtotal = (line: CartLine): number => line.unitPrice * line.quantity;

export const itemCount = (cart: Cart): number => cart.lines.reduce((sum, line) => sum + line.quantity, 0);

export const cartTotal = (cart: Cart): number => cart.lines.reduce((sum, line) => sum + lineSubtotal(line), 0);

export const quantityOf = (cart: Cart, productId: string): number =>
	cart.lines.find((line) => line.productId === productId)?.quantity ?? 0;

export function addLine(cart: Cart, product: Product, quantity: number): Cart {
	const exists = cart.lines.some((line) => line.productId === product.id);
	const lines = exists
		? cart.lines.map((line) => (line.productId === product.id ? { ...line, quantity: line.quantity + quantity } : line))
		: [...cart.lines, { productId: product.id, name: product.name, unitPrice: product.price, quantity }];
	return { ...cart, lines };
}

export const toView = (cart: Cart): CartView => ({
	lines: cart.lines.map((line) => ({ ...line, subtotal: lineSubtotal(line) })),
	itemCount: itemCount(cart),
	total: cartTotal(cart),
});
