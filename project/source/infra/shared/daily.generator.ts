import type { OrderNumberGenerator } from "@core/orders/contracts";

export class DailyGenerator implements OrderNumberGenerator {
	private readonly counters = new Map<string, number>();

	next(date: Date): string {
		const day = date.toISOString().slice(0, 10).replaceAll("-", "");
		const sequence = (this.counters.get(day) ?? 0) + 1;
		this.counters.set(day, sequence);
		return `PED-${day}-${String(sequence).padStart(4, "0")}`;
	}
}
