import { token } from "dockdi";
import {
	AccountError,
	EmailAddress,
	PlainPassword,
	Session,
	SessionToken,
	type AccountRepository,
	type PasswordHasher,
	type SessionRepository,
} from "@core/account-access";
import type { Clock, IdGenerator } from "@core/shared-kernel";
import type { LoginUserBody } from "./login-user.schema";

export class LoginUserHandler {
	constructor(
		private readonly accounts: AccountRepository,
		private readonly sessions: SessionRepository,
		private readonly hasher: PasswordHasher,
		private readonly ids: IdGenerator,
		private readonly clock: Clock,
	) {}

	execute(input: LoginUserBody) {
		const account = this.accounts.findByEmail(EmailAddress.parse(input.email));
		if (!account) throw AccountError.of("account_not_found");

		if (!PlainPassword.is(input.password) || !this.hasher.verify(input.password, account.passwordHash)) {
			throw AccountError.of("invalid_credentials");
		}

		const session = Session.start(
			{ id: SessionToken.parse(this.ids.next()), accountId: account.id },
			this.clock.now(),
		);
		this.sessions.add(session);

		return {
			token: session.id,
			expiresAt: session.expiresAt,
			account: { id: account.id, fullName: account.fullName, email: account.email },
		};
	}
}

export const LoginUserHandlerToken = token(LoginUserHandler);
