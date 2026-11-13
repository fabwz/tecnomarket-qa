import { text, type Failure, type ValueObject } from "./values";

export interface IdGenerator {
	next(): string;
}

export function identifier<Kind extends string>(kind: Kind, fail: Failure): ValueObject<string, Kind> {
	return text(kind, { min: 1, max: 64 }, fail);
}
