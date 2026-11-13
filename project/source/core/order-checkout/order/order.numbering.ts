import type { OrderNumber } from "./order.vos";

export interface OrderNumbering {
	next(date: Date): OrderNumber;
}
