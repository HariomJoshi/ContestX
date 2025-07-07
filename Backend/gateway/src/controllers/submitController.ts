import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { pushSubmission } from "../queue/publisher";

export const submitCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Forward the submission request to submission-service

    // const downstreamRes = await axios.post(
    //   `${process.env.SUBMISSION_SERVICE_API}/submit`,
    //   req.body,
    //   { headers: { ...req.headers } } // preserve incoming headers
    // );

    // // Relay status code and JSON payload back to client
    // res
    //   .status(downstreamRes.status) // use status from Auth Service
    //   .json(downstreamRes.data); // forward response body

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
