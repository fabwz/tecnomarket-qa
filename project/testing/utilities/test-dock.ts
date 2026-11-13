import type { Container } from "dockdi";
import { AppToken } from "@app/app";
import { createDock } from "@scripts/server.dock";
import {
	AccountRepositoryToken,
	ClockToken,
	IdGeneratorToken,
	OrderRepositoryToken,
	PasswordHasherToken,
	ProductRepositoryToken,
} from "@tokens";
import { ApiClient } from "./api-client";
import { FastHasher, SequentialIds, TestClock } from "./doubles";
import { accountOf, orderOf, productOf } from "./factories";
import { accountFixtures, orderFixtures, productFixtures, testStartAt } from "./fixtures";

export type SeedOptions = { readonly accounts?: boolean; readonly products?: boolean; readonly orders?: boolean };

export type TestWorld = { readonly dock: Container; readonly clock: TestClock; readonly api: ApiClient };

export function createTestDock({ accounts = true, products = true, orders = true }: SeedOptions = {}): TestWorld {
	const startAt = new Date(testStartAt);
	const clock = new TestClock(startAt);
	const hasher = new FastHasher();
	const dock = createDock((c) => {
		c.override(ClockToken).toValue(clock);
		c.override(IdGeneratorToken).toValue(new SequentialIds());
		c.override(PasswordHasherToken).toValue(hasher);
	});

	if (accounts) {
		const store = dock.resolve(AccountRepositoryToken);
		Object.values(accountFixtures).forEach((fixture) => store.add(accountOf(fixture, hasher, startAt)));
	}
	if (products) {
		const store = dock.resolve(ProductRepositoryToken);
		Object.values(productFixtures).forEach((fixture) => store.add(productOf(fixture)));
	}
	if (orders) {
		const store = dock.resolve(OrderRepositoryToken);
		Object.values(orderFixtures).forEach((fixture) => store.add(orderOf(fixture)));
	}

	return { dock, clock, api: new ApiClient(dock.resolve(AppToken).build()) };
}
