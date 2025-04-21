import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { hashPassword, verifyPassword } from "../Helper/Hash";
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

export const login = async (req: Request, res: Response) => {
  try {
    const credentials = loginSchema.parse(req.body);

    const userfound = await pClient.user.findFirst({
      where: { email: credentials.email },
    });

    if (!userfound) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const verified = await verifyPassword(
      req.body.password,
      userfound.password
    );

    if (!verified) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = jwt.sign(
      { userId: userfound.id, email: userfound.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login successful",
      userId: userfound.id,
      token: token,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const userData = signupSchema.parse(req.body);
    const password: string = await hashPassword(userData.password);

    const data = {
      firstName: userData.firstname,
      lastName: userData.lastname,
      username: userData.email.split("@")[0],
      email: userData.email,
      password: password,
    };
    console.log("Here");
    const newUser = await pClient.user.create({ data });
    console.log(newUser);

    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    return res.status(500).json({
      message: "DB check kar le, kya pata na kaam kar raha ho!",
    });
  }
};
