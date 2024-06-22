import { z } from "zod";

export const AcceptMesaageSchema = z.object({
  acceptMessages: z.boolean(),
});
