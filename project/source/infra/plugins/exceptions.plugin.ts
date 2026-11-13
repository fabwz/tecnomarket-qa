import { token } from "dockdi";
import { Elysia } from "elysia";
import { DomainError } from "@core/shared-kernel";
import { isKnown } from "../errors/known.errors";
import { replyToDomain, replyToValidation, type Reply } from "../errors/reply.errors";

const send = (set: { status?: number | string }, { status, body }: Reply) => {
	set.status = status;
	return body;
};

export class ExceptionsPlugin {
	plugin() {
		return new Elysia({ name: "exceptions" }).onError({ as: "global" }, ({ error, code, set }) => {
			if (error instanceof DomainError && isKnown(error)) return send(set, replyToDomain(error));
			if (code === "VALIDATION") return send(set, replyToValidation(error));
		});
	}
}

export const ExceptionsPluginToken = token(ExceptionsPlugin);
