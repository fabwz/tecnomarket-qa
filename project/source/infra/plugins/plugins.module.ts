import type { Module } from "dockdi";
import { AccountRepositoryToken, ClockToken, SessionRepositoryToken } from "@tokens";
import { AuthPlugin, AuthPluginToken } from "./auth.plugin";
import { ExceptionsPlugin, ExceptionsPluginToken } from "./exceptions.plugin";

export const pluginsModule: Module = (c) => {
	c.bind(AuthPluginToken)
		.toClass(AuthPlugin, [SessionRepositoryToken, AccountRepositoryToken, ClockToken])
		.inSingleton();
	c.bind(ExceptionsPluginToken).toClass(ExceptionsPlugin).inSingleton();
};
