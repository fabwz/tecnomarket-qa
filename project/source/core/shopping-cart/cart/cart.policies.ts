export type StockCheck = { readonly inCart: number; readonly requested: number; readonly stock: number };

export const fitsStock = ({ inCart, requested, stock }: StockCheck): boolean => inCart + requested <= stock;
