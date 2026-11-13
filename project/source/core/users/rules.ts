import { z } from "zod";

export const fullNameRule = z
	.string()
	.trim()
	.min(3, "Full name must have at least 3 characters")
	.max(100, "Full name must have at most 100 characters");

export const emailRule = z.string().trim().toLowerCase().pipe(z.email("Email format is not valid"));

export const phoneRule = z.string().regex(/^\d{8}$/, "Phone must have exactly 8 digits");

export const passwordRule = z
	.string()
	.min(8, "Password must have at least 8 characters")
	.max(64, "Password must have at most 64 characters")
	.regex(/[A-Z]/, "Password must include an uppercase letter")
	.regex(/[a-z]/, "Password must include a lowercase letter")
	.regex(/\d/, "Password must include a number")
	.regex(/[^A-Za-z0-9\s]/, "Password must include a special character");

export const registerSchema = z.object({
	fullName: fullNameRule,
	email: emailRule,
	phone: phoneRule,
	password: passwordRule,
});

export const loginSchema = z.object({
	email: emailRule,
	password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.input<typeof registerSchema>;
export type LoginInput = z.input<typeof loginSchema>;
