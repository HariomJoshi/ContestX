// src/helper/submitQuestion.ts

import { PrismaClient } from "@prisma/client";
import { runQuestion } from "../helper/runQuestion";
import { SubmissionUpdate } from "../types/global";

const prisma = new PrismaClient();
interface Submission {
  code: string;
  language: string;
  questionId: string;
  userId: string;
  testCases?: any; // Optional, will be fetched from the database
}

export const submitCode = async (
  submission: Submission
): Promise<SubmissionUpdate | undefined> => {
  try {
    const { code, language, questionId, userId, testCases } = submission;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // 1. Fetch and parse test cases
    const question = await prisma.question.findUnique({
      where: { id: Number(questionId) },
      select: { testCases: true },
    });

    if (!question) {
      throw new Error("Question not found");
    }

    const parsedTestCases = JSON.parse(question.testCases);
    if (!Array.isArray(parsedTestCases) || parsedTestCases.length === 0) {
      throw new Error("Invalid test cases format");
    }

    submission.testCases = parsedTestCases;

    // 2. Run code using Judge0
    const runResult = await runQuestion({
      code,
      language,
      testCases: parsedTestCases,
    });

    if (!runResult || !runResult.result) {
      throw new Error("Failed to run code");
    }
    console.log(runResult);

    const result = runResult.result;
    const isAccepted = result.status.id === 3;
    // 3. Save submission
    console.log("userId:", userId);
    console.log("questionId:", questionId);
    const savedSubmission = await prisma.submissionQuestion.create({
      data: {
        verdict: isAccepted,
        code,
        User: { connect: { id: Number(userId) } },
        Question: { connect: { id: Number(questionId) } },
      },
    });

    // 4. Return result
    const response: SubmissionUpdate = {
      success: isAccepted,
      status:
        result.status.id === 3
          ? "accepted"
          : result.status.id === 4
          ? "wrong_answer"
          : result.status.id === 5
          ? "time_limit_exceeded"
          : result.status.id === 6
          ? "compilation_error"
          : "runtime_error",
      output: result.stdout ? result.stdout.trim() : "",
      error:
        result.stderr && result.status.id !== 3 ? result.stderr : undefined,
      time: result.time,
      memory: result.memory,
    };

    return response;
  } catch (error) {
    console.error("❌ submitQuestion error:", error);
    return {
      success: false,
      status: "server_error",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error during code submission",
    };
  }
};
