import { beforeEach, describe, expect, it } from "vitest";
import { LoginUserHandler } from "@app/account-access/login-user/login-user.handler";
import { loginUserBody } from "@app/account-access/login-user/login-user.schema";
import { codeOf } from "@testing/utilities/assertions";
import { createAuthWorld } from "@testing/utilities/auth-world";
import { accountFixtures } from "@testing/utilities/fixtures";
import { mockIds, mockSessions } from "@testing/utilities/mocks";

describe("User login", () => {
	let world: ReturnType<typeof createAuthWorld>;
	let sessions: ReturnType<typeof mockSessions>;
	let handler: LoginUserHandler;

	beforeEach(() => {
		world = createAuthWorld();
		sessions = mockSessions();
		handler = new LoginUserHandler(world.accounts, sessions, world.hasher, mockIds("token"), world.clock);
	});

	const login = (email: string, password: string) => handler.execute({ email, password });
	const { email, password } = accountFixtures.ana;

	it("CP-LOG-01 grants access with valid credentials", () => {
		const result = login(email, password);

		expect(sessions.add).toHaveBeenCalledOnce();
		const [session] = sessions.add.mock.calls[0]!;
		expect(session.accountId).toBe(world.people.ana.id);
		expect(session.isActiveAt(world.clock.now())).toBe(true);
		expect(result).toMatchObject({ token: session.id, account: { id: world.people.ana.id, email } });
		expect(result.account).not.toHaveProperty("passwordHash");
	});

	it("CP-LOG-02 rejects a wrong password", () => {
		expect(codeOf(() => login(email, "Incorrecta#1"))).toBe("invalid_credentials");

		expect(sessions.add).not.toHaveBeenCalled();
	});

	it("CP-LOG-03 rejects an account that does not exist", () => {
		expect(codeOf(() => login("noexiste@tecnomarket.test", "Segura#2026"))).toBe("account_not_found");

		expect(sessions.add).not.toHaveBeenCalled();
	});

	it("CP-LOG-04 rejects an empty email", () => {
		expect(loginUserBody.safeParse({ email: "", password }).error?.issues[0]?.path).toEqual(["email"]);
		expect(codeOf(() => login("", password))).toBe("invalid_email");

		expect(sessions.add).not.toHaveBeenCalled();
	});

	it("CP-LOG-05 rejects an empty password", () => {
		expect(loginUserBody.safeParse({ email, password: "" }).error?.issues[0]?.path).toEqual(["password"]);
		expect(codeOf(() => login(email, ""))).toBe("invalid_credentials");

		expect(sessions.add).not.toHaveBeenCalled();
	});

	it("CP-LOG-06 rejects an email with an invalid format", () => {
		expect(codeOf(() => login("ana.mora.tecnomarket.test", password))).toBe("invalid_email");

		expect(sessions.add).not.toHaveBeenCalled();
	});

	it("CP-LOG-07 treats the password as case sensitive", () => {
		expect(codeOf(() => login(email, "SEGURA#2026"))).toBe("invalid_credentials");

		expect(sessions.add).not.toHaveBeenCalled();
	});

	it("CP-LOG-08 treats the email as case insensitive", () => {
		login("ANA.MORA@TECNOMARKET.TEST", password);

		expect(sessions.add).toHaveBeenCalledOnce();
		expect(sessions.add.mock.calls[0]![0].accountId).toBe(world.people.ana.id);
	});

	it("CP-LOG-09 requires an active session to enter protected resources", () => {
		const token = world.startSession(world.people.ana);

		expect(codeOf(() => world.plugin.authenticate(undefined))).toBe("session_required");
		expect(codeOf(() => world.plugin.authenticate(`Bearer unknown`))).toBe("session_required");
		expect(codeOf(() => world.plugin.authenticate(token))).toBe("session_required");
		expect(world.plugin.authenticate(`Bearer ${token}`)).toBe(world.people.ana);
	});

	it("CP-LOG-09 rejects an expired session after 30 minutes", () => {
		const token = world.startSession(world.people.ana);

		world.clock.set(new Date(world.clock.now().getTime() + 30 * 60 * 1000 - 1));
		expect(world.plugin.authenticate(`Bearer ${token}`)).toBe(world.people.ana);

		world.clock.set(new Date(world.clock.now().getTime() + 1));
		expect(codeOf(() => world.plugin.authenticate(`Bearer ${token}`))).toBe("session_required");
	});

	it("CP-LOG-10 handles an SQL injection attempt as a plain invalid email", () => {
		expect(codeOf(() => login("' OR '1'='1", "cualquiera"))).toBe("invalid_email");

		expect(sessions.add).not.toHaveBeenCalled();
	});
});
