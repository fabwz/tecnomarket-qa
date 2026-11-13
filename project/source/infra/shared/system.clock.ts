import type { Clock } from "@core/shared-kernel";

export class SystemClock implements Clock {
	now(): Date {
		return new Date();
	}
}
