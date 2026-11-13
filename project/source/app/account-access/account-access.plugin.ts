import { token } from "dockdi";
import { Elysia } from "elysia";
import type { LoginUserPlugin } from "./login-user/login-user.plugin";
import type { RegisterUserPlugin } from "./register-user/register-user.plugin";

export class AccountAccessPlugin {
	constructor(
		private readonly registerUser: RegisterUserPlugin,
		private readonly loginUser: LoginUserPlugin,
	) {}

	plugin() {
		return new Elysia().use(this.registerUser.plugin()).use(this.loginUser.plugin());
	}
}

export const AccountAccessPluginToken = token(AccountAccessPlugin);
