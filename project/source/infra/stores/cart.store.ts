import type { Cart, CartRepository, ShopperId } from "@core/shopping-cart";

export class CartStore implements CartRepository {
	private readonly carts = new Map<ShopperId, Cart>();

	add(cart: Cart): void {
		this.carts.set(cart.id, cart);
	}

	findByShopper(shopperId: ShopperId): Cart | undefined {
		return this.carts.get(shopperId);
	}
}
