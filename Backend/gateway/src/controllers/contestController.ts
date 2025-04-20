import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const createContest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Forward the login request to submission-service

    const downstreamRes = await axios.post(
      `${process.env.USER_SERVICE_API}/contests`,
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

export const getContests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Forward the login request to submission-service

    const downstreamRes = await axios.get(
      `${process.env.USER_SERVICE_API}/contests`,
      req.body
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

export const getContestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, userId } = req.params;
  try {
    // Forward the login request to submission-service

    const downstreamRes = await axios.get(
      `${process.env.USER_SERVICE_API}/contests/${id}/${userId}`,
      req.body
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
