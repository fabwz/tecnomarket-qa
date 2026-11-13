import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { loginUserRoute } from "./login-user/route";
import { registerUserRoute } from "./register-user/route";

export const accountAccessRoutes = (dock: Container) =>
	new Elysia().use(registerUserRoute(dock)).use(loginUserRoute(dock));
