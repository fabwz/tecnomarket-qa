import { Elysia } from "elysia";
import {
	SessionError,
	SessionToken,
	type Account,
	type AccountRepository,
	type SessionRepository,
} from "@core/account-access";
import type { Clock } from "@core/shared-kernel";

const bearerPrefix = "Bearer ";

export class AuthPlugin {
	constructor(
		private readonly sessions: SessionRepository,
		private readonly accounts: AccountRepository,
		private readonly clock: Clock,
	) {}

	authenticate(header: string | undefined): Account {
		const session = this.sessions.findByToken(this.tokenFrom(header));
		if (!session?.isActiveAt(this.clock.now())) throw SessionError.of("session_required");

		const account = this.accounts.findById(session.accountId);
		if (!account) throw SessionError.of("session_required");
		return account;
	}

	plugin() {
		return new Elysia({ name: "auth" }).macro({
			auth: {
				resolve: ({ headers }) => ({ account: this.authenticate(headers.authorization) }),
			},
		});
	}

	private tokenFrom(header: string | undefined): SessionToken {
		if (!header?.startsWith(bearerPrefix)) throw SessionError.of("session_required");
		try {
			return SessionToken.parse(header.slice(bearerPrefix.length));
		} catch {
			throw SessionError.of("session_required");
		}
	}
}
