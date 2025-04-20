import { PrismaClient } from "@prisma/client";
import { runQuestion } from "../Helper/RunQuestion.js";
import axios from "axios";
import { TestCase, Judge0Response, Judge0Result } from "../types/global.js";
import { NextFunction, Request, Response } from "express";

export interface RunQuestionResponse {
  status?: Number;
  error?: String;
  result?: Judge0Result | null;
  expectedOutput?: String;
}

const prisma = new PrismaClient();
export const runCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Forward the login request to submission-service
    const downstreamRes = await axios.post(
      `${process.env.SUBMISSION_SERVICE_API}/run`,
      req.body,
      { headers: { ...req.headers } } // preserve incoming headers
    );

    // Relay status code and JSON payload back to client
    res
      .status(downstreamRes.status) // use status from Auth Service
      .json(downstreamRes.data); // forward response body
  } catch (err: any) {
    if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      // Unexpected error (network, coding, etc.)
      next(err);
    }
  }
};
