import type { Container } from "dockdi";
import type { Account } from "@core/account-access";
import { Cart, ShopperId } from "@core/shopping-cart";
import { CartRepositoryToken } from "@tokens";
import { toCartView } from "../cart.view";

export const viewCart = (dock: Container, account: Account) => {
	const shopperId = ShopperId.parse(account.id);
	const cart = dock.resolve(CartRepositoryToken).findByShopper(shopperId) ?? Cart.openFor(shopperId);
	return toCartView(cart);
};
