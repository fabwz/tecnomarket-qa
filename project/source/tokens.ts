import { token } from "dockdi";
import type { Clock, IdGenerator } from "@core/shared-kernel";
import type { AccountRepository, PasswordHasher, SessionRepository } from "@core/account-access";
import type { ProductRepository } from "@core/product-catalog";
import type { CartRepository } from "@core/shopping-cart";
import type { OrderNumbering, OrderRepository } from "@core/order-checkout";
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

export const ClockToken = token<Clock>("Clock");
export const IdGeneratorToken = token<IdGenerator>("IdGenerator");

export const PasswordHasherToken = token<PasswordHasher>("PasswordHasher");
export const OrderNumberingToken = token<OrderNumbering>("OrderNumbering");

export const AccountRepositoryToken = token<AccountRepository>("AccountRepository");
export const SessionRepositoryToken = token<SessionRepository>("SessionRepository");
export const ProductRepositoryToken = token<ProductRepository>("ProductRepository");
export const CartRepositoryToken = token<CartRepository>("CartRepository");
export const OrderRepositoryToken = token<OrderRepository>("OrderRepository");

export const AuthPluginToken = token(AuthPlugin);
export const ExceptionsPluginToken = token(ExceptionsPlugin);

export const RegisterUserHandlerToken = token(RegisterUserHandler);
export const RegisterUserPluginToken = token(RegisterUserPlugin);
export const LoginUserHandlerToken = token(LoginUserHandler);
export const LoginUserPluginToken = token(LoginUserPlugin);
export const AccountAccessPluginToken = token(AccountAccessPlugin);

export const ListProductsHandlerToken = token(ListProductsHandler);
export const ListProductsPluginToken = token(ListProductsPlugin);
export const ViewProductHandlerToken = token(ViewProductHandler);
export const ViewProductPluginToken = token(ViewProductPlugin);
export const ProductCatalogPluginToken = token(ProductCatalogPlugin);

export const ViewCartHandlerToken = token(ViewCartHandler);
export const ViewCartPluginToken = token(ViewCartPlugin);
export const AddCartItemHandlerToken = token(AddCartItemHandler);
export const AddCartItemPluginToken = token(AddCartItemPlugin);
export const ShoppingCartPluginToken = token(ShoppingCartPlugin);

export const PlaceOrderHandlerToken = token(PlaceOrderHandler);
export const PlaceOrderPluginToken = token(PlaceOrderPlugin);
export const ListOrdersHandlerToken = token(ListOrdersHandler);
export const ListOrdersPluginToken = token(ListOrdersPlugin);
export const OrderCheckoutPluginToken = token(OrderCheckoutPlugin);

export const AppToken = token(App);
