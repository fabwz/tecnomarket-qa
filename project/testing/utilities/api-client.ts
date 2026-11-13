import type { LoginUserHandler } from "@app/account-access/login-user/login-user.handler";
import type { LoginUserBody } from "@app/account-access/login-user/login-user.schema";
import type { RegisterUserHandler } from "@app/account-access/register-user/register-user.handler";
import type { ListOrdersHandler } from "@app/order-checkout/list-orders/list-orders.handler";
import type { PlaceOrderHandler } from "@app/order-checkout/place-order/place-order.handler";
import type { ListProductsHandler } from "@app/product-catalog/list-products/list-products.handler";
import type { ViewProductHandler } from "@app/product-catalog/view-product/view-product.handler";
import type { AddCartItemHandler } from "@app/shopping-cart/add-cart-item/add-cart-item.handler";
import type { ViewCartHandler } from "@app/shopping-cart/view-cart/view-cart.handler";

export type Json<T> = T extends Date
	? string
	: T extends string
		? string
		: T extends number
			? number
			: T extends boolean
				? boolean
				: T extends readonly (infer Item)[]
					? Json<Item>[]
					: T extends object
						? { [Key in keyof T]: Json<T[Key]> }
						: T;

export type ApiFailure = { readonly code: string; readonly message: string; readonly details: unknown };

export type ApiResponse<Output> =
	| { readonly ok: true; readonly status: number; readonly body: Json<Output> }
	| { readonly ok: false; readonly status: number; readonly body: ApiFailure };

type Payload = Readonly<Record<string, unknown>>;
type Served = { handle(request: Request): Response | Promise<Response> };
type Output<Handler extends { execute(...args: never[]): unknown }> = ReturnType<Handler["execute"]>;

export class ApiClient {
	constructor(private readonly app: Served) {}

	register(body: Payload) {
		return this.send<Output<RegisterUserHandler>>("POST", "/auth/register", { body });
	}

	login(body: LoginUserBody | Payload) {
		return this.send<Output<LoginUserHandler>>("POST", "/auth/login", { body });
	}

	products(token?: string) {
		return this.send<Output<ListProductsHandler>>("GET", "/products", { token });
	}

	product(id: string, token?: string) {
		return this.send<Output<ViewProductHandler>>("GET", `/products/${id}`, { token });
	}

	cart(token?: string) {
		return this.send<Output<ViewCartHandler>>("GET", "/cart", { token });
	}

	addItem(body: Payload, token?: string) {
		return this.send<Output<AddCartItemHandler>>("POST", "/cart/items", { token, body });
	}

	placeOrder(token?: string) {
		return this.send<Output<PlaceOrderHandler>>("POST", "/orders", { token });
	}

	orders(token?: string) {
		return this.send<Output<ListOrdersHandler>>("GET", "/orders", { token });
	}

	private async send<Result>(
		method: string,
		path: string,
		{ token, body }: { token?: string; body?: Payload },
	): Promise<ApiResponse<Result>> {
		const response = await this.app.handle(
			new Request(`http://localhost${path}`, {
				method,
				headers: {
					...(body ? { "content-type": "application/json" } : {}),
					...(token === undefined ? {} : { authorization: `Bearer ${token}` }),
				},
				body: body ? JSON.stringify(body) : undefined,
			}),
		);
		const text = await response.text();
		const parsed = text ? JSON.parse(text) : undefined;
		return response.ok
			? { ok: true, status: response.status, body: parsed }
			: { ok: false, status: response.status, body: parsed };
	}
}

export function expectOk<Result>(response: ApiResponse<Result>): Json<Result> {
	if (!response.ok) throw new Error(`Expected success, got ${response.status} ${response.body.code}`);
	return response.body;
}

export function expectFailure<Result>(response: ApiResponse<Result>): ApiFailure {
	if (response.ok) throw new Error(`Expected failure, got ${response.status}`);
	return response.body;
}
