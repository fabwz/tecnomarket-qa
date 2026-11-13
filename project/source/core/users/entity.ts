export const SESSION_TTL_MS = 30 * 60 * 1000;

export type User = {
	readonly id: string;
	readonly fullName: string;
	readonly email: string;
	readonly phone: string;
	readonly passwordHash: string;
	readonly createdAt: Date;
};

export type Profile = Omit<User, "passwordHash">;

export type Session = {
	readonly token: string;
	readonly userId: string;
	readonly expiresAt: Date;
};

export const toProfile = ({ passwordHash: _, ...profile }: User): Profile => profile;
