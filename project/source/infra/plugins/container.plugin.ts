import { Elysia } from "elysia";
import type { Container } from "dockdi";

export const containerPlugin = (dock: Container) => new Elysia({ name: "container" }).decorate("dock", dock);
