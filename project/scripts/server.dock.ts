import { Container, type Module } from "dockdi";
import {
	AccountRepositoryToken,
	CartRepositoryToken,
	ClockToken,
	IdGeneratorToken,
	OrderNumberingToken,
	OrderRepositoryToken,
	PasswordHasherToken,
	ProductRepositoryToken,
	SessionRepositoryToken,
} from "@tokens";
import { SystemClock } from "@infra/shared/system.clock";
import { UuidGenerator } from "@infra/shared/uuid.generator";
import { BunHasher } from "@infra/shared/bun.hasher";
import { DailyNumbering } from "@infra/shared/daily.numbering";
import { AccountStore } from "@infra/stores/account.store";
import { CartStore } from "@infra/stores/cart.store";
import { OrderStore } from "@infra/stores/order.store";
import { ProductStore } from "@infra/stores/product.store";
import { SessionStore } from "@infra/stores/session.store";

const sharedModule: Module = (c) => {
	c.bind(ClockToken).toClass(SystemClock).inSingleton();
	c.bind(IdGeneratorToken).toClass(UuidGenerator).inSingleton();
	c.bind(PasswordHasherToken).toClass(BunHasher).inSingleton();
	c.bind(OrderNumberingToken).toClass(DailyNumbering).inSingleton();
};

const storesModule: Module = (c) => {
	c.bind(AccountRepositoryToken).toClass(AccountStore).inSingleton();
	c.bind(SessionRepositoryToken).toClass(SessionStore).inSingleton();
	c.bind(ProductRepositoryToken).toClass(ProductStore).inSingleton();
	c.bind(CartRepositoryToken).toClass(CartStore).inSingleton();
	c.bind(OrderRepositoryToken).toClass(OrderStore).inSingleton();
};

export function createDock(overrides?: Module): Container {
	const dock = new Container().load(sharedModule, storesModule).scope();
	overrides?.(dock);
	return dock;
}
