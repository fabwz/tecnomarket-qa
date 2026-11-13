import { DomainError } from "@core/shared-kernel";

export const SessionError = DomainError.define("session", {
	invalid_session_token: "The session token is not valid.",
	session_required: "An active session is required.",
});

export type SessionError = ReturnType<typeof SessionError.of>;
