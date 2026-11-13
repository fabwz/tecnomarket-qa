import { identifier, text, whole } from "@core/shared-kernel";
import { ProductError } from "./product.errors";

export const ProductId = identifier("product_id", (details) => ProductError.of("invalid_product_id", details));
export type ProductId = ReturnType<typeof ProductId.parse>;

export const ProductName = text("product_name", { min: 1, max: 120 }, (details) =>
	ProductError.of("invalid_product_name", details),
);
export type ProductName = ReturnType<typeof ProductName.parse>;

export const ProductDescription = text("product_description", { max: 500 }, (details) =>
	ProductError.of("invalid_product_description", details),
);
export type ProductDescription = ReturnType<typeof ProductDescription.parse>;

export const UnitPrice = whole("unit_price", { min: 0 }, (details) => ProductError.of("invalid_unit_price", details));
export type UnitPrice = ReturnType<typeof UnitPrice.parse>;

export const StockUnits = whole("stock_units", { min: 0 }, (details) => ProductError.of("invalid_stock_units", details));
export type StockUnits = ReturnType<typeof StockUnits.parse>;
