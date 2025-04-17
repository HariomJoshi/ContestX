// src/middleware/authorize.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Request interface to include a 'user' property
export interface AuthenticatedRequest extends Request {
  user?: any; // You can define a more specific type based on your token payload
}

const authorize = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Retrieve the token from the Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authorization token not provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret key from your environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Attach the decoded payload to the request object
    req.user = decoded;
    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return an Unauthorized response
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authorize;
