import { Elysia } from "elysia";
import type { Container } from "dockdi";
import { SessionError, SessionToken, type Account } from "@core/account-access";
import { AccountRepositoryToken, ClockToken, SessionRepositoryToken } from "@tokens";

const bearerPrefix = "Bearer ";

const tokenFrom = (header: string | undefined): SessionToken => {
	if (!header?.startsWith(bearerPrefix)) throw SessionError.of("session_required");
	try {
		return SessionToken.parse(header.slice(bearerPrefix.length));
	} catch {
		throw SessionError.of("session_required");
	}
};

export const authenticate = (dock: Container, header: string | undefined): Account => {
	const session = dock.resolve(SessionRepositoryToken).findByToken(tokenFrom(header));
	if (!session?.isActiveAt(dock.resolve(ClockToken).now())) throw SessionError.of("session_required");

	const account = dock.resolve(AccountRepositoryToken).findById(session.accountId);
	if (!account) throw SessionError.of("session_required");
	return account;
};

export const authPlugin = (dock: Container) =>
	new Elysia({ name: "auth" }).macro({
		auth: {
			resolve: ({ headers }) => ({ account: authenticate(dock, headers.authorization) }),
		},
	});
