import { identifier, text, whole } from "@core/shared-kernel";
import { CartError } from "./cart.errors";

export const ShopperId = identifier("shopper_id", (details) => CartError.of("invalid_shopper_id", details));
export type ShopperId = ReturnType<typeof ShopperId.parse>;

export const CartProductId = identifier("cart_product_id", (details) =>
	CartError.of("invalid_cart_product_id", details),
);
export type CartProductId = ReturnType<typeof CartProductId.parse>;

export const ItemName = text("item_name", { min: 1, max: 120 }, (details) => CartError.of("invalid_item_name", details));
export type ItemName = ReturnType<typeof ItemName.parse>;

export const ItemPrice = whole("item_price", { min: 0 }, (details) => CartError.of("invalid_item_price", details));
export type ItemPrice = ReturnType<typeof ItemPrice.parse>;

export const ItemQuantity = whole("item_quantity", { min: 1 }, (details) =>
	CartError.of("invalid_item_quantity", details),
);
export type ItemQuantity = ReturnType<typeof ItemQuantity.parse>;
