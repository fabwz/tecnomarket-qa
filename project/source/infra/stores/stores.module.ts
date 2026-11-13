import type { Module } from "dockdi";
import {
	AccountRepositoryToken,
	CartRepositoryToken,
	OrderRepositoryToken,
	ProductRepositoryToken,
	SessionRepositoryToken,
} from "@tokens";
import { AccountStore } from "./account.store";
import { CartStore } from "./cart.store";
import { OrderStore } from "./order.store";
import { ProductStore } from "./product.store";
import { SessionStore } from "./session.store";

export const storesModule: Module = (c) => {
	c.bind(AccountRepositoryToken).toClass(AccountStore).inSingleton();
	c.bind(SessionRepositoryToken).toClass(SessionStore).inSingleton();
	c.bind(ProductRepositoryToken).toClass(ProductStore).inSingleton();
	c.bind(CartRepositoryToken).toClass(CartStore).inSingleton();
	c.bind(OrderRepositoryToken).toClass(OrderStore).inSingleton();
};
