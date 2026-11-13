import type { KnownCode } from "./known.errors";

type ValueFailure = Exclude<Extract<KnownCode, `invalid_${string}`>, "invalid_credentials" | "invalid_session_token">;
type Specific = Exclude<KnownCode, ValueFailure>;

const specificStatuses = {
	email_taken: 409,
	account_not_found: 404,
	invalid_credentials: 401,
	invalid_session_token: 401,
	session_required: 401,
	product_not_found: 404,
	product_out_of_stock: 409,
	insufficient_stock: 409,
	quantity_exceeds_stock: 409,
	empty_order: 422,
} as const satisfies Record<Specific, number>;

const isValueFailure = (code: KnownCode): code is ValueFailure => !(code in specificStatuses);

export const statusOf = (code: KnownCode): number => (isValueFailure(code) ? 400 : specificStatuses[code]);
