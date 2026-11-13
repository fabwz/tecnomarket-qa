import type { ValidationError } from "elysia";
import type { KnownError } from "./known.errors";
import { statusOf } from "./status.errors";

export type Reply = {
	readonly status: number;
	readonly body: { readonly code: string; readonly message: string; readonly details: unknown };
};

export const replyToDomain = (error: KnownError): Reply => ({
	status: statusOf(error.code),
	body: { code: error.code, message: error.message, details: error.details },
});

export const replyToValidation = (error: Readonly<ValidationError>): Reply => ({
	status: 400,
	body: {
		code: "validation_failed",
		message: "The submitted data is not valid.",
		details: { issues: error.all.map((issue) => ({ path: issue.path, message: issue.message })) },
	},
});
