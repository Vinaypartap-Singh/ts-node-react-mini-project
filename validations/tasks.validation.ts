import { z } from "zod";

const StatusEnum = z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]);
const PriorityEnum = z.enum(["LOW", "NORMAL", "HIGH"]);

export const TaskValidation = z.object({
  username: z.string().min(6, { message: "Username is required" }),
  title: z
    .string()
    .min(6, "Title is required")
    .max(100, "Maximum limit exceeded"),
  description: z
    .string()
    .min(10, { message: "Description is required" })
    .max(120, { message: "Maximum limit exceeded" }),
  status: StatusEnum.optional(),
  priority: PriorityEnum.optional(),
  dueDate: z.coerce.date({ message: "Invalid date" }),
});

export const TaskUpdateValidation = z.object({
  taskId: z.string(),
  title: z
    .string()
    .min(6, "Title is required")
    .max(100, "Maximum limit exceeded")
    .optional(),
  description: z
    .string()
    .min(10, { message: "Description is required" })
    .max(120, { message: "Maximum limit exceeded" })
    .optional(),
  status: StatusEnum.optional(),
  priority: PriorityEnum.optional(),
  dueDate: z.coerce.date({ message: "Invalid date" }).optional(),
});

export const TaskDeleteValidation = z.object({
  taskId: z.string(),
});

export const TaskGetValidation = z.object({
  username: z.string(),
});
