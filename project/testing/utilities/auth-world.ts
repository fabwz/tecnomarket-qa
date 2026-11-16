import { AuthPlugin } from "@infra/plugins/auth.plugin";
import { Session, SessionToken, type Account } from "@core/account-access";
import { accountOf } from "./factories";
import { accountFixtures, testStartAt } from "./fixtures";
import { mockAccounts, mockClock, mockHasher, mockSessions } from "./mocks";

export function createAuthWorld() {
	const clock = mockClock();
	const hasher = mockHasher();
	const registeredAt = new Date(testStartAt);
	const people = {
		ana: accountOf(accountFixtures.ana, hasher, registeredAt),
		luis: accountOf(accountFixtures.luis, hasher, registeredAt),
		maria: accountOf(accountFixtures.maria, hasher, registeredAt),
	};
	const accounts = mockAccounts(Object.values(people));
	const sessions = mockSessions();
	const plugin = new AuthPlugin(sessions, accounts, clock);

	const startSession = (account: Account, token = `token-${account.id}`): string => {
		sessions.add(Session.start({ id: SessionToken.parse(token), accountId: account.id }, clock.now()));
		return token;
	};

	return { clock, hasher, people, accounts, sessions, plugin, startSession };
}
