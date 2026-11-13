declare const stateType: unique symbol;

export type EntityState<Id extends string = string> = { readonly id: Id };

export type StateOf<T> = T extends { readonly [stateType]?: infer S } ? NonNullable<S> : never;

export abstract class Entity<S extends EntityState> {
	declare readonly id: S["id"];
	declare readonly [stateType]?: S;

	protected constructor(state: S) {
		Object.assign(this, state);
		Object.freeze(this);
	}

	static restore<T extends Entity<EntityState>>(this: { readonly prototype: T }, state: StateOf<T>): T {
		return Reflect.construct(this as never, [state]) as T;
	}

	sameAs(other: Entity<EntityState>): boolean {
		return other.constructor === this.constructor && other.id === this.id;
	}

	protected with(patch: Partial<Omit<S, "id">>): this {
		return Reflect.construct(this.constructor, [{ ...this, ...patch }]) as this;
	}
}
