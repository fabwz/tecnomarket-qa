import { env } from "@env";
import { AppToken } from "@tokens";
import { createDock } from "./server.dock";

createDock()
	.resolve(AppToken)
	.build()
	.listen(env.PORT, ({ hostname, port }) => console.log(`TecnoMarket listening on ${hostname}:${port}`));
