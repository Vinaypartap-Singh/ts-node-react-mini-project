import bcrypt from "bcryptjs";
import { Request, Response, Router } from "express";
import prisma from "../db/db.config";
import { handleCatchError, handleTryResponseHandler } from "../utils/helper";
import {
  GetUserValidation,
  UserValidation,
} from "../validations/user.validation";

const UserRouter: Router = Router();

UserRouter.post("/new", async (req: Request, res: Response) => {
  try {
    const payload = UserValidation.parse(req.body);
    const username = payload.username.trim().replaceAll(" ", "-").toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!existingUser) {
      return handleTryResponseHandler(res, 400, "Username Already Taken");
    }

    // Check If Existing User Info is correct or not if not correct then already taken or incorrect details error

    const validAccessCode = bcrypt.compareSync(
      payload.accessCode,
      existingUser.accessCode
    );

    if (!validAccessCode) {
      return handleTryResponseHandler(
        res,
        400,
        "Incorrect Username or Access Code"
      );
    }

    const data = {
      username,
    };

    if (existingUser && validAccessCode) {
      return handleTryResponseHandler(res, 200, "Account Logged In", data);
    }

    // If not exist then create new user below

    const salt = bcrypt.genSaltSync(16);

    const hashedCode = bcrypt.hashSync(payload.accessCode, salt);

    await prisma.user.create({
      data: {
        username: username,
        accessCode: hashedCode,
      },
    });

    return handleTryResponseHandler(res, 200, "User Created Success");
  } catch (error) {
    return handleCatchError(
      error,
      res,
      "An Error Occureed while creating User"
    );
  }
});

UserRouter.put("/update/:username", async (req: Request, res: Response) => {
  try {
    const payload = UserValidation.parse(req.body);

    const paramUsername = req.params.username
      .replaceAll(" ", "-")
      .toLowerCase();

    const formattedUsername = payload.username
      .replaceAll(" ", "-")
      .toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        username: paramUsername,
      },
    });

    if (!user) {
      return handleTryResponseHandler(res, 400, "User Not Found");
    }

    const validAccessCode = bcrypt.compareSync(
      payload.accessCode,
      user.accessCode
    );

    if (!validAccessCode) {
      return handleTryResponseHandler(
        res,
        400,
        "Incorrect Username or Access Code"
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        username: formattedUsername,
      },
    });

    if (existingUser && existingUser.id !== user.id) {
      return handleTryResponseHandler(
        res,
        400,
        "User with this name already exist"
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          username: formattedUsername,
          accessCode: payload.accessCode,
        },
      }),
      prisma.task.updateMany({
        where: { username: req.params.username },
        data: { username: formattedUsername },
      }),
    ]);

    return handleTryResponseHandler(
      res,
      200,
      "Your Account Information Updated"
    );
  } catch (error) {
    return handleCatchError(error, res, "An Error Occured while updating.");
  }
});

UserRouter.delete("/delete", async (req: Request, res: Response) => {
  try {
    const payload = UserValidation.parse(req.body);
    const formattedUsername = payload.username
      .trim()
      .replaceAll(" ", "-")
      .toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        username: formattedUsername,
      },
    });

    if (!user) {
      return handleTryResponseHandler(res, 400, "User not found");
    }

    const isAccessCodeValid = bcrypt.compareSync(
      payload.accessCode,
      user.accessCode
    );
    if (!isAccessCodeValid) {
      return handleTryResponseHandler(res, 400, "Incorrect access code");
    }

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });

    return handleTryResponseHandler(
      res,
      200,
      "User and tasks deleted successfully"
    );
  } catch (error) {
    return handleCatchError(error, res, "Error while deleting user");
  }
});

UserRouter.get("/info", async (req: Request, res: Response) => {
  try {
    const payload = GetUserValidation.parse(req.body);
    const formattedUsername = payload.username
      .replaceAll(" ", "-")
      .toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        username: formattedUsername,
      },
    });

    if (!user) {
      return handleTryResponseHandler(res, 400, "User Not Found.");
    }

    const userInfo = await prisma.user.findUnique({
      where: {
        username: formattedUsername,
      },
      include: {
        tasks: true,
      },
    });

    return handleTryResponseHandler(res, 200, "Success", userInfo);
  } catch (error) {
    return handleCatchError(
      error,
      res,
      "Error occured while getting user info"
    );
  }
});

export default UserRouter;
