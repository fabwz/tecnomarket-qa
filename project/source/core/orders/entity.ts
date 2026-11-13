export type OrderLine = {
	readonly productId: string;
	readonly name: string;
	readonly unitPrice: number;
	readonly quantity: number;
	readonly subtotal: number;
};

export type Order = {
	readonly id: string;
	readonly number: string;
	readonly userId: string;
	readonly lines: readonly OrderLine[];
	readonly itemCount: number;
	readonly total: number;
	readonly placedAt: Date;
};
