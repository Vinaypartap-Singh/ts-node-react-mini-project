"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_controller_1 = __importDefault(require("../controller/tasks.controller"));
const RouteHandler = (0, express_1.Router)();
RouteHandler.use("/tasks", tasks_controller_1.default);
exports.default = RouteHandler;
