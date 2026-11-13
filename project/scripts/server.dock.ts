import { Container, type Module } from "dockdi";
import {
	AccountAccessPluginToken,
	AccountRepositoryToken,
	AddCartItemHandlerToken,
	AddCartItemPluginToken,
	AppToken,
	AuthPluginToken,
	CartRepositoryToken,
	ClockToken,
	ExceptionsPluginToken,
	IdGeneratorToken,
	ListOrdersHandlerToken,
	ListOrdersPluginToken,
	ListProductsHandlerToken,
	ListProductsPluginToken,
	LoginUserHandlerToken,
	LoginUserPluginToken,
	OrderCheckoutPluginToken,
	OrderNumberingToken,
	OrderRepositoryToken,
	PasswordHasherToken,
	PlaceOrderHandlerToken,
	PlaceOrderPluginToken,
	ProductCatalogPluginToken,
	ProductRepositoryToken,
	RegisterUserHandlerToken,
	RegisterUserPluginToken,
	SessionRepositoryToken,
	ShoppingCartPluginToken,
	ViewCartHandlerToken,
	ViewCartPluginToken,
	ViewProductHandlerToken,
	ViewProductPluginToken,
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
import { AuthPlugin } from "@infra/plugins/auth.plugin";
import { ExceptionsPlugin } from "@infra/plugins/exceptions.plugin";
import { App } from "@app/app";
import { AccountAccessPlugin } from "@app/account-access/account-access.plugin";
import { RegisterUserHandler } from "@app/account-access/register-user/register-user.handler";
import { RegisterUserPlugin } from "@app/account-access/register-user/register-user.plugin";
import { LoginUserHandler } from "@app/account-access/login-user/login-user.handler";
import { LoginUserPlugin } from "@app/account-access/login-user/login-user.plugin";
import { ProductCatalogPlugin } from "@app/product-catalog/product-catalog.plugin";
import { ListProductsHandler } from "@app/product-catalog/list-products/list-products.handler";
import { ListProductsPlugin } from "@app/product-catalog/list-products/list-products.plugin";
import { ViewProductHandler } from "@app/product-catalog/view-product/view-product.handler";
import { ViewProductPlugin } from "@app/product-catalog/view-product/view-product.plugin";
import { ShoppingCartPlugin } from "@app/shopping-cart/shopping-cart.plugin";
import { ViewCartHandler } from "@app/shopping-cart/view-cart/view-cart.handler";
import { ViewCartPlugin } from "@app/shopping-cart/view-cart/view-cart.plugin";
import { AddCartItemHandler } from "@app/shopping-cart/add-cart-item/add-cart-item.handler";
import { AddCartItemPlugin } from "@app/shopping-cart/add-cart-item/add-cart-item.plugin";
import { OrderCheckoutPlugin } from "@app/order-checkout/order-checkout.plugin";
import { PlaceOrderHandler } from "@app/order-checkout/place-order/place-order.handler";
import { PlaceOrderPlugin } from "@app/order-checkout/place-order/place-order.plugin";
import { ListOrdersHandler } from "@app/order-checkout/list-orders/list-orders.handler";
import { ListOrdersPlugin } from "@app/order-checkout/list-orders/list-orders.plugin";

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

const appModule: Module = (c) => {
	c.bind(AuthPluginToken).toClass(AuthPlugin, [SessionRepositoryToken, AccountRepositoryToken, ClockToken]).inSingleton();
	c.bind(ExceptionsPluginToken).toClass(ExceptionsPlugin).inSingleton();
	c.bind(RegisterUserHandlerToken).toClass(RegisterUserHandler, [AccountRepositoryToken, PasswordHasherToken, IdGeneratorToken, ClockToken]).inSingleton();
	c.bind(RegisterUserPluginToken).toClass(RegisterUserPlugin, [RegisterUserHandlerToken]).inSingleton();
	c.bind(LoginUserHandlerToken).toClass(LoginUserHandler, [AccountRepositoryToken, SessionRepositoryToken, PasswordHasherToken, IdGeneratorToken, ClockToken]).inSingleton();
	c.bind(LoginUserPluginToken).toClass(LoginUserPlugin, [LoginUserHandlerToken]).inSingleton();
	c.bind(AccountAccessPluginToken).toClass(AccountAccessPlugin, [RegisterUserPluginToken, LoginUserPluginToken]).inSingleton();
	c.bind(ListProductsHandlerToken).toClass(ListProductsHandler, [ProductRepositoryToken]).inSingleton();
	c.bind(ListProductsPluginToken).toClass(ListProductsPlugin, [ListProductsHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(ViewProductHandlerToken).toClass(ViewProductHandler, [ProductRepositoryToken]).inSingleton();
	c.bind(ViewProductPluginToken).toClass(ViewProductPlugin, [ViewProductHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(ProductCatalogPluginToken).toClass(ProductCatalogPlugin, [ListProductsPluginToken, ViewProductPluginToken]).inSingleton();
	c.bind(ViewCartHandlerToken).toClass(ViewCartHandler, [CartRepositoryToken]).inSingleton();
	c.bind(ViewCartPluginToken).toClass(ViewCartPlugin, [ViewCartHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(AddCartItemHandlerToken).toClass(AddCartItemHandler, [ProductRepositoryToken, CartRepositoryToken]).inSingleton();
	c.bind(AddCartItemPluginToken).toClass(AddCartItemPlugin, [AddCartItemHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(ShoppingCartPluginToken).toClass(ShoppingCartPlugin, [ViewCartPluginToken, AddCartItemPluginToken]).inSingleton();
	c.bind(PlaceOrderHandlerToken).toClass(PlaceOrderHandler, [ProductRepositoryToken, CartRepositoryToken, OrderRepositoryToken, OrderNumberingToken, IdGeneratorToken, ClockToken]).inSingleton();
	c.bind(PlaceOrderPluginToken).toClass(PlaceOrderPlugin, [PlaceOrderHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(ListOrdersHandlerToken).toClass(ListOrdersHandler, [OrderRepositoryToken]).inSingleton();
	c.bind(ListOrdersPluginToken).toClass(ListOrdersPlugin, [ListOrdersHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(OrderCheckoutPluginToken).toClass(OrderCheckoutPlugin, [PlaceOrderPluginToken, ListOrdersPluginToken]).inSingleton();
	c.bind(AppToken).toClass(App, [ExceptionsPluginToken, AccountAccessPluginToken, ProductCatalogPluginToken, ShoppingCartPluginToken, OrderCheckoutPluginToken]).inSingleton();
};

export function createDock(overrides?: Module): Container {
	const dock = new Container().load(sharedModule, storesModule, appModule).scope();
	overrides?.(dock);
	return dock;
}
