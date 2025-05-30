import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Forward the login request to auth-service

    const downstreamRes = await axios.post(
      `${process.env.AUTH_SERVICE_API}/login`,
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

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Forward the login request to auth-service
    console.log(req.body);
    const downstreamRes = await axios.post(
      `${process.env.AUTH_SERVICE_API}/signup`,
      req.body,
      { headers: { ...req.headers } } // preserve incoming headers
    );

    // Relay status code and JSON payload back to client
    res
      .status(downstreamRes.status) // use status from Auth Service
      .json(downstreamRes.data); // forward response body
  } catch (err: any) {
    if (err.response) {
      // Auth Service returned an error status (e.g., 401)
      res.status(err.response.status).json(err.response.data);
    } else {
      // Unexpected error (network, coding, etc.)
      next(err);
    }
  }
};
