import { PrismaClient } from "@prisma/client";
import { runQuestion } from "../helper/runQuestion";
import { RunRequest, RunQuestionResponse } from "../types/global";

const prisma = new PrismaClient();

export const runCode = async (input: RunRequest) => {
  try {
    let testCases;

    if (input.customInput) {
      // Custom input mode
      testCases = [
        {
          input: input.customInput,
          output: "", // No expected output
        },
      ];
    } else {
      // Normal test mode
      const question = await prisma.question.findUnique({
        where: { id: Number(input.questionId) },
        select: { testCases: true },
      });

      if (!question) {
        return {
          success: false,
          status: "question_not_found",
          error: "Question not found",
          output: "",
        };
      }

      const parsedTestCases = JSON.parse(question.testCases);
      if (!Array.isArray(parsedTestCases) || parsedTestCases.length === 0) {
        return {
          success: false,
          status: "invalid_test_cases",
          error: "Invalid test case format",
        };
      }

      testCases = [parsedTestCases[0]]; // Only the first test case
    }

    // Call your runner
    const result: RunQuestionResponse | undefined = await runQuestion({
      id: input.questionId,
      code: input.code,
      language: input.language,
      testCases: testCases,
    });

    if (!result) {
      return {
        success: false,
        status: "timeout",
        error: "Timeout waiting for result",
      };
    }

    if (!result.result) {
      return {
        success: false,
        status: result.status ?? "unknown_error",
        error: result.error ?? "No result returned",
      };
    }

    const { status } = result.result;

    // Common properties
    const base = {
      time: result.result.time,
      memory: result.result.memory,
    };

    switch (status.id) {
      case 3:
        return {
          success: true,
          status: "accepted",
          output: result.result.stdout || "No output",
          ...base,
        };
      case 4:
        return {
          success: false,
          status: "wrong_answer",
          output: result.result.stdout || "No output",
          expected: result.expectedOutput,
          ...base,
        };
      case 5:
        return {
          success: false,
          status: "time_limit_exceeded",
          output: decode(result.result.stdout),
          ...base,
        };
      case 6:
        return {
          success: false,
          status: "compilation_error",
          error: decode(result.result.stderr),
          ...base,
        };
      default:
        return {
          success: false,
          status: "runtime_error",
          error: decode(result.result.stderr),
          ...base,
        };
    }
  } catch (error) {
    console.error("❌ Error in handleRunRequest:", error);
    return {
      success: false,
      status: "server_error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Helper to decode Base64 safely
const decode = (data?: string | null) =>
  data ? Buffer.from(data, "base64").toString() : "";
