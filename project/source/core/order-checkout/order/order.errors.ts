import { DomainError } from "@core/shared-kernel";

export const OrderError = DomainError.define("order", {
	invalid_order_id: "The order id is not valid.",
	invalid_order_number: "The order number is not valid.",
	invalid_buyer_id: "The buyer id is not valid.",
	invalid_line_product_id: "The line product id is not valid.",
	invalid_line_name: "The line name is not valid.",
	invalid_line_price: "The line price is not valid.",
	invalid_line_quantity: "The line quantity is not valid.",
	empty_order: "An order needs at least one line.",
});

export type OrderError = ReturnType<typeof OrderError.of>;
