import type { Order } from "./entity";

export interface OrderNumberGenerator {
	next(date: Date): string;
}

export interface OrderStore {
	add(order: Order): void;
	listByUser(userId: string): readonly Order[];
}
