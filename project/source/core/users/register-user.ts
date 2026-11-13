import type { Clock, IdGenerator } from "@core/kernel/contracts";
import { exceptions, type Exception } from "@core/kernel/exceptions";
import { err, ok, type Result } from "@core/kernel/response";
import { parse } from "@core/kernel/validation";
import type { PasswordHasher, UserStore } from "./contracts";
import { toProfile, type Profile } from "./entity";
import { registerSchema, type RegisterInput } from "./rules";

export class RegisterUser {
	constructor(
		private readonly users: UserStore,
		private readonly hasher: PasswordHasher,
		private readonly ids: IdGenerator,
		private readonly clock: Clock,
	) {}

	execute(input: RegisterInput): Result<Profile, Exception> {
		const parsed = parse(registerSchema, input);
		if (!parsed.ok) return parsed;

		const { fullName, email, phone, password } = parsed.value;
		if (this.users.findByEmail(email)) return err(exceptions.emailTaken());

		const user = {
			id: this.ids.next(),
			fullName,
			email,
			phone,
			passwordHash: this.hasher.hash(password),
			createdAt: this.clock.now(),
		};
		this.users.add(user);
		return ok(toProfile(user));
	}
}
