import { NextFunction, Request, Response } from "express";
import axios from "axios";

export const getBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Forward the login request to submission-service

    const downstreamRes = await axios.get(
      `${process.env.USER_SERVICE_API}/getBlogs`,
      req.body // preserve incoming headers
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
