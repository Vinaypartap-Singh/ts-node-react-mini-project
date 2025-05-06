"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserValidation = exports.UserValidation = void 0;
const zod_1 = require("zod");
exports.UserValidation = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(50, { message: "Username can't exceed 50 characters" }),
    accessCode: zod_1.z
        .string()
        .min(6, { message: "Access code must be at least 6 characters" })
        .max(100, { message: "Access code can't exceed 100 characters" }),
});
exports.GetUserValidation = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(50, { message: "Username can't exceed 50 characters" }),
});
