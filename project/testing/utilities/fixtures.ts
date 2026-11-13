export const accountFixtures = {
	ana: {
		id: "acc-ana",
		fullName: "Ana Mora",
		email: "ana.mora@tecnomarket.test",
		phone: "88776655",
		password: "Segura#2026",
	},
	luis: {
		id: "acc-luis",
		fullName: "Luis Vega",
		email: "luis.vega@tecnomarket.test",
		phone: "88001122",
		password: "Clave#2026x",
	},
	maria: {
		id: "acc-maria",
		fullName: "Maria Rojas",
		email: "maria.rojas@tecnomarket.test",
		phone: "88334455",
		password: "Pedido#2026",
	},
} as const;

export const productFixtures = {
	keyboard: { id: "P-001", name: "Teclado mecánico", description: "Teclado mecánico retroiluminado", price: 35000, stock: 5 },
	mouse: { id: "P-002", name: "Mouse inalámbrico", description: "Mouse inalámbrico 2.4 GHz", price: 12500, stock: 10 },
	monitor: { id: "P-003", name: 'Monitor 24"', description: "Monitor Full HD de 24 pulgadas", price: 95000, stock: 2 },
	cable: { id: "P-004", name: "Cable HDMI", description: "Cable HDMI de 2 metros", price: 4500, stock: 0 },
} as const;

export const orderFixtures = {
	first: {
		id: "ord-0001",
		number: "PED-20261110-0001",
		buyerId: accountFixtures.maria.id,
		placedAt: "2026-11-10T15:00:00Z",
		lines: [
			{ productId: productFixtures.keyboard.id, name: productFixtures.keyboard.name, unitPrice: productFixtures.keyboard.price, quantity: 1 },
			{ productId: productFixtures.mouse.id, name: productFixtures.mouse.name, unitPrice: productFixtures.mouse.price, quantity: 2 },
		],
	},
	second: {
		id: "ord-0002",
		number: "PED-20261112-0001",
		buyerId: accountFixtures.maria.id,
		placedAt: "2026-11-12T09:30:00Z",
		lines: [
			{ productId: productFixtures.monitor.id, name: productFixtures.monitor.name, unitPrice: productFixtures.monitor.price, quantity: 1 },
		],
	},
} as const;

export const testStartAt = "2026-11-13T10:00:00Z";
