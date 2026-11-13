import type { Session } from "./session.entity";
import type { SessionToken } from "./session.vos";

export interface SessionRepository {
	add(session: Session): void;
	findByToken(token: SessionToken): Session | undefined;
}
