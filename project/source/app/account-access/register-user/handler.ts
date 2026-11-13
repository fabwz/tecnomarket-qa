import type { Container } from "dockdi";
import {
	Account,
	AccountError,
	AccountId,
	EmailAddress,
	FullName,
	PhoneNumber,
	PlainPassword,
} from "@core/account-access";
import {
	AccountRepositoryToken,
	ClockToken,
	IdGeneratorToken,
	PasswordHasherToken,
} from "@tokens";
import type { RegisterUserBody } from "./schema";

export const registerUser = (dock: Container, input: RegisterUserBody) => {
	const accounts = dock.resolve(AccountRepositoryToken);
	const fullName = FullName.parse(input.fullName);
	const email = EmailAddress.parse(input.email);
	const phone = PhoneNumber.parse(input.phone);
	const password = PlainPassword.parse(input.password);
	if (accounts.findByEmail(email)) throw AccountError.of("email_taken");

	const account = Account.register(
		{
			id: AccountId.parse(dock.resolve(IdGeneratorToken).next()),
			fullName,
			email,
			phone,
			passwordHash: dock.resolve(PasswordHasherToken).hash(password),
		},
		dock.resolve(ClockToken).now(),
	);
	accounts.add(account);

	return {
		id: account.id,
		fullName: account.fullName,
		email: account.email,
		phone: account.phone,
		registeredAt: account.registeredAt,
	};
};
