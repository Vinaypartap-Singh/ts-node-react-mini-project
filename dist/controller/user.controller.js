"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express");
const db_config_1 = __importDefault(require("../db/db.config"));
const helper_1 = require("../utils/helper");
const user_validation_1 = require("../validations/user.validation");
const UserRouter = (0, express_1.Router)();
UserRouter.post("/new", async (req, res) => {
    try {
        const payload = user_validation_1.UserValidation.parse(req.body);
        const username = payload.username.trim().replaceAll(" ", "-").toLowerCase();
        const existingUser = await db_config_1.default.user.findUnique({
            where: {
                username: username,
            },
        });
        if (existingUser) {
            return (0, helper_1.handleTryResponseHandler)(res, 400, "Username Already Taken");
        }
        const salt = bcryptjs_1.default.genSaltSync(16);
        const hashedCode = bcryptjs_1.default.hashSync(payload.accessCode, salt);
        await db_config_1.default.user.create({
            data: {
                username: username,
                accessCode: hashedCode,
            },
        });
        return (0, helper_1.handleTryResponseHandler)(res, 201, "User Created Success");
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "An Error Occureed while creating USer");
    }
});
UserRouter.put("/update/:username", async (req, res) => {
    try {
        const payload = user_validation_1.UserValidation.parse(req.body);
        const paramUsername = req.params.username
            .replaceAll(" ", "-")
            .toLowerCase();
        const formattedUsername = payload.username
            .replaceAll(" ", "-")
            .toLowerCase();
        const user = await db_config_1.default.user.findUnique({
            where: {
                username: paramUsername,
            },
        });
        if (!user) {
            return (0, helper_1.handleTryResponseHandler)(res, 400, "User Not Found");
        }
        const validAccessCode = bcryptjs_1.default.compareSync(payload.accessCode, user.accessCode);
        if (!validAccessCode) {
            return (0, helper_1.handleTryResponseHandler)(res, 400, "Incorrect Username or Access Code");
        }
        const existingUser = await db_config_1.default.user.findUnique({
            where: {
                username: formattedUsername,
            },
        });
        if (existingUser && existingUser.id !== user.id) {
            return (0, helper_1.handleTryResponseHandler)(res, 400, "User with this name already exist");
        }
        await db_config_1.default.$transaction([
            db_config_1.default.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    username: formattedUsername,
                    accessCode: payload.accessCode,
                },
            }),
            db_config_1.default.task.updateMany({
                where: { username: req.params.username },
                data: { username: formattedUsername },
            }),
        ]);
        return (0, helper_1.handleTryResponseHandler)(res, 200, "Your Account Information Updated");
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "An Error Occured while updating.");
    }
});
UserRouter.delete("/delete", async (req, res) => {
    try {
        const payload = user_validation_1.UserValidation.parse(req.body);
        const formattedUsername = payload.username
            .trim()
            .replaceAll(" ", "-")
            .toLowerCase();
        const user = await db_config_1.default.user.findUnique({
            where: {
                username: formattedUsername,
            },
        });
        if (!user) {
            return (0, helper_1.handleTryResponseHandler)(res, 404, "User not found");
        }
        const isAccessCodeValid = bcryptjs_1.default.compareSync(payload.accessCode, user.accessCode);
        if (!isAccessCodeValid) {
            return (0, helper_1.handleTryResponseHandler)(res, 401, "Incorrect access code");
        }
        await db_config_1.default.user.delete({
            where: {
                id: user.id,
            },
        });
        return (0, helper_1.handleTryResponseHandler)(res, 200, "User and tasks deleted successfully");
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "Error while deleting user");
    }
});
UserRouter.get("/info", async (req, res) => {
    try {
        const payload = user_validation_1.GetUserValidation.parse(req.body);
        const formattedUsername = payload.username
            .replaceAll(" ", "-")
            .toLowerCase();
        const user = await db_config_1.default.user.findUnique({
            where: {
                username: formattedUsername,
            },
        });
        if (!user) {
            return (0, helper_1.handleTryResponseHandler)(res, 400, "User Not Found.");
        }
        const userInfo = await db_config_1.default.user.findUnique({
            where: {
                username: formattedUsername,
            },
            include: {
                tasks: true,
            },
        });
        return (0, helper_1.handleTryResponseHandler)(res, 200, "Success", userInfo);
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "Error occured while getting user info");
    }
});
exports.default = UserRouter;
