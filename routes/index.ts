import { Router } from "express";
import tasksRouter from "../controller/tasks.controller";
import thoughtRouter from "../controller/thoughts.controller";
import UserRouter from "../controller/user.controller";

const routeHandler: Router = Router();

routeHandler.use("/api/tasks", tasksRouter);
routeHandler.use("/api/user", UserRouter);
routeHandler.use("/api/thoughts", thoughtRouter);
export default routeHandler;
