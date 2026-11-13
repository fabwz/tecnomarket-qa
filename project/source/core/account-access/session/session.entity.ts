import { Entity, type EntityState } from "@core/shared-kernel";
import type { AccountId } from "../account/account.vos";
import { expiryFrom, hasExpired } from "./session.policies";
import type { SessionToken } from "./session.vos";

export type SessionState = EntityState<SessionToken> & {
	readonly accountId: AccountId;
	readonly expiresAt: Date;
};

export type SessionStart = Omit<SessionState, "expiresAt">;

export interface Session extends SessionState {}

export class Session extends Entity<SessionState> {
	static start(input: SessionStart, now: Date): Session {
		return new Session({ ...input, expiresAt: expiryFrom(now) });
	}

	isActiveAt(now: Date): boolean {
		return !hasExpired(this.expiresAt, now);
	}
}
