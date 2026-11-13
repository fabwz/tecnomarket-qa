import { Account, AccountId, EmailAddress, FullName, PhoneNumber, PlainPassword, type PasswordHasher } from "@core/account-access";
import {
	BuyerId,
	LineName,
	LinePrice,
	LineProductId,
	LineQuantity,
	Order,
	OrderId,
	OrderNumber,
} from "@core/order-checkout";
import { Product, ProductDescription, ProductId, ProductName, StockUnits, UnitPrice } from "@core/product-catalog";
import type { RegisterUserBody } from "@app/account-access/register-user/register-user.schema";
import type { accountFixtures, orderFixtures, productFixtures } from "./fixtures";

type AccountFixture = (typeof accountFixtures)[keyof typeof accountFixtures];
type ProductFixture = (typeof productFixtures)[keyof typeof productFixtures];
type OrderFixture = (typeof orderFixtures)[keyof typeof orderFixtures];

export const registrationInput = (overrides: Partial<RegisterUserBody> = {}): RegisterUserBody => ({
	fullName: "Carlos Mora Solís",
	email: "carlos.mora@tecnomarket.test",
	phone: "88776655",
	password: "Segura#2026",
	...overrides,
});

export const accountOf = (fixture: AccountFixture, hasher: PasswordHasher, registeredAt: Date): Account =>
	Account.register(
		{
			id: AccountId.parse(fixture.id),
			fullName: FullName.parse(fixture.fullName),
			email: EmailAddress.parse(fixture.email),
			phone: PhoneNumber.parse(fixture.phone),
			passwordHash: hasher.hash(PlainPassword.parse(fixture.password)),
		},
		registeredAt,
	);

export const productOf = (fixture: ProductFixture): Product =>
	Product.offer({
		id: ProductId.parse(fixture.id),
		name: ProductName.parse(fixture.name),
		description: ProductDescription.parse(fixture.description),
		price: UnitPrice.parse(fixture.price),
		stock: StockUnits.parse(fixture.stock),
	});

export const orderOf = (fixture: OrderFixture): Order =>
	Order.place(
		{
			id: OrderId.parse(fixture.id),
			number: OrderNumber.parse(fixture.number),
			buyerId: BuyerId.parse(fixture.buyerId),
			lines: fixture.lines.map((line) => ({
				id: LineProductId.parse(line.productId),
				name: LineName.parse(line.name),
				unitPrice: LinePrice.parse(line.unitPrice),
				quantity: LineQuantity.parse(line.quantity),
			})),
		},
		new Date(fixture.placedAt),
	);
