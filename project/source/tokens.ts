import { token } from "dockdi";
import type { Clock, IdGenerator } from "@core/kernel/contracts";
import type { PasswordHasher, SessionStore, UserStore } from "@core/users/contracts";
import type { ProductStore } from "@core/catalog/contracts";
import type { CartStore } from "@core/carts/contracts";
import type { OrderNumberGenerator, OrderStore } from "@core/orders/contracts";
import { RegisterUser } from "@core/users/register-user";
import { LoginUser } from "@core/users/login-user";
import { ResolveSession } from "@core/users/resolve-session";
import { ListProducts } from "@core/catalog/list-products";
import { ViewProduct } from "@core/catalog/view-product";
import { AddCartItem } from "@core/carts/add-cart-item";
import { ViewCart } from "@core/carts/view-cart";
import { PlaceOrder } from "@core/orders/place-order";
import { ListOrders } from "@core/orders/list-orders";

export const ClockToken = token<Clock>("Clock");
export const IdGeneratorToken = token<IdGenerator>("IdGenerator");

export const PasswordHasherToken = token<PasswordHasher>("PasswordHasher");
export const UserStoreToken = token<UserStore>("UserStore");
export const SessionStoreToken = token<SessionStore>("SessionStore");
export const ProductStoreToken = token<ProductStore>("ProductStore");
export const CartStoreToken = token<CartStore>("CartStore");
export const OrderStoreToken = token<OrderStore>("OrderStore");
export const OrderNumberGeneratorToken = token<OrderNumberGenerator>("OrderNumberGenerator");

export const RegisterUserToken = token(RegisterUser);
export const LoginUserToken = token(LoginUser);
export const ResolveSessionToken = token(ResolveSession);
export const ListProductsToken = token(ListProducts);
export const ViewProductToken = token(ViewProduct);
export const AddCartItemToken = token(AddCartItem);
export const ViewCartToken = token(ViewCart);
export const PlaceOrderToken = token(PlaceOrder);
export const ListOrdersToken = token(ListOrders);
