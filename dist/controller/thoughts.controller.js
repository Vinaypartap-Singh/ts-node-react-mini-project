"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_config_1 = __importDefault(require("../db/db.config"));
const helper_1 = require("../utils/helper");
const thought_validation_1 = require("../validations/thought.validation");
const thoughtRouter = (0, express_1.Router)();
thoughtRouter.post("/create", async (req, res) => {
    try {
        const body = req.body;
        const payload = thought_validation_1.ThoughtValidation.parse(body);
        const newThought = await db_config_1.default.thoughts.create({
            data: {
                title: payload.title,
                content: payload.content,
            },
        });
        const socket = req.app.io;
        socket?.emit("thought_created", newThought);
        return (0, helper_1.handleTryResponseHandler)(res, 200, "Your thoughts added", newThought);
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "An Error Occurred While Creating Task");
    }
});
thoughtRouter.put("/update", async (req, res) => {
    try {
        const payload = thought_validation_1.ThoughtUpdateValidation.parse(req.body);
        const getThought = await db_config_1.default.thoughts.findUnique({
            where: {
                id: payload.thoughtId,
            },
        });
        if (!getThought) {
            return (0, helper_1.handleTryResponseHandler)(res, 400, "Task Not Found");
        }
        const updatedThoughts = await db_config_1.default.thoughts.update({
            where: {
                id: payload.thoughtId,
            },
            data: {
                title: payload.title,
                content: payload.content,
            },
        });
        const socket = req.app.io;
        socket?.emit("thought_updated", updatedThoughts);
        return (0, helper_1.handleTryResponseHandler)(res, 200, "Task Updated");
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "Unable to update task");
    }
});
thoughtRouter.delete("/delete", async (req, res) => {
    try {
        const payload = thought_validation_1.ThoughtDeleteValidation.parse(req.body);
        const task = await db_config_1.default.thoughts.findUnique({
            where: {
                id: payload.thoughtId,
            },
        });
        if (!task) {
            return (0, helper_1.handleTryResponseHandler)(res, 400, "Not Found");
        }
        const deletedThoughts = await db_config_1.default.thoughts.delete({
            where: {
                id: payload.thoughtId,
            },
        });
        const socket = req.app.io;
        socket?.emit("thought_deleted", deletedThoughts);
        return (0, helper_1.handleTryResponseHandler)(res, 200, "Thought Deleted");
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "Error while deleting tasks");
    }
});
thoughtRouter.get("/list", async (req, res) => {
    try {
        const tasks = await db_config_1.default.thoughts.findMany({});
        return (0, helper_1.handleTryResponseHandler)(res, 200, "Tasks", tasks);
    }
    catch (error) {
        return (0, helper_1.handleCatchError)(error, res, "Error while fetching your tasks");
    }
});
exports.default = thoughtRouter;
