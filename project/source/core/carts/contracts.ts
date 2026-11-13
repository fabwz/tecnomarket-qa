import type { Cart } from "./entity";

export interface CartStore {
	get(userId: string): Cart;
	save(cart: Cart): void;
	clear(userId: string): void;
}
