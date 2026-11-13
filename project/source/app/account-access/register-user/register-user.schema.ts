import { z } from "zod";

const required = (field: string) => z.string().min(1, `${field} is required`);

export const registerUserBody = z.object({
	fullName: required("Full name"),
	email: required("Email"),
	phone: required("Phone"),
	password: required("Password"),
});

export type RegisterUserBody = z.infer<typeof registerUserBody>;
