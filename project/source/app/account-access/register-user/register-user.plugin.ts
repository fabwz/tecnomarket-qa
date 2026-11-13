import { Elysia } from "elysia";
import type { RegisterUserHandler } from "./register-user.handler";
import { registerUserBody } from "./register-user.schema";

export class RegisterUserPlugin {
	constructor(private readonly handler: RegisterUserHandler) {}

	plugin() {
		return new Elysia().post("/auth/register", ({ body, status }) => status(201, this.handler.execute(body)), {
			body: registerUserBody,
		});
	}
}
