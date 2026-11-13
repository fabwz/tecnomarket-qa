import type { Account } from "@core/account-access";
import { Cart, ShopperId, type CartRepository } from "@core/shopping-cart";
import { toCartView } from "../cart.view";

export class ViewCartHandler {
	constructor(private readonly carts: CartRepository) {}

	execute(account: Account) {
		const shopperId = ShopperId.parse(account.id);
		return toCartView(this.carts.findByShopper(shopperId) ?? Cart.openFor(shopperId));
	}
}
