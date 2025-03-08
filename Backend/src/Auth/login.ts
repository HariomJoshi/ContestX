import { Router, Request, Response } from "express";
import { PrismaClient, PrismaPromise, User } from "@prisma/client";
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
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  firstname: z.string().min(1, { message: "Firstname cannot be empty" }),
  lastname: z.string().min(1, { message: "Lastname cannot be empty" }),
});

// GET /login route using query parameters (for demo purposes)
router.get("/login", async (req: Request, res: Response) => {
  try {
    // Validate query parameters using the loginSchema
    const credentials = loginSchema.parse(req.body);
    // console.log(credentials);

    // Simulate authentication (replace with real logic)
    const password = await hashPassword(credentials.password);
    const user = await pClient.user.findFirst({
      where: {
        email: credentials.email,
      },
    });
    if (user === null) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const verified = await verifyPassword(req.body.password, user.password);
    if (user !== null && verified) {
      res.status(200).json({
        message: "Login successful",
        user: user,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// POST /signup route to register a new user
router.post("/signup", async (req: Request, res: Response) => {
  try {
    // Validate the request body using the signupSchema
    const userData = signupSchema.parse(req.body);
    // const userData = req.body;
    // console.log(userData);

    const password: string = await hashPassword(userData.password);
    const newUser = await pClient.user.create({
      data: {
        firstName: userData.firstname,
        lastName: userData.lastname,
        email: userData.email,
        password: password,
        username: userData.username,
      },
    });
    // console.log(newUser);
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

export default router;
