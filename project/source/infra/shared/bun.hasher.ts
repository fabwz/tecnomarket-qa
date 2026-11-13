import type { PasswordHasher } from "@core/users/contracts";

export class BunHasher implements PasswordHasher {
	hash(plain: string): string {
		return Bun.password.hashSync(plain, { algorithm: "bcrypt", cost: 10 });
	}

	verify(plain: string, hashed: string): boolean {
		return Bun.password.verifySync(plain, hashed);
	}
}
