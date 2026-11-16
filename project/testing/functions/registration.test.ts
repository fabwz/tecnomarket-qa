import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUserHandler } from "@app/account-access/register-user/register-user.handler";
import { registerUserBody } from "@app/account-access/register-user/register-user.schema";
import { accountOf, registrationInput } from "@testing/utilities/factories";
import { accountFixtures, testStartAt } from "@testing/utilities/fixtures";
import { codeOf } from "@testing/utilities/assertions";
import { mockAccounts, mockClock, mockHasher, mockIds } from "@testing/utilities/mocks";

describe("User registration", () => {
	let hasher: ReturnType<typeof mockHasher>;
	let accounts: ReturnType<typeof mockAccounts>;
	let handler: RegisterUserHandler;

	beforeEach(() => {
		hasher = mockHasher();
		accounts = mockAccounts([accountOf(accountFixtures.ana, hasher, new Date(testStartAt))]);
		handler = new RegisterUserHandler(accounts, hasher, mockIds(), mockClock());
	});

	const register = (overrides: Parameters<typeof registrationInput>[0] = {}) =>
		handler.execute(registrationInput(overrides));

	const savedEmails = () => accounts.add.mock.calls.map(([account]) => account.email);

	it("CP-REG-01 registers a user with valid data", () => {
		const input = registrationInput();

		const result = handler.execute(input);

		expect(result).toMatchObject({ email: input.email, fullName: input.fullName, phone: input.phone });
		expect(accounts.add).toHaveBeenCalledOnce();
		const [saved] = accounts.add.mock.calls[0]!;
		expect(saved.email).toBe(input.email);
		expect(saved.passwordHash).not.toBe(input.password);
		expect(saved.passwordHash).not.toContain(input.password);
		expect(hasher.hash).toHaveBeenCalledWith(input.password);
	});

	it("CP-REG-02 rejects an email that is already registered", () => {
		expect(codeOf(() => register({ email: accountFixtures.ana.email }))).toBe("email_taken");

		expect(accounts.add).not.toHaveBeenCalled();
	});

	it("CP-REG-03 rejects a duplicated email written in uppercase", () => {
		expect(codeOf(() => register({ email: "ANA.MORA@TECNOMARKET.TEST" }))).toBe("email_taken");

		expect(accounts.add).not.toHaveBeenCalled();
	});

	it.each([
		["CP-REG-04 without at sign", "carlos.moratecnomarket.test"],
		["CP-REG-05 without domain", "carlos@"],
	])("%s: rejects an invalid email", (_name, email) => {
		expect(codeOf(() => register({ email }))).toBe("invalid_email");

		expect(accounts.add).not.toHaveBeenCalled();
	});

	it("CP-REG-06 rejects empty fields, reporting every missing one at the request shape level", () => {
		const empty = { fullName: "", email: "", phone: "", password: "" };

		const shape = registerUserBody.safeParse(empty);
		expect(shape.success).toBe(false);
		expect(shape.error?.issues.map((issue) => issue.path[0])).toEqual(["fullName", "email", "phone", "password"]);

		expect(codeOf(() => handler.execute(empty))).toBe("invalid_full_name");
		expect(accounts.add).not.toHaveBeenCalled();
	});

	it("CP-REG-07 accepts a full name with the minimum of 3 characters", () => {
		register({ fullName: "Ana", email: "limite3@tecnomarket.test" });

		expect(savedEmails()).toEqual(["limite3@tecnomarket.test"]);
		expect(accounts.add.mock.calls[0]![0].fullName).toHaveLength(3);
	});

	it("CP-REG-08 rejects a full name with 2 characters", () => {
		expect(codeOf(() => register({ fullName: "An" }))).toBe("invalid_full_name");

		expect(accounts.add).not.toHaveBeenCalled();
	});

	it("CP-REG-09 accepts a full name with the maximum of 100 characters", () => {
		register({ fullName: "a".repeat(100), email: "limite100@tecnomarket.test" });

		expect(savedEmails()).toEqual(["limite100@tecnomarket.test"]);
		expect(accounts.add.mock.calls[0]![0].fullName).toHaveLength(100);
	});

	it("CP-REG-10 rejects a full name with 101 characters", () => {
		expect(codeOf(() => register({ fullName: "a".repeat(101) }))).toBe("invalid_full_name");

		expect(accounts.add).not.toHaveBeenCalled();
	});

	it.each([
		["CP-REG-11 with 7 digits", "8877665"],
		["CP-REG-12 with 9 digits", "887766554"],
		["CP-REG-13 with letters", "8877abcd"],
	])("%s: rejects an invalid phone", (_name, phone) => {
		expect(codeOf(() => register({ phone }))).toBe("invalid_phone");

		expect(accounts.add).not.toHaveBeenCalled();
	});
});
