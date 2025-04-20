import { Request, Response, NextFunction } from "express";

export const createQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Forward the login request to user-service
    // POST req
    const downstreamRes = await axios.post(
      `${process.env.USER_SERVICE_API}/questions`,
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

export const getQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Forward the login request to user-service
    // GET req
    const downstreamRes = await axios.get(
      `${process.env.USER_SERVICE_API}/questions`,
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

export const getQuestionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const questionId = parseInt(req.params.id);
  try {
    // Forward the login request to user-service
    // POST req
    const downstreamRes = await axios.post(
      `${process.env.USER_SERVICE_API}/questions/${questionId}`,
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
