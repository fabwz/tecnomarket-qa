import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CartRepositoryToken, OrderRepositoryToken, ProductRepositoryToken } from "@tokens";
import { BuyerId } from "@core/order-checkout";
import { ProductId } from "@core/product-catalog";
import { ShopperId } from "@core/shopping-cart";
import { expectOk } from "@testing/utilities/api-client";
import { accountFixtures, orderFixtures } from "@testing/utilities/fixtures";
import { createTestDock, type TestWorld } from "@testing/utilities/test-dock";

describe("E2E-02 Login, browse products, add products and checkout", () => {
	let world: TestWorld;

	beforeEach(() => {
		world = createTestDock();
	});

	afterEach(() => {
		world.dock.reset();
	});

	it("takes a registered user from login to a placed order", async () => {
		const { api, dock } = world;
		const { id, email, password } = accountFixtures.ana;

		const session = await api.login({ email, password });
		expect(session.status).toBe(200);
		const { token } = expectOk(session);

		const catalog = expectOk(await api.products(token));
		expect(catalog).toHaveLength(4);
		catalog.forEach((product) => {
			expect(product.name).toBeTruthy();
			expect(product.price).toBeGreaterThan(0);
			expect(typeof product.available).toBe("boolean");
		});

		expect(expectOk(await api.product("P-001", token))).toEqual({
			id: "P-001",
			name: "Teclado mecánico",
			description: "Teclado mecánico retroiluminado",
			price: 35000,
			stock: 5,
			available: true,
		});

		expectOk(await api.addItem({ productId: "P-001", quantity: 1 }, token));
		const cart = expectOk(await api.addItem({ productId: "P-002", quantity: 2 }, token));
		expect(cart).toMatchObject({ itemCount: 3, total: 60000 });

		const placed = await api.placeOrder(token);
		expect(placed.status).toBe(201);
		const summary = expectOk(placed);
		expect(summary).toMatchObject({ itemCount: 3, total: 60000 });
		expect(summary.lines).toHaveLength(2);

		const existingNumbers = Object.values(orderFixtures).map((order) => order.number);
		expect(existingNumbers).not.toContain(summary.number);

		const saved = dock.resolve(OrderRepositoryToken).listByBuyer(BuyerId.parse(id));
		expect(saved).toHaveLength(1);
		expect(saved[0]!.lines).toHaveLength(2);
		expect(saved[0]!.computeTotal()).toBe(60000);
		expect(dock.resolve(CartRepositoryToken).findByShopper(ShopperId.parse(id))?.isEmpty()).toBe(true);
		const products = dock.resolve(ProductRepositoryToken);
		expect(products.findById(ProductId.parse("P-001"))?.stock).toBe(4);
		expect(products.findById(ProductId.parse("P-002"))?.stock).toBe(8);
	});
});
