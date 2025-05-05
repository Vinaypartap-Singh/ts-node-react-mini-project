"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasksRouter = (0, express_1.Router)();
tasksRouter.post("/create", (req, res) => {
    const tasks = {
        name: "Task 1",
        description: "Task Description",
    };
    res.send(tasks);
});
exports.default = tasksRouter;
