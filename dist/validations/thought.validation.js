"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThoughtDeleteValidation = exports.ThoughtUpdateValidation = exports.ThoughtValidation = void 0;
const zod_1 = require("zod");
exports.ThoughtValidation = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(6, "Title is required")
        .max(100, "Maximum limit exceeded"),
    content: zod_1.z
        .string()
        .min(10, { message: "Description is required" })
        .max(120, { message: "Maximum limit exceeded" }),
});
exports.ThoughtUpdateValidation = zod_1.z.object({
    thoughtId: zod_1.z.string(),
    title: zod_1.z
        .string()
        .min(6, "Title is required")
        .max(100, "Maximum limit exceeded")
        .optional(),
    content: zod_1.z
        .string()
        .min(10, { message: "Description is required" })
        .max(120, { message: "Maximum limit exceeded" })
        .optional(),
});
exports.ThoughtDeleteValidation = zod_1.z.object({
    thoughtId: zod_1.z.string(),
});
