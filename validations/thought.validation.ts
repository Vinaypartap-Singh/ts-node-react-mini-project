import { z } from "zod";

export const ThoughtValidation = z.object({
  title: z
    .string()
    .min(6, "Title is required")
    .max(100, "Maximum limit exceeded"),
  content: z
    .string()
    .min(10, { message: "Description is required" })
    .max(120, { message: "Maximum limit exceeded" }),
});

export const ThoughtUpdateValidation = z.object({
  thoughtId: z.string(),
  title: z
    .string()
    .min(6, "Title is required")
    .max(100, "Maximum limit exceeded")
    .optional(),
  content: z
    .string()
    .min(10, { message: "Description is required" })
    .max(120, { message: "Maximum limit exceeded" })
    .optional(),
});

export const ThoughtDeleteValidation = z.object({
  thoughtId: z.string(),
});
