import type { Module } from "dockdi";
import { ClockToken, IdGeneratorToken, OrderNumberingToken, PasswordHasherToken } from "@tokens";
import { BunHasher } from "./bun.hasher";
import { DailyNumbering } from "./daily.numbering";
import { SystemClock } from "./system.clock";
import { UuidGenerator } from "./uuid.generator";

export const sharedModule: Module = (c) => {
	c.bind(ClockToken).toClass(SystemClock).inSingleton();
	c.bind(IdGeneratorToken).toClass(UuidGenerator).inSingleton();
	c.bind(PasswordHasherToken).toClass(BunHasher).inSingleton();
	c.bind(OrderNumberingToken).toClass(DailyNumbering).inSingleton();
};
