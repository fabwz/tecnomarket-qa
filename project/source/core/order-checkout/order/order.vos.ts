import { identifier, text, whole } from "@core/shared-kernel";
import { OrderError } from "./order.errors";

export const OrderId = identifier("order_id", (details) => OrderError.of("invalid_order_id", details));
export type OrderId = ReturnType<typeof OrderId.parse>;

export const OrderNumber = text("order_number", { pattern: /^PED-\d{8}-\d{4}$/ }, (details) =>
	OrderError.of("invalid_order_number", details),
);
export type OrderNumber = ReturnType<typeof OrderNumber.parse>;

export const BuyerId = identifier("buyer_id", (details) => OrderError.of("invalid_buyer_id", details));
export type BuyerId = ReturnType<typeof BuyerId.parse>;

export const LineProductId = identifier("line_product_id", (details) =>
	OrderError.of("invalid_line_product_id", details),
);
export type LineProductId = ReturnType<typeof LineProductId.parse>;

export const LineName = text("line_name", { min: 1, max: 120 }, (details) => OrderError.of("invalid_line_name", details));
export type LineName = ReturnType<typeof LineName.parse>;

export const LinePrice = whole("line_price", { min: 0 }, (details) => OrderError.of("invalid_line_price", details));
export type LinePrice = ReturnType<typeof LinePrice.parse>;

export const LineQuantity = whole("line_quantity", { min: 1 }, (details) =>
	OrderError.of("invalid_line_quantity", details),
);
export type LineQuantity = ReturnType<typeof LineQuantity.parse>;
