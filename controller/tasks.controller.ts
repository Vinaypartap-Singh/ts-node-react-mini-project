import { Request, Response, Router } from "express";
import prisma from "../db/db.config";
import { handleCatchError, handleTryResponseHandler } from "../utils/helper";
import {
  TaskDeleteValidation,
  TaskGetValidation,
  TaskUpdateValidation,
  TaskValidation,
} from "../validations/tasks.validation";

const tasksRouter: Router = Router();

tasksRouter.post("/create", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = TaskValidation.parse(body);

    const username = payload.username.replace(" ", "-").toLowerCase();

    console.log(payload);

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return handleTryResponseHandler(res, 400, "User Not Found");
    }

    const newTask = await prisma.task.create({
      data: {
        username: username,
        title: payload.title,
        description: payload.description,
        dueDate: payload.dueDate,
        priority: payload.priority,
        status: payload.status,
      },
    });

    return handleTryResponseHandler(
      res,
      200,
      "Task Created Successfully",
      newTask
    );
  } catch (error) {
    return handleCatchError(
      error,
      res,
      "An Error Occurred While Creating Task"
    );
  }
});

tasksRouter.put("/update", async (req: Request, res: Response) => {
  try {
    const payload = TaskUpdateValidation.parse(req.body);

    const getTask = await prisma.task.findUnique({
      where: {
        id: payload.taskId,
      },
    });

    if (!getTask) {
      return handleTryResponseHandler(res, 400, "Task Not Found");
    }

    await prisma.task.update({
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

    return handleTryResponseHandler(res, 200, "Task Updated");
  } catch (error) {
    return handleCatchError(error, res, "Unable to update task");
  }
});

tasksRouter.delete("/delete", async (req: Request, res: Response) => {
  try {
    const payload = TaskDeleteValidation.parse(req.body);

    const task = await prisma.task.findUnique({
      where: {
        id: payload.taskId,
      },
    });

    if (!task) {
      return handleTryResponseHandler(res, 400, "Not Found");
    }

    await prisma.user.delete({
      where: {
        id: payload.taskId,
      },
    });

    return handleTryResponseHandler(res, 200, "Task Deleted");
  } catch (error) {
    return handleCatchError(error, res, "Error while deleting tasks");
  }
});

tasksRouter.get("/list/:username", async (req: Request, res: Response) => {
  try {
    const payload = TaskGetValidation.parse(req.params);
    const formattedUsername = payload.username
      .replaceAll(" ", "-")
      .toLowerCase();

    const tasks = await prisma.task.findMany({
      where: {
        username: formattedUsername,
      },
      orderBy: {
        status: "asc",
      },
    });

    return handleTryResponseHandler(res, 200, "Tasks", tasks);
  } catch (error) {
    return handleCatchError(error, res, "Error while fetching your tasks");
  }
});

export default tasksRouter;
