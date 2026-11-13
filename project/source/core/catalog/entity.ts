export type Product = {
	readonly id: string;
	readonly name: string;
	readonly description: string;
	readonly price: number;
	readonly stock: number;
};

export type ProductView = Product & { readonly available: boolean };
