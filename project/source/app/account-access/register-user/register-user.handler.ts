import { token } from "dockdi";
import {
	Account,
	AccountError,
	AccountId,
	EmailAddress,
	FullName,
	PhoneNumber,
	PlainPassword,
	type AccountRepository,
	type PasswordHasher,
} from "@core/account-access";
import type { Clock, IdGenerator } from "@core/shared-kernel";
import type { RegisterUserBody } from "./register-user.schema";

export class RegisterUserHandler {
	constructor(
		private readonly accounts: AccountRepository,
		private readonly hasher: PasswordHasher,
		private readonly ids: IdGenerator,
		private readonly clock: Clock,
	) {}

	execute(input: RegisterUserBody) {
		const fullName = FullName.parse(input.fullName);
		const email = EmailAddress.parse(input.email);
		const phone = PhoneNumber.parse(input.phone);
		const password = PlainPassword.parse(input.password);
		if (this.accounts.findByEmail(email)) throw AccountError.of("email_taken");

		const account = Account.register(
			{
				id: AccountId.parse(this.ids.next()),
				fullName,
				email,
				phone,
				passwordHash: this.hasher.hash(password),
			},
			this.clock.now(),
		);
		this.accounts.add(account);

		return {
			id: account.id,
			fullName: account.fullName,
			email: account.email,
			phone: account.phone,
			registeredAt: account.registeredAt,
		};
	}
}

export const RegisterUserHandlerToken = token(RegisterUserHandler);
