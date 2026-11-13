import { z } from "zod";

export const viewProductParams = z.object({ id: z.string().min(1, "Product id is required") });

export type ViewProductParams = z.infer<typeof viewProductParams>;
