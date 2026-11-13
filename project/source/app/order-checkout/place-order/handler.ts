import type { Container } from "dockdi";
import type { Account } from "@core/account-access";
import { ProductError, ProductId, StockUnits } from "@core/product-catalog";
import { Cart, ShopperId } from "@core/shopping-cart";
import { BuyerId, LineName, LinePrice, LineProductId, LineQuantity, Order, OrderError, OrderId } from "@core/order-checkout";
import {
	CartRepositoryToken,
	ClockToken,
	IdGeneratorToken,
	OrderNumberingToken,
	OrderRepositoryToken,
	ProductRepositoryToken,
} from "@tokens";
import { toOrderView } from "../order.view";

export const placeOrder = (dock: Container, account: Account) => {
	const products = dock.resolve(ProductRepositoryToken);
	const carts = dock.resolve(CartRepositoryToken);
	const shopperId = ShopperId.parse(account.id);
	const cart = carts.findByShopper(shopperId) ?? Cart.openFor(shopperId);

	if (cart.isEmpty()) throw OrderError.of("empty_order");

	const withdrawn = cart.lines.map((line) => {
		const product = products.findById(ProductId.parse(line.id));
		if (!product) throw ProductError.of("product_not_found");
		return product.withdraw(StockUnits.parse(line.quantity));
	});

	const now = dock.resolve(ClockToken).now();
	const order = Order.place(
		{
			id: OrderId.parse(dock.resolve(IdGeneratorToken).next()),
			number: dock.resolve(OrderNumberingToken).next(now),
			buyerId: BuyerId.parse(account.id),
			lines: cart.lines.map((line) => ({
				id: LineProductId.parse(line.id),
				name: LineName.parse(line.name),
				unitPrice: LinePrice.parse(line.unitPrice),
				quantity: LineQuantity.parse(line.quantity),
			})),
		},
		now,
	);

	withdrawn.forEach((product) => products.add(product));
	dock.resolve(OrderRepositoryToken).add(order);
	carts.add(cart.clear());
	return toOrderView(order);
};
