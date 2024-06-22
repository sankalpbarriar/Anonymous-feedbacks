import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "message must be at least 10 characters" })
    .max(300, { message: "message cant go beyond 300 characters" }),
});
