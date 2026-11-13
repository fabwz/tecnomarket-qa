import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { registerUser } from "./handler";
import { registerUserBody } from "./schema";

export const registerUserRoute = (dock: Container) =>
	new Elysia().post("/auth/register", ({ body, status }) => status(201, registerUser(dock, body)), {
		body: registerUserBody,
	});
