import type { Container } from "dockdi";
import { AccountError, EmailAddress, PlainPassword, Session, SessionToken } from "@core/account-access";
import {
	AccountRepositoryToken,
	ClockToken,
	IdGeneratorToken,
	PasswordHasherToken,
	SessionRepositoryToken,
} from "@tokens";
import type { LoginUserBody } from "./schema";

export const loginUser = (dock: Container, input: LoginUserBody) => {
	const account = dock.resolve(AccountRepositoryToken).findByEmail(EmailAddress.parse(input.email));
	if (!account) throw AccountError.of("account_not_found");

	const hasher = dock.resolve(PasswordHasherToken);
	if (!PlainPassword.is(input.password) || !hasher.verify(input.password, account.passwordHash)) {
		throw AccountError.of("invalid_credentials");
	}

	const session = Session.start(
		{ id: SessionToken.parse(dock.resolve(IdGeneratorToken).next()), accountId: account.id },
		dock.resolve(ClockToken).now(),
	);
	dock.resolve(SessionRepositoryToken).add(session);

	return {
		token: session.id,
		expiresAt: session.expiresAt,
		account: { id: account.id, fullName: account.fullName, email: account.email },
	};
};
