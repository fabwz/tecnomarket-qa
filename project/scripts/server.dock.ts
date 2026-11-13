import { Container, type Module } from "dockdi";
import { ClockToken, IdGeneratorToken, OrderNumberingToken, PasswordHasherToken } from "@tokens";
import { SystemClock } from "@infra/shared/system.clock";
import { UuidGenerator } from "@infra/shared/uuid.generator";
import { BunHasher } from "@infra/shared/bun.hasher";
import { DailyNumbering } from "@infra/shared/daily.numbering";

const sharedModule: Module = (c) => {
	c.bind(ClockToken).toClass(SystemClock).inSingleton();
	c.bind(IdGeneratorToken).toClass(UuidGenerator).inSingleton();
	c.bind(PasswordHasherToken).toClass(BunHasher).inSingleton();
	c.bind(OrderNumberingToken).toClass(DailyNumbering).inSingleton();
};

export function createDock(overrides?: Module): Container {
	const dock = new Container().load(sharedModule).scope();
	overrides?.(dock);
	return dock;
}
