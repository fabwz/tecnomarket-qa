import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { loginUser } from "./handler";
import { loginUserBody } from "./schema";

export const loginUserRoute = (dock: Container) =>
	new Elysia().post("/auth/login", ({ body }) => loginUser(dock, body), { body: loginUserBody });
