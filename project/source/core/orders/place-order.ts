import type { ProductStore } from "@core/catalog/contracts";
import type { Product } from "@core/catalog/entity";
import type { CartStore } from "@core/carts/contracts";
import { cartTotal, itemCount, lineSubtotal } from "@core/carts/entity";
import type { Clock, IdGenerator } from "@core/kernel/contracts";
import { exceptions, type Exception } from "@core/kernel/exceptions";
import { err, ok, type Result } from "@core/kernel/response";
import type { OrderNumberGenerator, OrderStore } from "./contracts";
import type { Order } from "./entity";

export class PlaceOrder {
	constructor(
		private readonly carts: CartStore,
		private readonly products: ProductStore,
		private readonly orders: OrderStore,
		private readonly numbers: OrderNumberGenerator,
		private readonly ids: IdGenerator,
		private readonly clock: Clock,
	) {}

	execute(userId: string): Result<Order, Exception> {
		const cart = this.carts.get(userId);
		if (cart.lines.length === 0) return err(exceptions.cartEmpty());

		const updated: Product[] = [];
		for (const line of cart.lines) {
			const product = this.products.findById(line.productId);
			if (!product) return err(exceptions.productNotFound());
			if (product.stock < line.quantity) return err(exceptions.insufficientStock(product.stock));
			updated.push({ ...product, stock: product.stock - line.quantity });
		}

		const placedAt = this.clock.now();
		const order: Order = {
			id: this.ids.next(),
			number: this.numbers.next(placedAt),
			userId,
			lines: cart.lines.map((line) => ({ ...line, subtotal: lineSubtotal(line) })),
			itemCount: itemCount(cart),
			total: cartTotal(cart),
			placedAt,
		};

		updated.forEach((product) => this.products.save(product));
		this.orders.add(order);
		this.carts.clear(userId);
		return ok(order);
	}
}
