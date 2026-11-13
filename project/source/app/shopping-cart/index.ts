import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { addCartItemRoute } from "./add-cart-item/route";
import { viewCartRoute } from "./view-cart/route";

export const shoppingCartRoutes = (dock: Container) =>
	new Elysia().use(viewCartRoute(dock)).use(addCartItemRoute(dock));
