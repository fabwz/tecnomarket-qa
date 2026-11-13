import { Container, type Module } from "dockdi";
import { ClockToken, IdGeneratorToken, OrderNumberGeneratorToken, PasswordHasherToken } from "@tokens";
import { SystemClock } from "@infra/shared/system.clock";
import { UuidGenerator } from "@infra/shared/uuid.generator";
import { BunHasher } from "@infra/shared/bun.hasher";
import { DailyGenerator } from "@infra/shared/daily.generator";

const sharedModule: Module = (c) => {
	c.bind(ClockToken).toClass(SystemClock).inSingleton();
	c.bind(IdGeneratorToken).toClass(UuidGenerator).inSingleton();
	c.bind(PasswordHasherToken).toClass(BunHasher).inSingleton();
	c.bind(OrderNumberGeneratorToken).toClass(DailyGenerator).inSingleton();
};


export function createDock(overrides?: Module): Container {
	const dock = new Container().load(sharedModule).scope();
	overrides?.(dock);
	return dock;
}
