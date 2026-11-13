import { DomainError } from "@core/shared-kernel";

export const CartError = DomainError.define("cart", {
	invalid_shopper_id: "The shopper id is not valid.",
	invalid_cart_product_id: "The product id is not valid.",
	invalid_item_name: "The item name is not valid.",
	invalid_item_price: "The item price is not valid.",
	invalid_item_quantity: "The item quantity is not valid.",
	quantity_exceeds_stock: "The quantity exceeds the available stock.",
});

export type CartError = ReturnType<typeof CartError.of>;
