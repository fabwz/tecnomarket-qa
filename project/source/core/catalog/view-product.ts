import { exceptions, type Exception } from "@core/kernel/exceptions";
import { err, ok, type Result } from "@core/kernel/response";
import type { ProductStore } from "./contracts";
import type { ProductView } from "./entity";
import { toView } from "./rules";

export class ViewProduct {
	constructor(private readonly products: ProductStore) {}

	execute(id: string): Result<ProductView, Exception> {
		const product = this.products.findById(id);
		if (!product) return err(exceptions.productNotFound());
		return ok(toView(product));
	}
}
