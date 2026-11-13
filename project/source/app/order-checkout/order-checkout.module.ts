import type { Module } from "dockdi";
import { AuthPluginToken } from "@infra/plugins/auth.plugin";
import { CartRepositoryToken, ClockToken, IdGeneratorToken, OrderNumberingToken, OrderRepositoryToken, ProductRepositoryToken } from "@tokens";
import { PlaceOrderHandler, PlaceOrderHandlerToken } from "./place-order/place-order.handler";
import { PlaceOrderPlugin, PlaceOrderPluginToken } from "./place-order/place-order.plugin";
import { ListOrdersHandler, ListOrdersHandlerToken } from "./list-orders/list-orders.handler";
import { ListOrdersPlugin, ListOrdersPluginToken } from "./list-orders/list-orders.plugin";
import { OrderCheckoutPlugin, OrderCheckoutPluginToken } from "./order-checkout.plugin";

export const orderCheckoutModule: Module = (c) => {
	c.bind(PlaceOrderHandlerToken).toClass(PlaceOrderHandler, [ProductRepositoryToken, CartRepositoryToken, OrderRepositoryToken, OrderNumberingToken, IdGeneratorToken, ClockToken]).inSingleton();
	c.bind(PlaceOrderPluginToken).toClass(PlaceOrderPlugin, [PlaceOrderHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(ListOrdersHandlerToken).toClass(ListOrdersHandler, [OrderRepositoryToken]).inSingleton();
	c.bind(ListOrdersPluginToken).toClass(ListOrdersPlugin, [ListOrdersHandlerToken, AuthPluginToken]).inSingleton();
	c.bind(OrderCheckoutPluginToken)
		.toClass(OrderCheckoutPlugin, [PlaceOrderPluginToken, ListOrdersPluginToken])
		.inSingleton();
};
