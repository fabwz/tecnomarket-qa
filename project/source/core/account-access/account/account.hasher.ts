import type { PasswordHash, PlainPassword } from "./account.vos";

export interface PasswordHasher {
	hash(plain: PlainPassword): PasswordHash;
	verify(plain: PlainPassword, hashed: PasswordHash): boolean;
}
