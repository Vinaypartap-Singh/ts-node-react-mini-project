import { Router } from "express";
import tasksRouter from "../controller/tasks.controller";
import UserRouter from "../controller/user.controller";

const routeHandler: Router = Router();

routeHandler.use("/api/tasks", tasksRouter);
routeHandler.use("/api/user", UserRouter);
export default routeHandler;
