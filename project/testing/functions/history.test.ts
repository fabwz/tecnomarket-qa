import { beforeEach, describe, expect, it } from "vitest";
import { ListOrdersHandler } from "@app/order-checkout/list-orders/list-orders.handler";
import { PlaceOrderHandler } from "@app/order-checkout/place-order/place-order.handler";
import { codeOf } from "@testing/utilities/assertions";
import { createAuthWorld } from "@testing/utilities/auth-world";
import { cartOf, orderOf, productOf } from "@testing/utilities/factories";
import { accountFixtures, orderFixtures, productFixtures } from "@testing/utilities/fixtures";
import { mockCarts, mockClock, mockIds, mockNumbering, mockOrders, mockProducts } from "@testing/utilities/mocks";

describe("Order history", () => {
	const { first, second } = orderFixtures;
	let auth: ReturnType<typeof createAuthWorld>;
	let orders: ReturnType<typeof mockOrders>;
	let handler: ListOrdersHandler;

	beforeEach(() => {
		auth = createAuthWorld();
		orders = mockOrders([orderOf(first), orderOf(second)]);
		handler = new ListOrdersHandler(orders);
	});

	it("CP-HIS-01 lists the orders of a user with date, number, items and amount", () => {
		const history = handler.execute(auth.people.maria);

		expect(history).toHaveLength(2);
		expect(history.map(({ number, placedAt, itemCount, total }) => ({ number, placedAt, itemCount, total }))).toEqual([
			{ number: second.number, placedAt: new Date(second.placedAt), itemCount: 1, total: 95000 },
			{ number: first.number, placedAt: new Date(first.placedAt), itemCount: 3, total: 60000 },
		]);
	});

	it("CP-HIS-02 returns an empty list for a user without orders", () => {
		expect(handler.execute(auth.people.luis)).toEqual([]);
	});

	it("CP-HIS-03 lists the most recent order first whatever the storage order", () => {
		const reversed = new ListOrdersHandler(mockOrders([orderOf(second), orderOf(first)]));

		for (const history of [handler.execute(auth.people.maria), reversed.execute(auth.people.maria)]) {
			const dates = history.map((order) => order.placedAt.getTime());
			expect(dates).toEqual([...dates].sort((a, b) => b - a));
			expect(history[0]!.number).toBe(second.number);
		}
	});

	it("CP-HIS-04 does not show orders of other users", () => {
		const own = { ...first, id: "ord-0003", number: "PED-20261111-0001", buyerId: accountFixtures.ana.id };
		const shared = new ListOrdersHandler(mockOrders([orderOf(first), orderOf(own), orderOf(second)]));

		const history = shared.execute(auth.people.ana);

		expect(history.map((order) => order.number)).toEqual([own.number]);
	});

	it("CP-HIS-05 requires a session to open the history", () => {
		expect(codeOf(() => auth.plugin.authenticate(undefined))).toBe("session_required");
	});

	it("CP-HIS-06 shows a newly placed order first with the amount of the purchase", () => {
		const { keyboard, mouse } = productFixtures;
		const carts = mockCarts([cartOf(auth.people.ana, [[keyboard, 1], [mouse, 2]])]);
		const place = new PlaceOrderHandler(
			mockProducts(Object.values(productFixtures).map(productOf)),
			carts,
			orders,
			mockNumbering(),
			mockIds("ord"),
			mockClock(),
		);

		const summary = place.execute(auth.people.ana);
		const history = handler.execute(auth.people.ana);

		expect(history[0]).toMatchObject({ number: summary.number, total: 60000 });
	});
});
