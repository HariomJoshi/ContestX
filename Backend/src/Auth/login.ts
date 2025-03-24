import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { date, z } from "zod";
import { hashPassword, verifyPassword } from "../Helper/Hash.js";

const router = Router();
const pClient = new PrismaClient();

// Define a schema for login validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

// Define a schema for signup validation
const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  firstname: z.string().min(1, { message: "Firstname cannot be empty" }),
  lastname: z.string(),
});

// GET /login route using query parameters (for demo purposes)
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate query parameters using the loginSchema
      const credentials = loginSchema.parse(req.body);
      // console.log(credentials);

      // Simulate authentication (replace with real logic)
      const password = await hashPassword(credentials.password);
      // const user = await pClient.user.findFirst({
      //   where: {
      //     email: credentials.email,
      //   },
      // });
      const userfound = await pClient.user.findFirst({
        where: {
          email: credentials.email,
        },
      });
      if (userfound === null) {
        // res.status(400).json({ message: "Invalid credentials" });
        next({ status: 401, message: "Invalid Credentials" });
        return;
      }

      const verified = await verifyPassword(
        req.body.password,
        userfound.password
      );
      const token = jwt.sign(
        { userId: userfound.id, email: userfound.email },
        process.env.JWT_SECRET!, // Ensure JWT_SECRET is set in your environment
        { expiresIn: "1h" } // Token expires in 1 hour
      );

      if (userfound !== null && verified) {
        res.status(200).json({
          message: "Login successful",
          userId: userfound.id,
          token: token,
          // just sending ID on successful login
        });
      } else {
        // res.status(401).json({ message: "Invalid credentials" });
        next({ status: 401, message: "Invalid Credentials" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        next({ status: 400, error: error.errors });
      } else {
        next({ status: 500, message: "Internal server error" });
      }
    }
  }
);

// POST /signup route to register a new user
router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body using the signupSchema
      // console.log(req.body);
      const userData = signupSchema.parse(req.body);

      const password: string = await hashPassword(userData.password);
      const data = {
        firstName: userData.firstname,
        lastName: userData.lastname,
        username: userData.email.split("@")[0],
        email: userData.email,
        password: password,
      };
      const newUser = await pClient.user.create({
        data,
      });
      // console.log(newUser);
      res.status(201).json({
        message: "User created successfully",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        next({ staus: 400, error: error.errors });
      } else {
        next({
          status: 500,
          message: "DB check kar le, kya pata na kaam kar raha ho!",
        });
      }
    }
  }
);

export default router;
