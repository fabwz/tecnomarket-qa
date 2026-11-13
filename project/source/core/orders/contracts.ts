export interface OrderNumberGenerator {
	/** Returns a unique `PED-YYYYMMDD-NNNN` number for the given day. */
	next(date: Date): string;
}
