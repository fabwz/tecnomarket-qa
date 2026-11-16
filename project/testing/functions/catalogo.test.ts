import { beforeEach, describe, expect, it } from "vitest";
import { ListProductsHandler } from "@app/product-catalog/list-products/list-products.handler";
import { ViewProductHandler } from "@app/product-catalog/view-product/view-product.handler";
import { codeOf } from "@testing/utilities/assertions";
import { createAuthWorld } from "@testing/utilities/auth-world";
import { productOf } from "@testing/utilities/factories";
import { productFixtures } from "@testing/utilities/fixtures";
import { mockProducts } from "@testing/utilities/mocks";

describe("Product catalog", () => {
	const allProducts = Object.values(productFixtures).map(productOf);
	let auth: ReturnType<typeof createAuthWorld>;
	let products: ReturnType<typeof mockProducts>;
	let list: ListProductsHandler;
	let view: ViewProductHandler;

	beforeEach(() => {
		auth = createAuthWorld();
		products = mockProducts(allProducts);
		list = new ListProductsHandler(products);
		view = new ViewProductHandler(products);
	});

	it("CP-CAT-01 lists every product with name, price and availability", () => {
		const result = list.execute();

		expect(result).toHaveLength(4);
		expect(result.map(({ id, name, price, available }) => ({ id, name, price, available }))).toEqual([
			{ id: "P-001", name: "Teclado mecánico", price: 35000, available: true },
			{ id: "P-002", name: "Mouse inalámbrico", price: 12500, available: true },
			{ id: "P-003", name: 'Monitor 24"', price: 95000, available: true },
			{ id: "P-004", name: "Cable HDMI", price: 4500, available: false },
		]);
	});

	it("CP-CAT-02 returns an empty list when there are no products", () => {
		const result = new ListProductsHandler(mockProducts()).execute();

		expect(result).toEqual([]);
	});

	it("CP-CAT-03 requires a session to list the catalog", () => {
		expect(codeOf(() => auth.plugin.authenticate(undefined))).toBe("session_required");

		expect(products.list).not.toHaveBeenCalled();
	});

	it("CP-CAT-04 marks a product without stock as unavailable", () => {
		const cable = list.execute().find((product) => product.id === "P-004");

		expect(cable).toMatchObject({ stock: 0, available: false });
		expect(productOf(productFixtures.cable).isInStock()).toBe(false);
	});

	it("CP-DET-01 shows the detail of an existing product", () => {
		const detail = view.execute({ id: "P-001" });

		expect(detail).toEqual({
			id: "P-001",
			name: "Teclado mecánico",
			description: "Teclado mecánico retroiluminado",
			price: 35000,
			stock: 5,
			available: true,
		});
		expect(products.findById).toHaveBeenCalledWith("P-001");
	});

	it("CP-DET-02 shows the detail of a sold out product flagged as unavailable", () => {
		const detail = view.execute({ id: "P-004" });

		expect(detail).toMatchObject({ id: "P-004", stock: 0, available: false });
	});

	it("CP-DET-03 reports a product that does not exist", () => {
		expect(codeOf(() => view.execute({ id: "9999" }))).toBe("product_not_found");
	});

	it("CP-DET-04 requires a session to view a product detail", () => {
		expect(codeOf(() => auth.plugin.authenticate(undefined))).toBe("session_required");

		expect(products.findById).not.toHaveBeenCalled();
	});
});
