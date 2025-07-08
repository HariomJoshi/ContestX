import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { pushSubmission } from "../queue/publisher";

export const submitCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const submission = req.body;
    await pushSubmission(submission); // { userId, code, lang, ... }
    res.status(202).json({ queued: true });
  } catch (err: any) {
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      // Unexpected error (network, coding, etc.)
      next(err);
    }
  }
};
