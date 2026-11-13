import { z } from "zod";

export const quantityRule = z.number("Quantity must be a number").int("Quantity must be an integer").min(1, "Quantity must be at least 1");

export const addCartItemSchema = z.object({
	productId: z.string().min(1, "Product is required"),
	quantity: quantityRule,
});

export type AddCartItemInput = z.input<typeof addCartItemSchema>;
