"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasks_controller_1 = __importDefault(require("../controller/tasks.controller"));
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const routeHandler = (0, express_1.Router)();
routeHandler.use("/api/tasks", tasks_controller_1.default);
routeHandler.use("/api/user", user_controller_1.default);
exports.default = routeHandler;
