import type { Cart } from "./cart.entity";
import type { ShopperId } from "./cart.vos";

export interface CartRepository {
	add(cart: Cart): void;
	findByShopper(shopperId: ShopperId): Cart | undefined;
}
