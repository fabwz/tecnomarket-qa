export interface PasswordHasher {
	hash(plain: string): string;
	verify(plain: string, hashed: string): boolean;
}
