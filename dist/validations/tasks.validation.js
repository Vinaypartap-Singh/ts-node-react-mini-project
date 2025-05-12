"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskGetValidation = exports.TaskDeleteValidation = exports.TaskUpdateValidation = exports.TaskValidation = void 0;
const zod_1 = require("zod");
const StatusEnum = zod_1.z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]);
const PriorityEnum = zod_1.z.enum(["LOW", "NORMAL", "HIGH"]);
exports.TaskValidation = zod_1.z.object({
    username: zod_1.z.string().min(5, { message: "Username is required" }),
    title: zod_1.z
        .string()
        .min(6, "Title is required")
        .max(100, "Maximum limit exceeded"),
    description: zod_1.z
        .string()
        .min(10, { message: "Description is required" })
        .max(120, { message: "Maximum limit exceeded" }),
    status: StatusEnum.optional(),
    priority: PriorityEnum.optional(),
    dueDate: zod_1.z.coerce.date({ message: "Invalid date" }),
});
exports.TaskUpdateValidation = zod_1.z.object({
    taskId: zod_1.z.string(),
    title: zod_1.z
        .string()
        .min(6, "Title is required")
        .max(100, "Maximum limit exceeded")
        .optional(),
    description: zod_1.z
        .string()
        .min(10, { message: "Description is required" })
        .max(120, { message: "Maximum limit exceeded" })
        .optional(),
    status: StatusEnum.optional(),
    priority: PriorityEnum.optional(),
    dueDate: zod_1.z.coerce.date({ message: "Invalid date" }).optional(),
});
exports.TaskDeleteValidation = zod_1.z.object({
    taskId: zod_1.z.string(),
});
exports.TaskGetValidation = zod_1.z.object({
    username: zod_1.z.string(),
});
