import { createApp } from "@app/app";
import { env } from "@env";
import { createDock } from "./server.dock";

createApp(createDock()).listen(env.PORT, ({ hostname, port }) => console.log(`TecnoMarket listening on ${hostname}:${port}`));
