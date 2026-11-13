import type { Session, User } from "./entity";

export interface PasswordHasher {
	hash(plain: string): string;
	verify(plain: string, hashed: string): boolean;
}

export interface UserStore {
	add(user: User): void;
	findById(id: string): User | undefined;
	findByEmail(email: string): User | undefined;
}

export interface SessionStore {
	add(session: Session): void;
	find(token: string): Session | undefined;
}
