import { Elysia } from "elysia";
import { AccountError, SessionError } from "@core/account-access";
import { ProductError } from "@core/product-catalog";
import { CartError } from "@core/shopping-cart";
import { OrderError } from "@core/order-checkout";
import { DomainError } from "@core/shared-kernel";

type KnownError = AccountError | SessionError | ProductError | CartError | OrderError;
type KnownCode = KnownError["code"];
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

const statusOf = (code: KnownCode): number => (isValueFailure(code) ? 400 : specificStatuses[code]);

const isKnown = (error: DomainError): error is KnownError =>
	AccountError.is(error) || SessionError.is(error) || ProductError.is(error) || CartError.is(error) || OrderError.is(error);

export const exceptionsPlugin = new Elysia({ name: "exceptions" }).onError({ as: "global" }, ({ error, code, set }) => {
	if (error instanceof DomainError && isKnown(error)) {
		set.status = statusOf(error.code);
		return { code: error.code, message: error.message, details: error.details };
	}
	if (code === "VALIDATION") {
		set.status = 400;
		return {
			code: "validation_failed",
			message: "The submitted data is not valid.",
			details: { issues: error.all.map((issue) => ({ path: issue.path, message: issue.message })) },
		};
	}
});
