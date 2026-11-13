import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { authPlugin } from "@infra/plugins/auth.plugin";
import { viewProduct } from "./handler";
import { viewProductParams } from "./schema";

export const viewProductRoute = (dock: Container) =>
	new Elysia()
		.use(authPlugin(dock))
		.get("/products/:id", ({ params }) => viewProduct(dock, params), { auth: true, params: viewProductParams });
