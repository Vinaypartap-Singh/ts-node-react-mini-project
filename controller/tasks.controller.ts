import { Request, Response, Router } from "express";
import prisma from "../db/db.config";
import { handleCatchError, handleTryResponseHandler } from "../utils/helper";
import { TaskValidation } from "../validations/tasks.validation";

const tasksRouter: Router = Router();

tasksRouter.post("/create", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = TaskValidation.parse(body);

    const username = payload.username.replace(" ", "-").toLowerCase();

    const newTask = await prisma.task.create({
      data: {
        username: username,
        title: payload.title,
        description: payload.description,
        dueDate: payload.dueDate,
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

// Get All Tasks Of The User

export default tasksRouter;
