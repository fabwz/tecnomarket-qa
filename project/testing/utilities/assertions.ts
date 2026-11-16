import { DomainError } from "@core/shared-kernel";

export function failureOf(action: () => unknown): DomainError | undefined {
	try {
		action();
	} catch (error) {
		if (error instanceof DomainError) return error;
		throw error;
	}
	return undefined;
}

export const codeOf = (action: () => unknown): string | undefined => failureOf(action)?.code;
