export type ErrorDetails = Readonly<Record<string, unknown>>;

export class DomainError<Code extends string = string> extends Error {
	constructor(
		readonly scope: string,
		readonly code: Code,
		message: string,
		readonly details: ErrorDetails = {},
	) {
		super(message);
		this.name = "DomainError";
	}

	static define<const Code extends string>(scope: string, messages: Readonly<Record<Code, string>>) {
		return {
			of: (code: Code, details?: ErrorDetails) => new DomainError<Code>(scope, code, messages[code], details),
			is: (error: unknown): error is DomainError<Code> => error instanceof DomainError && error.scope === scope,
		};
	}
}
