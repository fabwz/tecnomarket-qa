import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
	AccountRepositoryToken,
	CartRepositoryToken,
	OrderRepositoryToken,
	ProductRepositoryToken,
} from "@tokens";
import { EmailAddress } from "@core/account-access";
import { BuyerId } from "@core/order-checkout";
import { ProductId } from "@core/product-catalog";
import { ShopperId } from "@core/shopping-cart";
import { expectOk } from "@testing/utilities/api-client";
import { registrationInput } from "@testing/utilities/factories";
import { createTestDock, type TestWorld } from "@testing/utilities/test-dock";

describe("E2E-01 Registration, login, add to cart and checkout", () => {
	let world: TestWorld;

	beforeEach(() => {
		world = createTestDock();
	});

	afterEach(() => {
		world.dock.reset();
	});

	it("takes a new user from registration to a placed order", async () => {
		const { api, dock } = world;
		const input = registrationInput();

		const registered = await api.register(input);
		expect(registered.status).toBe(201);
		expect(expectOk(registered)).toMatchObject({ email: input.email, fullName: input.fullName });
		expect(JSON.stringify(registered.body)).not.toContain(input.password);
		const account = dock.resolve(AccountRepositoryToken).findByEmail(EmailAddress.parse(input.email));
		expect(account).toBeDefined();
		expect(account!.passwordHash).not.toContain(input.password);

		const session = await api.login({ email: input.email, password: input.password });
		expect(session.status).toBe(200);
		const { token, account: loggedIn } = expectOk(session);
		expect(token).toBeTruthy();
		expect(loggedIn.id).toBe(account!.id);

		const added = await api.addItem({ productId: "P-001", quantity: 1 }, token);
		expect(added.status).toBe(200);
		expect(expectOk(added)).toMatchObject({ itemCount: 1, total: 35000 });

		const cart = expectOk(await api.cart(token));
		expect(cart.lines).toHaveLength(1);
		expect(cart.lines[0]).toMatchObject({ productId: "P-001", quantity: 1, subtotal: 35000 });

		const placed = await api.placeOrder(token);
		expect(placed.status).toBe(201);
		const summary = expectOk(placed);
		expect(summary.number).toMatch(/^PED-\d{8}-\d{4}$/);
		expect(summary).toMatchObject({ itemCount: 1, total: 35000 });
		expect(summary.lines).toHaveLength(1);

		const saved = dock.resolve(OrderRepositoryToken).listByBuyer(BuyerId.parse(account!.id));
		expect(saved).toHaveLength(1);
		expect(saved[0]!.number).toBe(summary.number);
		expect(dock.resolve(CartRepositoryToken).findByShopper(ShopperId.parse(account!.id))?.isEmpty()).toBe(true);
		expect(dock.resolve(ProductRepositoryToken).findById(ProductId.parse("P-001"))?.stock).toBe(4);
	});
});
