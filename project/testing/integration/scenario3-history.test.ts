import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { expectOk } from "@testing/utilities/api-client";
import { accountFixtures, orderFixtures } from "@testing/utilities/fixtures";
import { createTestDock, type TestWorld } from "@testing/utilities/test-dock";

describe("E2E-03 Login and order history", () => {
	let world: TestWorld;

	beforeEach(() => {
		world = createTestDock();
	});

	afterEach(() => {
		world.dock.reset();
	});

	it("shows the order history of a user, newest first and isolated from other users", async () => {
		const { api } = world;
		const { first, second } = orderFixtures;
		const { maria, ana } = accountFixtures;

		const session = await api.login({ email: maria.email, password: maria.password });
		expect(session.status).toBe(200);
		const { token } = expectOk(session);

		const response = await api.orders(token);
		expect(response.status).toBe(200);
		const history = expectOk(response);
		expect(history).toHaveLength(2);
		history.forEach((order) => {
			expect(order.number).toBeTruthy();
			expect(order.placedAt).toBeTruthy();
			expect(order.itemCount).toBeGreaterThan(0);
			expect(order.total).toBeGreaterThan(0);
		});

		expect(history.map((order) => order.number)).toEqual([second.number, first.number]);
		expect(history.map((order) => order.placedAt)).toEqual([second.placedAt, first.placedAt].map((at) => new Date(at).toISOString()));
		expect(history.map((order) => ({ itemCount: order.itemCount, total: order.total }))).toEqual([
			{ itemCount: 1, total: 95000 },
			{ itemCount: 3, total: 60000 },
		]);

		const other = expectOk(await api.login({ email: ana.email, password: ana.password }));
		expect(expectOk(await api.orders(other.token))).toEqual([]);
	});
});
