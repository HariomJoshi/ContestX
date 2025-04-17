import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { runQuestion } from "../Helper/RunQuestion.js";

const prisma = new PrismaClient();

export const submitQuestion = async (req: Request, res: Response) => {
  try {
    const { code, language, questionId, contestId, userId } = req.body;
    console.log(userId);
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Fetch and parse test cases
    const question = await prisma.question.findUnique({
      where: { id: Number(questionId) },
      select: { testCases: true },
    });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    const parsedTestCases = JSON.parse(question.testCases);
    if (!Array.isArray(parsedTestCases) || parsedTestCases.length === 0) {
      return res.status(400).json({ error: "Invalid test cases format" });
    }

    // Add test cases to request body
    req.body.testCases = parsedTestCases;

    // First run the code using RunQuestion
    const runResult = await runQuestion(req);

    if (!runResult || !runResult.result) {
      return res.status(500).json({ error: "Failed to run code" });
    }

    // Check if the submission passed all test cases
    const isAccepted = runResult.result.status.id === 3;

    // Save the submission to the database
    const submission = await prisma.submissionQuestion.upsert({
      where: {
        userId_questionId: {
          userId,
          questionId: Number(questionId),
        },
      },
      update: {
        verdict: isAccepted,
        code,
        time: new Date(),
      },
      create: {
        userId,
        questionId: Number(questionId),
        verdict: isAccepted,
        code,
      },
    });

    // Return the result
    res.json({
      success: isAccepted,
      message: isAccepted ? "All test cases passed!" : "Some test cases failed",
      output: runResult.result.stdout,
      submission,
    });
  } catch (error: any) {
    console.error("Error submitting code:", error);
    res.status(500).json({
      error: "Failed to submit code",
      details: error.message,
    });
  }
};
