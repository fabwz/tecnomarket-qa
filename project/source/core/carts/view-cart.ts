import { ok, type Result } from "@core/kernel/response";
import type { CartStore } from "./contracts";
import { toView, type CartView } from "./entity";

export class ViewCart {
	constructor(private readonly carts: CartStore) {}

	execute(userId: string): Result<CartView, never> {
		return ok(toView(this.carts.get(userId)));
	}
}
