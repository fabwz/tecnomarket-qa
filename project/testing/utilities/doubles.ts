import { PasswordHash, PlainPassword, type PasswordHasher } from "@core/account-access";
import type { Clock, IdGenerator } from "@core/shared-kernel";

export class TestClock implements Clock {
	constructor(private current: Date) {}

	now(): Date {
		return this.current;
	}

	set(date: Date): void {
		this.current = date;
	}

	advance(milliseconds: number): void {
		this.current = new Date(this.current.getTime() + milliseconds);
	}
}

export class SequentialIds implements IdGenerator {
	private count = 0;

	next(): string {
		this.count += 1;
		return `id-${String(this.count).padStart(4, "0")}`;
	}
}

export class FastHasher implements PasswordHasher {
	hash(plain: PlainPassword): PasswordHash {
		return PasswordHash.parse(`fast$${Bun.hash(plain)}`);
	}

	verify(plain: PlainPassword, hashed: PasswordHash): boolean {
		return this.hash(plain) === hashed;
	}
}
