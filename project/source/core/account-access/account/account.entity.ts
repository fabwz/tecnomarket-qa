import { Entity, type EntityState } from "@core/shared-kernel";
import type { AccountId, EmailAddress, FullName, PasswordHash, PhoneNumber } from "./account.vos";

export type AccountState = EntityState<AccountId> & {
	readonly fullName: FullName;
	readonly email: EmailAddress;
	readonly phone: PhoneNumber;
	readonly passwordHash: PasswordHash;
	readonly registeredAt: Date;
};

export type AccountRegistration = Omit<AccountState, "registeredAt">;

export interface Account extends AccountState {}

export class Account extends Entity<AccountState> {
	static register(input: AccountRegistration, now: Date): Account {
		return new Account({ ...input, registeredAt: now });
	}
}
