import type { Account, AccountId, AccountRepository, EmailAddress } from "@core/account-access";

export class AccountStore implements AccountRepository {
	private readonly accounts = new Map<AccountId, Account>();

	add(account: Account): void {
		this.accounts.set(account.id, account);
	}

	findById(id: AccountId): Account | undefined {
		return this.accounts.get(id);
	}

	findByEmail(email: EmailAddress): Account | undefined {
		return [...this.accounts.values()].find((account) => account.email === email);
	}
}
