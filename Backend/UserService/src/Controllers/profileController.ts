import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfileData = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Fetch user profile data
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        rating_changed: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch user's submissions
    const submissions = await prisma.submissionQuestion.findMany({
      where: { userId: Number(userId) },
      include: {
        question: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        time: "desc",
      },
    });

    // Fetch contests participated
    const contests = await prisma.userContests.findMany({
      where: { userId: Number(userId) },
      include: {
        contest: {
          select: {
            title: true,
            start_time: true,
            end_time: true,
          },
        },
      },
      orderBy: {
        contest: {
          start_time: "desc",
        },
      },
    });

    // Format the response
    const formattedSubmissions = submissions.map((sub) => ({
      id: `${sub.userId}-${sub.questionId}`,
      question: sub.question.title,
      status: sub.verdict ? "Accepted" : "Wrong Answer",
      time: sub.time.toISOString(),
    }));

    const formattedContests = contests.map((contest) => ({
      id: contest.contestId.toString(),
      name: contest.contest.title,
      participatedOn: contest.contest.start_time.toISOString(),
    }));

    res.json({
      profile: {
        name: `${user.firstName} ${user.lastName}`,
        username: user.username,
        email: user.email,
      },
      ratings: user.rating_changed,
      submissions: formattedSubmissions,
      contests: formattedContests,
    });
  } catch (error: any) {
    console.error("Error fetching profile data:", error);
    res.status(500).json({
      error: "Failed to fetch profile data",
      details: error.message,
    });
  }
};
