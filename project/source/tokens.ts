import { token } from "dockdi";
import type { Clock, IdGenerator } from "@core/kernel/contracts";
import type { PasswordHasher } from "@core/users/contracts";
import type { OrderNumberGenerator } from "@core/orders/contracts";

// kernel
export const ClockToken = token<Clock>("Clock");
export const IdGeneratorToken = token<IdGenerator>("IdGenerator");

// users
export const PasswordHasherToken = token<PasswordHasher>("PasswordHasher");

// orders
export const OrderNumberGeneratorToken = token<OrderNumberGenerator>("OrderNumberGenerator");

// Stores and use-case tokens are added alongside their implementations.
