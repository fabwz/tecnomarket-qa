import { uuidv7 } from "uuidv7";
import type { IdGenerator } from "@core/kernel/contracts";

export class UuidGenerator implements IdGenerator {
	next(): string {
		return uuidv7();
	}
}
