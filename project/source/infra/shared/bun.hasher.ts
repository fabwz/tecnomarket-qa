import { PasswordHash, type PasswordHasher, type PlainPassword } from "@core/account-access";

export class BunHasher implements PasswordHasher {
	hash(plain: PlainPassword): PasswordHash {
		return PasswordHash.parse(Bun.password.hashSync(plain, { algorithm: "bcrypt", cost: 10 }));
	}

	verify(plain: PlainPassword, hashed: PasswordHash): boolean {
		return Bun.password.verifySync(plain, hashed);
	}
}
