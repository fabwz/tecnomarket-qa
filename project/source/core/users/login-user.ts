import type { Clock, IdGenerator } from "@core/kernel/contracts";
import { exceptions, type Exception } from "@core/kernel/exceptions";
import { err, ok, type Result } from "@core/kernel/response";
import { parse } from "@core/kernel/validation";
import type { PasswordHasher, SessionStore, UserStore } from "./contracts";
import { SESSION_TTL_MS, toProfile, type Profile, type Session } from "./entity";
import { loginSchema, type LoginInput } from "./rules";

export type Login = { readonly session: Session; readonly user: Profile };

export class LoginUser {
	constructor(
		private readonly users: UserStore,
		private readonly sessions: SessionStore,
		private readonly hasher: PasswordHasher,
		private readonly ids: IdGenerator,
		private readonly clock: Clock,
	) {}

	execute(input: LoginInput): Result<Login, Exception> {
		const parsed = parse(loginSchema, input);
		if (!parsed.ok) return parsed;

		const { email, password } = parsed.value;
		const user = this.users.findByEmail(email);
		if (!user) return err(exceptions.accountNotFound());
		if (!this.hasher.verify(password, user.passwordHash)) return err(exceptions.invalidCredentials());

		const session = {
			token: this.ids.next(),
			userId: user.id,
			expiresAt: new Date(this.clock.now().getTime() + SESSION_TTL_MS),
		};
		this.sessions.add(session);
		return ok({ session, user: toProfile(user) });
	}
}
