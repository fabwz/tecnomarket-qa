import type { Session, SessionRepository, SessionToken } from "@core/account-access";

export class SessionStore implements SessionRepository {
	private readonly sessions = new Map<SessionToken, Session>();

	add(session: Session): void {
		this.sessions.set(session.id, session);
	}

	findByToken(token: SessionToken): Session | undefined {
		return this.sessions.get(token);
	}
}
