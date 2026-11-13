import type { Module } from "dockdi";
import { AccountRepositoryToken, ClockToken, IdGeneratorToken, PasswordHasherToken, SessionRepositoryToken } from "@tokens";
import { RegisterUserHandler, RegisterUserHandlerToken } from "./register-user/register-user.handler";
import { RegisterUserPlugin, RegisterUserPluginToken } from "./register-user/register-user.plugin";
import { LoginUserHandler, LoginUserHandlerToken } from "./login-user/login-user.handler";
import { LoginUserPlugin, LoginUserPluginToken } from "./login-user/login-user.plugin";
import { AccountAccessPlugin, AccountAccessPluginToken } from "./account-access.plugin";

export const accountAccessModule: Module = (c) => {
	c.bind(RegisterUserHandlerToken).toClass(RegisterUserHandler, [AccountRepositoryToken, PasswordHasherToken, IdGeneratorToken, ClockToken]).inSingleton();
	c.bind(RegisterUserPluginToken).toClass(RegisterUserPlugin, [RegisterUserHandlerToken]).inSingleton();
	c.bind(LoginUserHandlerToken).toClass(LoginUserHandler, [AccountRepositoryToken, SessionRepositoryToken, PasswordHasherToken, IdGeneratorToken, ClockToken]).inSingleton();
	c.bind(LoginUserPluginToken).toClass(LoginUserPlugin, [LoginUserHandlerToken]).inSingleton();
	c.bind(AccountAccessPluginToken)
		.toClass(AccountAccessPlugin, [RegisterUserPluginToken, LoginUserPluginToken])
		.inSingleton();
};
