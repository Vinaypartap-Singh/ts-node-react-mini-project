import { Response } from "express";
import { ZodError } from "zod";

export const formatError = (error: ZodError) => {
  let errors: { [key: string]: string } = {};
  error.errors?.map((error) => {
    errors[error.path?.[0]] = error.message;
  });

  return errors;
};

export const handleCatchError = (
  error: unknown,
  res: Response,
  errorMessage: string = "Validation Error"
) => {
  if (error instanceof ZodError) {
    const formattedError = formatError(error);
    return res.status(400).json({
      message: errorMessage || "validation error",
      error: formattedError,
    });
  }

  return res.status(500).json({
    message: error instanceof Error ? error.message : "An Error Occured",
    error: error instanceof Error ? error.message : "Unknown Error",
  });
};

export const handleTryResponseHandler = (
  res: Response,
  status: number = 200,
  message: string,
  data: object | null = null
) => {
  if (data) {
    return res.status(status || 200).json({
      message: message || "Common Try Response Error Handler",
      data: data,
    });
  }

  return res.status(status || 200).json({
    message: message || "Common Try Response Error Handler",
    data: {},
  });
};
