import type { z } from "zod";
import { exceptions, type ExceptionOf } from "./exceptions";
import { err, ok, type Result } from "./response";

export function parse<S extends z.ZodType>(
	schema: S,
	input: unknown,
): Result<z.output<S>, ExceptionOf<"validation_failed">> {
	const parsed = schema.safeParse(input);
	if (parsed.success) return ok(parsed.data);
	return err(
		exceptions.validationFailed(
			parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
		),
	);
}
