import type { Container } from "dockdi";
import type { Account } from "@core/account-access";
import { ProductError, ProductId } from "@core/product-catalog";
import { Cart, CartProductId, ItemName, ItemPrice, ItemQuantity, ShopperId } from "@core/shopping-cart";
import { CartRepositoryToken, ProductRepositoryToken } from "@tokens";
import { toCartView } from "../cart.view";
import type { AddCartItemBody } from "./schema";

export const addCartItem = (dock: Container, account: Account, input: AddCartItemBody) => {
	const quantity = ItemQuantity.parse(input.quantity);
	const product = dock.resolve(ProductRepositoryToken).findById(ProductId.parse(input.productId));
	if (!product) throw ProductError.of("product_not_found");
	if (!product.isInStock()) throw ProductError.of("product_out_of_stock");

	const carts = dock.resolve(CartRepositoryToken);
	const shopperId = ShopperId.parse(account.id);
	const cart = carts.findByShopper(shopperId) ?? Cart.openFor(shopperId);
	const updated = cart.addItem(
		{
			productId: CartProductId.parse(product.id),
			name: ItemName.parse(product.name),
			unitPrice: ItemPrice.parse(product.price),
			quantity,
		},
		product.stock,
	);
	carts.add(updated);
	return toCartView(updated);
};
