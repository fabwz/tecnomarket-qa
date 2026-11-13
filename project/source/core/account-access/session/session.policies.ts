export const sessionLifetimeMs = 30 * 60 * 1000;

export const expiryFrom = (startedAt: Date): Date => new Date(startedAt.getTime() + sessionLifetimeMs);

export const hasExpired = (expiresAt: Date, now: Date): boolean => expiresAt <= now;
