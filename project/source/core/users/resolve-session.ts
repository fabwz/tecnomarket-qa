import type { Clock } from "@core/kernel/contracts";
import { exceptions, type Exception } from "@core/kernel/exceptions";
import { err, ok, type Result } from "@core/kernel/response";
import type { SessionStore, UserStore } from "./contracts";
import { toProfile, type Profile } from "./entity";

export class ResolveSession {
	constructor(
		private readonly sessions: SessionStore,
		private readonly users: UserStore,
		private readonly clock: Clock,
	) {}

	execute(token: string | undefined): Result<Profile, Exception> {
		const session = token === undefined ? undefined : this.sessions.find(token);
		if (!session || session.expiresAt <= this.clock.now()) return err(exceptions.sessionRequired());

		const user = this.users.findById(session.userId);
		if (!user) return err(exceptions.sessionRequired());
		return ok(toProfile(user));
	}
}
