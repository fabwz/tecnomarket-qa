import { OrderNumber, type OrderNumbering } from "@core/order-checkout";

export class DailyNumbering implements OrderNumbering {
	private readonly counters = new Map<string, number>();

	next(date: Date): OrderNumber {
		const day = date.toISOString().slice(0, 10).replaceAll("-", "");
		const sequence = (this.counters.get(day) ?? 0) + 1;
		this.counters.set(day, sequence);
		return OrderNumber.parse(`PED-${day}-${String(sequence).padStart(4, "0")}`);
	}
}
