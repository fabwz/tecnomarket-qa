import type { Account } from "@core/account-access";
import { ProductError, ProductId, type ProductRepository } from "@core/product-catalog";
import {
	Cart,
	CartProductId,
	ItemName,
	ItemPrice,
	ItemQuantity,
	ShopperId,
	type CartRepository,
} from "@core/shopping-cart";
import { toCartView } from "../cart.view";
import type { AddCartItemBody } from "./add-cart-item.schema";

export class AddCartItemHandler {
	constructor(
		private readonly products: ProductRepository,
		private readonly carts: CartRepository,
	) {}

	execute(account: Account, input: AddCartItemBody) {
		const quantity = ItemQuantity.parse(input.quantity);
		const product = this.products.findById(ProductId.parse(input.productId));
		if (!product) throw ProductError.of("product_not_found");
		if (!product.isInStock()) throw ProductError.of("product_out_of_stock");

		const shopperId = ShopperId.parse(account.id);
		const cart = this.carts.findByShopper(shopperId) ?? Cart.openFor(shopperId);
		const updated = cart.addItem(
			{
				productId: CartProductId.parse(product.id),
				name: ItemName.parse(product.name),
				unitPrice: ItemPrice.parse(product.price),
				quantity,
			},
			product.stock,
		);
		this.carts.add(updated);
		return toCartView(updated);
	}
}
