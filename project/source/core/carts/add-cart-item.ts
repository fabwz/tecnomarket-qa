import type { ProductStore } from "@core/catalog/contracts";
import { isAvailable } from "@core/catalog/rules";
import { exceptions, type Exception } from "@core/kernel/exceptions";
import { err, ok, type Result } from "@core/kernel/response";
import { parse } from "@core/kernel/validation";
import type { CartStore } from "./contracts";
import { addLine, quantityOf, toView, type CartView } from "./entity";
import { addCartItemSchema, type AddCartItemInput } from "./rules";

export class AddCartItem {
	constructor(
		private readonly products: ProductStore,
		private readonly carts: CartStore,
	) {}

	execute(userId: string, input: AddCartItemInput): Result<CartView, Exception> {
		const parsed = parse(addCartItemSchema, input);
		if (!parsed.ok) return parsed;

		const { productId, quantity } = parsed.value;
		const product = this.products.findById(productId);
		if (!product) return err(exceptions.productNotFound());
		if (!isAvailable(product)) return err(exceptions.productOutOfStock());

		const cart = this.carts.get(userId);
		const remaining = product.stock - quantityOf(cart, productId);
		if (quantity > remaining) return err(exceptions.insufficientStock(remaining));

		const updated = addLine(cart, product, quantity);
		this.carts.save(updated);
		return ok(toView(updated));
	}
}
