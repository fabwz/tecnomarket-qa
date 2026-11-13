import type { Container } from "dockdi";
import type { Account } from "@core/account-access";
import { BuyerId } from "@core/order-checkout";
import { OrderRepositoryToken } from "@tokens";
import { toOrderView } from "../order.view";

export const listOrders = (dock: Container, account: Account) =>
	dock
		.resolve(OrderRepositoryToken)
		.listByBuyer(BuyerId.parse(account.id))
		.toReversed()
		.sort((a, b) => b.placedAt.getTime() - a.placedAt.getTime())
		.map(toOrderView);
