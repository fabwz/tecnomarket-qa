import type { OrderNumberGenerator } from "@core/orders/contracts";

export class DailyGenerator implements OrderNumberGenerator {
	// shortcut: counters live in memory and restart with the process, move to the order store if numbers must survive restarts
	private readonly counters = new Map<string, number>();

	next(date: Date): string {
		const day = date.toISOString().slice(0, 10).replaceAll("-", "");
		const sequence = (this.counters.get(day) ?? 0) + 1;
		this.counters.set(day, sequence);
		return `PED-${day}-${String(sequence).padStart(4, "0")}`;
	}
}
