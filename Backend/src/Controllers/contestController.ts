import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createContest = async (req: Request, res: Response) => {
  try {
    const { title, description, startTime, endTime, questionIds } = req.body;

    // Calculate duration in minutes
    const duration = Math.round(
      (new Date(endTime).getTime() - new Date(startTime).getTime()) /
        (1000 * 60)
    );

    const contest = await prisma.contest.create({
      data: {
        title,
        description,
        duration,
        start_time: new Date(startTime),
        end_time: new Date(endTime),
        contestQuestions: {
          create: questionIds.map((questionId: number) => ({
            questionId,
          })),
        },
      },
      include: {
        contestQuestions: {
          include: {
            question: true,
          },
        },
      },
    });

    res.status(201).json(contest);
  } catch (error: any) {
    console.error("Error creating contest:", error);
    res.status(500).json({
      error: "Failed to create contest",
      details: error.message,
      code: error.code,
    });
  }
};

export const getContests = async (req: Request, res: Response) => {
  try {
    const contests = await prisma.contest.findMany({
      include: {
        contestQuestions: {
          include: {
            question: true,
          },
        },
      },
      orderBy: {
        start_time: "desc",
      },
    });

    res.json(contests);
  } catch (error: any) {
    console.error("Error fetching contests:", error);
    res.status(500).json({
      error: "Failed to fetch contests",
      details: error.message,
      code: error.code,
    });
  }
};

export const getContestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const contest = await prisma.contest.findUnique({
      where: { id: parseInt(id) },
      include: {
        contestQuestions: {
          include: {
            question: true,
          },
        },
      },
    });

    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    res.json(contest);
  } catch (error: any) {
    console.error("Error fetching contest:", error);
    res.status(500).json({
      error: "Failed to fetch contest",
      details: error.message,
      code: error.code,
    });
  }
};
