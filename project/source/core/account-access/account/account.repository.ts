import type { Account } from "./account.entity";
import type { AccountId, EmailAddress } from "./account.vos";

export interface AccountRepository {
	add(account: Account): void;
	findById(id: AccountId): Account | undefined;
	findByEmail(email: EmailAddress): Account | undefined;
}
