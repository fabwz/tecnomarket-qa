import type { Module } from "dockdi";
import { AuthPluginToken } from "@infra/plugins/auth.plugin";
import { CartRepositoryToken, ProductRepositoryToken } from "@tokens";
import { ViewCartHandler, ViewCartHandlerToken } from "./view-cart/view-cart.handler";
import { ViewCartPlugin, ViewCartPluginToken } from "./view-cart/view-cart.plugin";
import { AddCartItemHandler, AddCartItemHandlerToken } from "./add-cart-item/add-cart-item.handler";
import { AddCartItemPlugin, AddCartItemPluginToken } from "./add-cart-item/add-cart-item.plugin";
import { ShoppingCartPlugin, ShoppingCartPluginToken } from "./shopping-cart.plugin";

export const shoppingCartModule: Module = (c) => {
	c.bind(ViewCartHandlerToken).toClass(ViewCartHandler, [CartRepositoryToken]).inSingleton();
	c.bind(ViewCartPluginToken).toClass(ViewCartPlugin, [ViewCartHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(AddCartItemHandlerToken).toClass(AddCartItemHandler, [ProductRepositoryToken, CartRepositoryToken]).inSingleton();
	c.bind(AddCartItemPluginToken).toClass(AddCartItemPlugin, [AddCartItemHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(ShoppingCartPluginToken)
		.toClass(ShoppingCartPlugin, [ViewCartPluginToken, AddCartItemPluginToken])
		.inSingleton();
};
