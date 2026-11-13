import { token } from "dockdi";
import type { Account } from "@core/account-access";
import {
	BuyerId,
	LineName,
	LinePrice,
	LineProductId,
	LineQuantity,
	Order,
	OrderError,
	OrderId,
	type OrderNumbering,
	type OrderRepository,
} from "@core/order-checkout";
import { ProductError, ProductId, StockUnits, type ProductRepository } from "@core/product-catalog";
import { Cart, ShopperId, type CartRepository } from "@core/shopping-cart";
import type { Clock, IdGenerator } from "@core/shared-kernel";
import { toOrderView } from "../order.view";

export class PlaceOrderHandler {
	constructor(
		private readonly products: ProductRepository,
		private readonly carts: CartRepository,
		private readonly orders: OrderRepository,
		private readonly numbering: OrderNumbering,
		private readonly ids: IdGenerator,
		private readonly clock: Clock,
	) {}

	execute(account: Account) {
		const shopperId = ShopperId.parse(account.id);
		const cart = this.carts.findByShopper(shopperId) ?? Cart.openFor(shopperId);
		if (cart.isEmpty()) throw OrderError.of("empty_order");

		const withdrawn = cart.lines.map((line) => {
			const product = this.products.findById(ProductId.parse(line.id));
			if (!product) throw ProductError.of("product_not_found");
			return product.withdraw(StockUnits.parse(line.quantity));
		});

		const now = this.clock.now();
		const order = Order.place(
			{
				id: OrderId.parse(this.ids.next()),
				number: this.numbering.next(now),
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

		withdrawn.forEach((product) => this.products.add(product));
		this.orders.add(order);
		this.carts.add(cart.clear());
		return toOrderView(order);
	}
}

export const PlaceOrderHandlerToken = token(PlaceOrderHandler);
