import { z } from "zod";

export const UserValidation = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username can't exceed 50 characters" }),

  accessCode: z
    .string()
    .min(6, { message: "Access code must be at least 6 characters" })
    .max(100, { message: "Access code can't exceed 100 characters" }),
});

export const GetUserValidation = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(50, { message: "Username can't exceed 50 characters" }),
});
