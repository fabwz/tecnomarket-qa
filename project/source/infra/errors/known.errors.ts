import { AccountError, SessionError } from "@core/account-access";
import { ProductError } from "@core/product-catalog";
import { CartError } from "@core/shopping-cart";
import { OrderError } from "@core/order-checkout";
import type { DomainError } from "@core/shared-kernel";

export type KnownError = AccountError | SessionError | ProductError | CartError | OrderError;
export type KnownCode = KnownError["code"];

export const isKnown = (error: DomainError): error is KnownError =>
	AccountError.is(error) || SessionError.is(error) || ProductError.is(error) || CartError.is(error) || OrderError.is(error);
