import { Elysia } from "elysia";
import type { LoginUserHandler } from "./login-user.handler";
import { loginUserBody } from "./login-user.schema";

export class LoginUserPlugin {
	constructor(private readonly handler: LoginUserHandler) {}

	plugin() {
		return new Elysia().post("/auth/login", ({ body }) => this.handler.execute(body), { body: loginUserBody });
	}
}
