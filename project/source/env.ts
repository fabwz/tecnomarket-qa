import { z } from "zod";

export const env = z.object({ PORT: z.coerce.number().int().default(3000) }).parse(Bun.env);
