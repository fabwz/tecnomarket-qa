import { z } from "zod";

export const loginUserBody = z.object({
	email: z.string().min(1, "Email is required"),
	password: z.string().min(1, "Password is required"),
});

export type LoginUserBody = z.infer<typeof loginUserBody>;
