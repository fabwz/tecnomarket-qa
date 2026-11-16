import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUserHandler } from "@app/account-access/register-user/register-user.handler";
import { failureOf } from "@testing/utilities/assertions";
import { registrationInput } from "@testing/utilities/factories";
import { mockAccounts, mockClock, mockHasher, mockIds } from "@testing/utilities/mocks";

describe("Password validation", () => {
	let accounts: ReturnType<typeof mockAccounts>;
	let handler: RegisterUserHandler;

	beforeEach(() => {
		accounts = mockAccounts();
		handler = new RegisterUserHandler(accounts, mockHasher(), mockIds(), mockClock());
	});

	const register = (password: string, email: string) => handler.execute(registrationInput({ password, email }));

	it.each([
		["CP-REG-14 with the minimum of 8 characters", "Abcd#123", "pass8@tecnomarket.test"],
		["CP-REG-20 with the maximum of 64 characters", `Aa1#${"x".repeat(60)}`, "pass64@tecnomarket.test"],
	])("%s: registers the user", (_name, password, email) => {
		register(password, email);

		expect(accounts.add).toHaveBeenCalledOnce();
		expect(accounts.add.mock.calls[0]![0].email).toBe(email);
	});

	it.each([
		["CP-REG-15 with 7 characters", "Abc#123", []],
		["CP-REG-16 without uppercase", "segura#2026", ["uppercase"]],
		["CP-REG-17 without lowercase", "SEGURA#2026", ["lowercase"]],
		["CP-REG-18 without number", "Segura#Clave", ["number"]],
		["CP-REG-19 without special character", "Segura2026x", ["special"]],
		["CP-REG-21 with 65 characters", `Aa1#${"x".repeat(61)}`, []],
	])("%s: rejects the password and reports what is missing", (_name, password, missing) => {
		const failure = failureOf(() => register(password, "carlos.mora@tecnomarket.test"));

		expect(failure?.code).toBe("invalid_password");
		expect(failure?.details).toMatchObject({ min: 8, max: 64, missing });
		expect(accounts.add).not.toHaveBeenCalled();
	});
});
