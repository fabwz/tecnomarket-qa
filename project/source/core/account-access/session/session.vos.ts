import { identifier } from "@core/shared-kernel";
import { SessionError } from "./session.errors";

export const SessionToken = identifier("session_token", (details) =>
	SessionError.of("invalid_session_token", details),
);
export type SessionToken = ReturnType<typeof SessionToken.parse>;
