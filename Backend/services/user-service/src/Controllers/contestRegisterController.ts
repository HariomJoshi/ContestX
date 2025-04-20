import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const registerUserForContest = async (req: Request, res: Response) => {
  try {
    const { userId, contestId } = req.body;
    console.log(userId);
    console.log(contestId);

    // Check if user and contest exist
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    const contest = await prisma.contest.findUnique({
      where: { id: Number(contestId) },
    });

    if (!user || !contest) {
      return res.status(404).json({ error: "User or Contest not found" });
    }

    // Check if user is already registered
    const existingRegistration = await prisma.userContests.findUnique({
      where: {
        userId_contestId: {
          userId: Number(userId),
          contestId: Number(contestId),
        },
      },
    });

    if (existingRegistration) {
      return res
        .status(400)
        .json({ error: "User already registered for this contest" });
    }

    // Register user for contest
    const registration = await prisma.userContests.create({
      data: {
        user: { connect: { id: Number(userId) } },
        contest: { connect: { id: Number(contestId) } },
      },
    });

    res.status(201).json({
      message: "Successfully registered for contest",
      registration,
    });
  } catch (error) {
    console.error("Error registering user for contest:", error);
    res.status(500).json({ error: "Failed to register for contest" });
  }
};
