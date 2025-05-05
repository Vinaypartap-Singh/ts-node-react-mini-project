import { Router } from "express";
import tasksRouter from "../controller/tasks.controller";

const routeHandler: Router = Router();

routeHandler.use("/api/tasks", tasksRouter);

export default routeHandler;
