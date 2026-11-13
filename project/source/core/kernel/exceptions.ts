export type Issue = { readonly path: string; readonly message: string };
type Base<C extends string> = { readonly code: C; readonly message: string };

export type Exception =
	| (Base<"validation_failed"> & { readonly issues: readonly Issue[] })
	| Base<"email_taken">
	| Base<"invalid_credentials">
	| Base<"account_not_found">
	| Base<"session_required">
	| Base<"product_not_found">
	| Base<"product_out_of_stock">
	| (Base<"insufficient_stock"> & { readonly available: number })
	| Base<"cart_empty">;

export type ExceptionCode = Exception["code"];
export type ExceptionOf<C extends ExceptionCode> = Extract<Exception, { code: C }>;

export const exceptions = {
	validationFailed: (issues: readonly Issue[]): ExceptionOf<"validation_failed"> => ({
		code: "validation_failed",
		message: "The submitted data is not valid.",
		issues,
	}),
	emailTaken: (): ExceptionOf<"email_taken"> => ({
		code: "email_taken",
		message: "The email is already registered.",
	}),
	invalidCredentials: (): ExceptionOf<"invalid_credentials"> => ({
		code: "invalid_credentials",
		message: "The password is incorrect.",
	}),
	accountNotFound: (): ExceptionOf<"account_not_found"> => ({
		code: "account_not_found",
		message: "No account exists for that email.",
	}),
	sessionRequired: (): ExceptionOf<"session_required"> => ({
		code: "session_required",
		message: "An active session is required.",
	}),
	productNotFound: (): ExceptionOf<"product_not_found"> => ({
		code: "product_not_found",
		message: "The product does not exist.",
	}),
	productOutOfStock: (): ExceptionOf<"product_out_of_stock"> => ({
		code: "product_out_of_stock",
		message: "The product is out of stock.",
	}),
	insufficientStock: (available: number): ExceptionOf<"insufficient_stock"> => ({
		code: "insufficient_stock",
		message: `Insufficient stock: ${available} available.`,
		available,
	}),
	cartEmpty: (): ExceptionOf<"cart_empty"> => ({
		code: "cart_empty",
		message: "The cart is empty.",
	}),
} as const;
