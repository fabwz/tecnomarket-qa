import { token } from "dockdi";
import type { Clock, IdGenerator } from "@core/shared-kernel";
import type { AccountRepository, PasswordHasher, SessionRepository } from "@core/account-access";
import type { ProductRepository } from "@core/product-catalog";
import type { CartRepository } from "@core/shopping-cart";
import type { OrderNumbering, OrderRepository } from "@core/order-checkout";

export const ClockToken = token<Clock>("Clock");
export const IdGeneratorToken = token<IdGenerator>("IdGenerator");

export const PasswordHasherToken = token<PasswordHasher>("PasswordHasher");
export const OrderNumberingToken = token<OrderNumbering>("OrderNumbering");

export const AccountRepositoryToken = token<AccountRepository>("AccountRepository");
export const SessionRepositoryToken = token<SessionRepository>("SessionRepository");
export const ProductRepositoryToken = token<ProductRepository>("ProductRepository");
export const CartRepositoryToken = token<CartRepository>("CartRepository");
export const OrderRepositoryToken = token<OrderRepository>("OrderRepository");
