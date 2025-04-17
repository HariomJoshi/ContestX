// Backend/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

interface Error {
  status?: number;
  message?: string;
}

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  res.status(status).json({ message });
};

export default errorHandler;
