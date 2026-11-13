import { uuidv7 } from "uuidv7";
import type { IdGenerator } from "@core/shared-kernel";

export class UuidGenerator implements IdGenerator {
	next(): string {
		return uuidv7();
	}
}
