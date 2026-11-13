import { DomainError } from "@core/shared-kernel";

export const AccountError = DomainError.define("account", {
	invalid_account_id: "The account id is not valid.",
	invalid_full_name: "The full name is not valid.",
	invalid_email: "The email is not valid.",
	invalid_phone: "The phone is not valid.",
	invalid_password: "The password does not meet the requirements.",
	invalid_password_hash: "The password hash is not valid.",
	email_taken: "The email is already registered.",
	account_not_found: "No account exists for that email.",
	invalid_credentials: "The credentials are not valid.",
});

export type AccountError = ReturnType<typeof AccountError.of>;
