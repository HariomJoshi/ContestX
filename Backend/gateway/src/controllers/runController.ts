import axios from "axios";
import { TestCase, Judge0Response, Judge0Result } from "../types/global";
import { NextFunction, Request, Response } from "express";
import { pushRun } from "../queue/publisher";

export interface RunQuestionResponse {
  status?: Number;
  error?: String;
  result?: Judge0Result | null;
  expectedOutput?: String;
}
export const runCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Forward the run request to submission-service
    // const downstreamRes = await axios.post(
    //   `${process.env.SUBMISSION_SERVICE_API}/run`,
    //   req.body,
    //   { headers: { ...req.headers } } // preserve incoming headers
    // );

    // // Relay status code and JSON payload back to client
    // res
    //   .status(downstreamRes.status) // use status from Auth Service
    //   .json(downstreamRes.data); // forward response body

    const submission = req.body;
    await pushRun(submission); // { userId, code, lang, ... }
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
