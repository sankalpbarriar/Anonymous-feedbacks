import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "User name must be atleast 2 characters long")
  .max(20, "User name must be atmost 20 characters long")
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character"); //means username me ye saare characters hi hone chiye aur kuch nahi hone chaiye

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be at least 6 characters" }),
});
