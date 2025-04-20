import { PrismaClient } from "@prisma/client";
import { runQuestion } from "../Helper/runQuestion";
import { RunQuestionResponse } from "../Types/global";
import { Request, Response } from "express";

const prisma = new PrismaClient();
export const runCode = async (req: Request, res: Response) => {
  try {
    // Check if we have custom input
    if (req.body.customInput) {
      // Create a single test case with the custom input
      req.body.testCases = [
        {
          input: req.body.customInput,
          output: "", // No expected output for custom input
        },
      ];
    } else {
      // For regular runs, fetch and parse test cases
      const question = await prisma.question.findUnique({
        where: { id: Number(req.body.questionId) },
        select: { testCases: true },
      });

      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      const parsedTestCases = JSON.parse(question.testCases);
      if (!Array.isArray(parsedTestCases) || parsedTestCases.length === 0) {
        return res.status(400).json({ error: "Invalid test cases format" });
      }

      // Use only the first test case for quick testing
      req.body.testCases = [parsedTestCases[0]];
    }

    // Run the code
    const result: RunQuestionResponse | undefined = await runQuestion(req);

    if (!result || result == undefined) {
      return res.status(500).json({ error: "Timeout waiting for result" });
    }

    if (!result.result) {
      if (result.status == null) return;
      return res.status(Number(result.status)).json({ error: result.error });
    }

    // Process result
    if (result.result.status.id === 3) {
      // accepted
      const decodedOutput = result.result.stdout;
      return res.json({
        success: true,
        status: "accepted",
        output: decodedOutput || "No output",
        time: result.result.time,
        memory: result.result.memory,
      });
    } else if (result.result.status.id === 4) {
      // Wrong Answer
      const decodedOutput = result.result.stdout;
      return res.json({
        success: false,
        status: "wrong_answer",
        output: decodedOutput || "No output",
        expected: result.expectedOutput,
        time: result.result.time,
        memory: result.result.memory,
      });
    } else if (result.result.status.id === 5) {
      // Time Limit Exceeded
      const decodedOutput = result.result.stdout
        ? Buffer.from(result.result.stdout, "base64").toString()
        : "";
      return res.json({
        success: false,
        status: "time_limit_exceeded",
        output: decodedOutput || "No output",
        time: result.result.time,
        memory: result.result.memory,
      });
    } else if (result.result.status.id === 6) {
      // Compilation Error
      const decodedError = result.result.stderr
        ? Buffer.from(result.result.stderr, "base64").toString()
        : "";
      return res.json({
        success: false,
        status: "compilation_error",
        error: decodedError || "Compilation failed",
        time: result.result.time,
        memory: result.result.memory,
      });
    } else {
      // Runtime Error or other
      const decodedError = result.result.stderr
        ? Buffer.from(result.result.stderr, "base64").toString()
        : "";
      return res.json({
        success: false,
        status: "runtime_error",
        error: decodedError || "Runtime error occurred",
        time: result.result.time,
        memory: result.result.memory,
      });
    }
  } catch (error) {
    console.error("Error in run route:", error);
    return res.status(500).json({
      success: false,
      status: "server_error",
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
