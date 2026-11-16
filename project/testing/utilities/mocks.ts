import { vi } from "vitest";
import type {
	Account,
	AccountId,
	AccountRepository,
	EmailAddress,
	PasswordHash,
	PasswordHasher,
	PlainPassword,
	Session,
	SessionRepository,
	SessionToken,
} from "@core/account-access";
import { OrderNumber, type BuyerId, type Order, type OrderNumbering, type OrderRepository } from "@core/order-checkout";
import type { Product, ProductId, ProductRepository } from "@core/product-catalog";
import type { Cart, CartRepository, ShopperId } from "@core/shopping-cart";
import type { Clock, IdGenerator } from "@core/shared-kernel";
import { testStartAt } from "./fixtures";

export const mockClock = (at: Date = new Date(testStartAt)) => {
	let current = at;
	return {
		now: vi.fn(() => current),
		set: (date: Date) => {
			current = date;
		},
	} satisfies Clock & { set(date: Date): void };
};

export const mockIds = (prefix = "id") => {
	let count = 0;
	return { next: vi.fn(() => `${prefix}-${String(++count).padStart(4, "0")}`) } satisfies IdGenerator;
};

export const mockHasher = () =>
	({
		hash: vi.fn((plain: PlainPassword) => `hashed(${plain.length})#${plain.split("").reverse().join("")}` as PasswordHash),
		verify: vi.fn(
			(plain: PlainPassword, hashed: PasswordHash) =>
				hashed === (`hashed(${plain.length})#${plain.split("").reverse().join("")}` as PasswordHash),
		),
	}) satisfies PasswordHasher;

export const mockNumbering = () => {
	const counters = new Map<string, number>();
	return {
		next: vi.fn((date: Date) => {
			const day = date.toISOString().slice(0, 10).replaceAll("-", "");
			const sequence = (counters.get(day) ?? 0) + 1;
			counters.set(day, sequence);
			return OrderNumber.parse(`PED-${day}-${String(sequence).padStart(4, "0")}`);
		}),
	} satisfies OrderNumbering;
};

export const mockAccounts = (seed: readonly Account[] = []) => {
	const stored = new Map<AccountId, Account>(seed.map((account) => [account.id, account]));
	return {
		add: vi.fn((account: Account) => void stored.set(account.id, account)),
		findById: vi.fn((id: AccountId) => stored.get(id)),
		findByEmail: vi.fn((email: EmailAddress) => [...stored.values()].find((account) => account.email === email)),
	} satisfies AccountRepository;
};

export const mockSessions = (seed: readonly Session[] = []) => {
	const stored = new Map<SessionToken, Session>(seed.map((session) => [session.id, session]));
	return {
		add: vi.fn((session: Session) => void stored.set(session.id, session)),
		findByToken: vi.fn((token: SessionToken) => stored.get(token)),
	} satisfies SessionRepository;
};

export const mockProducts = (seed: readonly Product[] = []) => {
	const stored = new Map<ProductId, Product>(seed.map((product) => [product.id, product]));
	return {
		add: vi.fn((product: Product) => void stored.set(product.id, product)),
		findById: vi.fn((id: ProductId) => stored.get(id)),
		list: vi.fn(() => [...stored.values()]),
	} satisfies ProductRepository;
};

export const mockCarts = (seed: readonly Cart[] = []) => {
	const stored = new Map<ShopperId, Cart>(seed.map((cart) => [cart.id, cart]));
	return {
		add: vi.fn((cart: Cart) => void stored.set(cart.id, cart)),
		findByShopper: vi.fn((shopperId: ShopperId) => stored.get(shopperId)),
	} satisfies CartRepository;
};

export const mockOrders = (seed: readonly Order[] = []) => {
	const stored = new Map<string, Order>(seed.map((order) => [order.id, order]));
	return {
		add: vi.fn((order: Order) => void stored.set(order.id, order)),
		listByBuyer: vi.fn((buyerId: BuyerId) => [...stored.values()].filter((order) => order.buyerId === buyerId)),
	} satisfies OrderRepository;
};
