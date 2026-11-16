import { beforeEach, describe, expect, it } from "vitest";
import { AddCartItemHandler } from "@app/shopping-cart/add-cart-item/add-cart-item.handler";
import { addCartItemBody } from "@app/shopping-cart/add-cart-item/add-cart-item.schema";
import { ViewCartHandler } from "@app/shopping-cart/view-cart/view-cart.handler";
import { codeOf } from "@testing/utilities/assertions";
import { createAuthWorld } from "@testing/utilities/auth-world";
import { productOf } from "@testing/utilities/factories";
import { productFixtures } from "@testing/utilities/fixtures";
import { mockCarts, mockProducts } from "@testing/utilities/mocks";

describe("Shopping cart", () => {
	let auth: ReturnType<typeof createAuthWorld>;
	let carts: ReturnType<typeof mockCarts>;
	let add: AddCartItemHandler;
	let view: ViewCartHandler;

	beforeEach(() => {
		auth = createAuthWorld();
		carts = mockCarts();
		add = new AddCartItemHandler(mockProducts(Object.values(productFixtures).map(productOf)), carts);
		view = new ViewCartHandler(carts);
	});

	const ana = () => auth.people.ana;
	const addItem = (productId: string, quantity: number) => add.execute(ana(), { productId, quantity });

	it("CP-CAR-01 adds the minimum quantity of 1", () => {
		const cart = addItem("P-001", 1);

		expect(cart.itemCount).toBe(1);
		expect(cart.total).toBe(35000);
		expect(carts.add).toHaveBeenCalledOnce();
	});

	it("CP-CAR-02 accumulates the same product in a single line", () => {
		addItem("P-001", 1);
		const cart = addItem("P-001", 1);

		expect(cart.lines).toHaveLength(1);
		expect(cart.lines[0]).toMatchObject({ productId: "P-001", quantity: 2, subtotal: 70000 });
		expect(cart.total).toBe(70000);
	});

	it("CP-CAR-03 adds two different products", () => {
		addItem("P-001", 1);
		const cart = addItem("P-002", 2);

		expect(cart.lines).toHaveLength(2);
		expect(cart.itemCount).toBe(3);
		expect(cart.total).toBe(60000);
	});

	it.each([
		["CP-CAR-04 zero", 0],
		["CP-CAR-05 negative", -1],
	])("%s quantity is rejected and the cart does not change", (_name, quantity) => {
		expect(codeOf(() => addItem("P-001", quantity))).toBe("invalid_item_quantity");

		expect(carts.add).not.toHaveBeenCalled();
	});

	it("CP-CAR-06 accepts a quantity equal to the stock", () => {
		const cart = addItem("P-001", 5);

		expect(cart.itemCount).toBe(5);
		expect(cart.total).toBe(175000);
	});

	it("CP-CAR-07 rejects a quantity one above the stock", () => {
		expect(codeOf(() => addItem("P-001", 6))).toBe("quantity_exceeds_stock");

		expect(carts.add).not.toHaveBeenCalled();
	});

	it("CP-CAR-08 rejects an accumulated quantity above the stock", () => {
		addItem("P-001", 3);

		expect(codeOf(() => addItem("P-001", 3))).toBe("quantity_exceeds_stock");

		expect(carts.add).toHaveBeenCalledOnce();
		expect(view.execute(ana()).lines[0]).toMatchObject({ quantity: 3 });
	});

	it("CP-CAR-09 rejects a non numeric or decimal quantity", () => {
		expect(addCartItemBody.safeParse({ productId: "P-001", quantity: "abc" }).success).toBe(false);
		expect(codeOf(() => addItem("P-001", "abc" as unknown as number))).toBe("invalid_item_quantity");
		expect(codeOf(() => addItem("P-001", 1.5))).toBe("invalid_item_quantity");

		expect(carts.add).not.toHaveBeenCalled();
	});

	it("CP-CAR-10 rejects a product without stock", () => {
		expect(codeOf(() => addItem("P-004", 1))).toBe("product_out_of_stock");

		expect(carts.add).not.toHaveBeenCalled();
	});

	it("CP-CAR-11 does not modify any cart with an expired session", () => {
		const token = auth.startSession(ana());
		auth.clock.set(new Date(auth.clock.now().getTime() + 30 * 60 * 1000));

		expect(codeOf(() => auth.plugin.authenticate(`Bearer ${token}`))).toBe("session_required");

		expect(carts.add).not.toHaveBeenCalled();
	});

	it("CP-REV-01 lists the lines with subtotals that add up to the total", () => {
		addItem("P-001", 1);
		addItem("P-002", 2);

		const cart = view.execute(ana());

		expect(cart.lines.map((line) => line.subtotal)).toEqual([35000, 25000]);
		expect(cart.lines.reduce((sum, line) => sum + line.subtotal, 0)).toBe(cart.total);
		expect(cart.total).toBe(60000);
	});

	it("CP-REV-02 shows an empty cart for a user without products", () => {
		expect(view.execute(auth.people.luis)).toEqual({ lines: [], itemCount: 0, total: 0 });
	});

	it("CP-REV-03 requires a session to open the cart", () => {
		expect(codeOf(() => auth.plugin.authenticate(undefined))).toBe("session_required");

		expect(carts.findByShopper).not.toHaveBeenCalled();
	});
});
