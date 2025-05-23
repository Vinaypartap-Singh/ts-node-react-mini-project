import { Request, Response, Router } from "express";
import prisma from "../db/db.config";
import { handleCatchError, handleTryResponseHandler } from "../utils/helper";
import {
  ThoughtDeleteValidation,
  ThoughtUpdateValidation,
  ThoughtValidation,
} from "../validations/thought.validation";

const thoughtRouter: Router = Router();

thoughtRouter.post("/create", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = ThoughtValidation.parse(body);

    const newThought = await prisma.thoughts.create({
      data: {
        title: payload.title,
        content: payload.content,
      },
    });

    const socket = req.app.io;

    socket?.emit("thought_created", newThought);

    return handleTryResponseHandler(
      res,
      200,
      "Your thoughts added",
      newThought
    );
  } catch (error) {
    return handleCatchError(
      error,
      res,
      "An Error Occurred While Creating Task"
    );
  }
});

thoughtRouter.put("/update", async (req: Request, res: Response) => {
  try {
    const payload = ThoughtUpdateValidation.parse(req.body);

    const getThought = await prisma.thoughts.findUnique({
      where: {
        id: payload.thoughtId,
      },
    });

    if (!getThought) {
      return handleTryResponseHandler(res, 400, "Task Not Found");
    }

    const updatedThoughts = await prisma.thoughts.update({
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

    return handleTryResponseHandler(res, 200, "Task Updated");
  } catch (error) {
    return handleCatchError(error, res, "Unable to update task");
  }
});

thoughtRouter.delete("/delete", async (req: Request, res: Response) => {
  try {
    const payload = ThoughtDeleteValidation.parse(req.body);

    const task = await prisma.thoughts.findUnique({
      where: {
        id: payload.thoughtId,
      },
    });

    if (!task) {
      return handleTryResponseHandler(res, 400, "Not Found");
    }

    const deletedThoughts = await prisma.thoughts.delete({
      where: {
        id: payload.thoughtId,
      },
    });

    const socket = req.app.io;
    socket?.emit("thought_deleted", deletedThoughts);

    return handleTryResponseHandler(res, 200, "Thought Deleted");
  } catch (error) {
    return handleCatchError(error, res, "Error while deleting tasks");
  }
});

thoughtRouter.get("/list", async (req: Request, res: Response) => {
  try {
    const tasks = await prisma.thoughts.findMany({});

    return handleTryResponseHandler(res, 200, "Tasks", tasks);
  } catch (error) {
    return handleCatchError(error, res, "Error while fetching your tasks");
  }
});

export default thoughtRouter;
