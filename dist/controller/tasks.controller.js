"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_config_1 = __importDefault(require("../db/db.config"));
const helper_1 = require("../utils/helper");
const tasks_validation_1 = require("../validations/tasks.validation");
const tasksRouter = (0, express_1.Router)();
tasksRouter.post("/create", async (req, res) => {
    try {
        const body = req.body;
        const payload = tasks_validation_1.TaskValidation.parse(body);
        const username = payload.username.replace(" ", "-").toLowerCase();
        const newTask = await db_config_1.default.task.create({
            data: {
                username: username,
                title: payload.title,
                description: payload.description,
                dueDate: payload.dueDate,
            },
        });
        return (0, helper_1.handleTryResponseHandler)(res, 200, "Task Created Successfully", newTask);
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "An Error Occurred While Creating Task");
    }
});
tasksRouter.put("update", async (req, res) => {
    try {
        const payload = tasks_validation_1.TaskUpdateValidation.parse(req.body);
        const getTask = await db_config_1.default.task.findUnique({
            where: {
                id: payload.taskId,
            },
        });
        if (!getTask) {
            return (0, helper_1.handleTryResponseHandler)(res, 400, "Task Not Found");
        }
        await db_config_1.default.task.update({
            where: {
                id: payload.taskId,
            },
            data: {
                title: payload.title,
                description: payload.description,
                status: payload.status,
                priority: payload.priority,
                dueDate: payload.dueDate,
            },
        });
        return (0, helper_1.handleTryResponseHandler)(res, 200, "Task Updated");
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "Unable to update task");
    }
});
tasksRouter.delete("/delete", async (req, res) => {
    try {
        const payload = tasks_validation_1.TaskDeleteValidation.parse(req.body);
        const task = await db_config_1.default.task.findUnique({
            where: {
                id: payload.taskId,
            },
        });
        if (!task) {
            return (0, helper_1.handleTryResponseHandler)(res, 400, "Not Found");
        }
        await db_config_1.default.user.delete({
            where: {
                id: payload.taskId,
            },
        });
        return (0, helper_1.handleTryResponseHandler)(res, 200, "Task Deleted");
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "Error while deleting tasks");
    }
});
tasksRouter.get("/list/:username", async (req, res) => {
    try {
        const payload = tasks_validation_1.TaskGetValidation.parse(req.params);
        const formattedUsername = payload.username
            .replaceAll(" ", "-")
            .toLowerCase();
        const tasks = await db_config_1.default.task.findMany({
            where: {
                username: formattedUsername,
            },
        });
        return (0, helper_1.handleTryResponseHandler)(res, 200, "Tasks", tasks);
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "Error while fetching your tasks");
    }
});
exports.default = tasksRouter;
