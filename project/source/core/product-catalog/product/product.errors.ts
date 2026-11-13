import { DomainError } from "@core/shared-kernel";

export const ProductError = DomainError.define("product", {
	invalid_product_id: "The product id is not valid.",
	invalid_product_name: "The product name is not valid.",
	invalid_product_description: "The product description is not valid.",
	invalid_unit_price: "The unit price is not valid.",
	invalid_stock_units: "The stock units are not valid.",
	product_not_found: "The product does not exist.",
	product_out_of_stock: "The product is out of stock.",
	insufficient_stock: "The product does not have enough stock.",
});

export type ProductError = ReturnType<typeof ProductError.of>;
