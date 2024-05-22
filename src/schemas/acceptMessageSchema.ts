import { z } from "zod";

export const AcceptMesaagesSchema = z.object({
  acceptMessages: z.boolean(),
});
