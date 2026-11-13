import type { DomainError, ErrorDetails } from "../error/error.errors";

declare const kindBrand: unique symbol;

export type Distinct<Base, Kind extends string> = Base & { readonly [kindBrand]: Kind };

export type ValueObject<Base, Kind extends string> = {
	readonly kind: Kind;
	readonly parse: (raw: Base) => Distinct<Base, Kind>;
	readonly is: (value: unknown) => value is Distinct<Base, Kind>;
};

type Failure = (details: ErrorDetails) => DomainError;

export type TextRules = {
	readonly min?: number;
	readonly max?: number;
	readonly pattern?: RegExp;
	readonly normalize?: (value: string) => string;
};

export function text<Kind extends string>(kind: Kind, rules: TextRules, fail: Failure): ValueObject<string, Kind> {
	const { min = 0, max = Number.POSITIVE_INFINITY, pattern, normalize = (value: string) => value } = rules;
	const clean = (raw: string) => normalize(raw.trim());
	const valid = (value: string) => value.length >= min && value.length <= max && (pattern?.test(value) ?? true);

	return {
		kind,
		parse(raw) {
			const value = clean(raw);
			if (!valid(value)) throw fail({ min: rules.min, max: rules.max });
			return value as Distinct<string, Kind>;
		},
		is(value): value is Distinct<string, Kind> {
			return typeof value === "string" && value === clean(value) && valid(value);
		},
	};
}

export type WholeRules = { readonly min?: number; readonly max?: number };

export function whole<Kind extends string>(kind: Kind, rules: WholeRules, fail: Failure): ValueObject<number, Kind> {
	const { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY } = rules;
	const valid = (value: unknown): value is number => Number.isInteger(value) && (value as number) >= min && (value as number) <= max;

	return {
		kind,
		parse(raw) {
			if (!valid(raw)) throw fail({ min: rules.min, max: rules.max });
			return raw as Distinct<number, Kind>;
		},
		is(value): value is Distinct<number, Kind> {
			return valid(value);
		},
	};
}

export function identifier<Kind extends string>(kind: Kind, fail: Failure): ValueObject<string, Kind> {
	return text(kind, { min: 1, max: 64 }, fail);
}
