import { beforeEach, describe, expect, it } from "vitest";
import { PlaceOrderHandler } from "@app/order-checkout/place-order/place-order.handler";
import { codeOf } from "@testing/utilities/assertions";
import { createAuthWorld } from "@testing/utilities/auth-world";
import { cartOf, productOf } from "@testing/utilities/factories";
import { productFixtures } from "@testing/utilities/fixtures";
import { mockCarts, mockClock, mockIds, mockNumbering, mockOrders, mockProducts } from "@testing/utilities/mocks";

const { keyboard, mouse, monitor } = productFixtures;

describe("Order placement", () => {
	let auth: ReturnType<typeof createAuthWorld>;
	let products: ReturnType<typeof mockProducts>;
	let carts: ReturnType<typeof mockCarts>;
	let orders: ReturnType<typeof mockOrders>;
	let numbering: ReturnType<typeof mockNumbering>;
	let handler: PlaceOrderHandler;

	beforeEach(() => {
		auth = createAuthWorld();
		products = mockProducts(Object.values(productFixtures).map(productOf));
		carts = mockCarts();
		orders = mockOrders();
		numbering = mockNumbering();
		handler = new PlaceOrderHandler(products, carts, orders, numbering, mockIds("ord"), mockClock());
	});

	const ana = () => auth.people.ana;
	const fillCart = (items: Parameters<typeof cartOf>[1]) => carts.add(cartOf(ana(), items));
	const stockOf = (id: string) => products.findById(id as never)?.stock;
	const savedOrders = () => orders.add.mock.calls.map(([order]) => order);

	it("CP-COM-01 places an order with two products", () => {
		fillCart([[keyboard, 1], [mouse, 2]]);

		const summary = handler.execute(ana());

		expect(summary).toMatchObject({ number: "PED-20261113-0001", itemCount: 3, total: 60000 });
		expect(summary.lines).toHaveLength(2);
		expect(savedOrders()).toHaveLength(1);
		expect(savedOrders()[0]).toMatchObject({ buyerId: ana().id, id: summary.id });
		expect(savedOrders()[0]!.lines).toHaveLength(2);
		expect(savedOrders()[0]!.computeTotal()).toBe(60000);
		expect(carts.findByShopper(ana().id as never)?.isEmpty()).toBe(true);
		expect(stockOf("P-001")).toBe(4);
		expect(stockOf("P-002")).toBe(8);
	});

	it("CP-COM-02 gives a different order number to consecutive purchases", () => {
		fillCart([[keyboard, 1]]);
		const first = handler.execute(ana());
		fillCart([[keyboard, 1]]);
		const second = handler.execute(ana());

		expect(first.number).not.toBe(second.number);
		expect(new Set(savedOrders().map((order) => order.number)).size).toBe(2);
	});

	it("CP-COM-03 refuses an empty cart without consuming an order number", () => {
		expect(codeOf(() => handler.execute(auth.people.luis))).toBe("empty_order");

		expect(orders.add).not.toHaveBeenCalled();
		expect(numbering.next).not.toHaveBeenCalled();
	});

	it("CP-COM-04 refuses the purchase when the stock dropped, leaving everything untouched", () => {
		fillCart([[monitor, 2]]);
		products.add(productOf({ ...monitor, stock: 1 }));
		products.add.mockClear();

		expect(codeOf(() => handler.execute(ana()))).toBe("insufficient_stock");

		expect(orders.add).not.toHaveBeenCalled();
		expect(products.add).not.toHaveBeenCalled();
		expect(carts.add).toHaveBeenCalledOnce();
		expect(stockOf("P-003")).toBe(1);
		expect(carts.findByShopper(ana().id as never)?.countItems()).toBe(2);
	});

	it("CP-COM-05 saves a single order when the confirmation is sent twice", () => {
		fillCart([[keyboard, 1]]);

		handler.execute(ana());
		expect(codeOf(() => handler.execute(ana()))).toBe("empty_order");

		expect(savedOrders()).toHaveLength(1);
		expect(stockOf("P-001")).toBe(4);
	});

	it("CP-COM-06 saves no order with an expired session", () => {
		fillCart([[keyboard, 1]]);
		const token = auth.startSession(ana());
		auth.clock.set(new Date(auth.clock.now().getTime() + 30 * 60 * 1000));

		expect(codeOf(() => auth.plugin.authenticate(`Bearer ${token}`))).toBe("session_required");

		expect(orders.add).not.toHaveBeenCalled();
	});

	it("CP-COM-07 keeps the total consistent between the summary and the saved order", () => {
		fillCart([[mouse, 3], [keyboard, 1]]);

		const summary = handler.execute(ana());

		expect(summary.total).toBe(72500);
		expect(summary.lines.map((line) => line.subtotal)).toEqual([37500, 35000]);
		expect(savedOrders()[0]!.computeTotal()).toBe(72500);
	});
});
