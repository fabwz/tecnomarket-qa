import { ok, type Result } from "@core/kernel/response";
import type { ProductStore } from "./contracts";
import type { ProductView } from "./entity";
import { toView } from "./rules";

export class ListProducts {
	constructor(private readonly products: ProductStore) {}

	execute(): Result<readonly ProductView[], never> {
		return ok(this.products.list().map(toView));
	}
}
