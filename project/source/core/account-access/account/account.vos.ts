import { identifier, text, type Distinct, type ValueObject } from "@core/shared-kernel";
import { AccountError } from "./account.errors";

export const AccountId = identifier("account_id", (details) => AccountError.of("invalid_account_id", details));
export type AccountId = ReturnType<typeof AccountId.parse>;

export const FullName = text("full_name", { min: 3, max: 100 }, (details) =>
	AccountError.of("invalid_full_name", details),
);
export type FullName = ReturnType<typeof FullName.parse>;

export const EmailAddress = text(
	"email_address",
	{ max: 254, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, normalize: (value) => value.toLowerCase() },
	(details) => AccountError.of("invalid_email", details),
);
export type EmailAddress = ReturnType<typeof EmailAddress.parse>;

export const PhoneNumber = text("phone_number", { pattern: /^\d{8}$/ }, (details) =>
	AccountError.of("invalid_phone", details),
);
export type PhoneNumber = ReturnType<typeof PhoneNumber.parse>;

export const PasswordHash = text("password_hash", { min: 1, max: 255 }, (details) =>
	AccountError.of("invalid_password_hash", details),
);
export type PasswordHash = ReturnType<typeof PasswordHash.parse>;

const passwordRequirements = [
	["lowercase", /[a-z]/],
	["uppercase", /[A-Z]/],
	["number", /\d/],
	["special", /[^A-Za-z0-9\s]/],
] as const;

const missingRequirements = (raw: string) =>
	passwordRequirements.filter(([, pattern]) => !pattern.test(raw)).map(([name]) => name);

const isStrongLength = (raw: string) => raw.length >= 8 && raw.length <= 64;

export const PlainPassword: ValueObject<string, "plain_password"> = {
	kind: "plain_password",
	parse(raw) {
		const missing = missingRequirements(raw);
		if (!isStrongLength(raw) || missing.length > 0) {
			throw AccountError.of("invalid_password", { min: 8, max: 64, missing });
		}
		return raw as Distinct<string, "plain_password">;
	},
	is(value): value is Distinct<string, "plain_password"> {
		return typeof value === "string" && isStrongLength(value) && missingRequirements(value).length === 0;
	},
};
export type PlainPassword = ReturnType<typeof PlainPassword.parse>;
