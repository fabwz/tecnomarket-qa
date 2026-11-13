import type { Container } from "dockdi";
import { ProductRepositoryToken } from "@tokens";
import { toProductView } from "../product.view";

export const listProducts = (dock: Container) => dock.resolve(ProductRepositoryToken).list().map(toProductView);
