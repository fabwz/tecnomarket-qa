import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { listProductsRoute } from "./list-products/route";
import { viewProductRoute } from "./view-product/route";

export const productCatalogRoutes = (dock: Container) =>
	new Elysia().use(listProductsRoute(dock)).use(viewProductRoute(dock));
