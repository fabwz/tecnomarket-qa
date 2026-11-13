import { z } from "zod";

export const addCartItemBody = z.object({
	productId: z.string().min(1, "Product id is required"),
	quantity: z.number("Quantity must be a number"),
});

export type AddCartItemBody = z.infer<typeof addCartItemBody>;
