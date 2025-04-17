import { PrismaClient } from "@prisma/client";
import { runQuestion } from "../Helper/RunQuestion.js";
import axios from "axios";
import { TestCase, Judge0Response, Judge0Result } from "../types/global.js";
import { Request, Response } from "express";

export interface RunQuestionResponse {
  status?: Number;
  error?: String;
  result?: Judge0Result | null;
  expectedOutput?: String;
}

const prisma = new PrismaClient();
export const runCode = async (req: Request, res: Response) => {
  try {
    let result: RunQuestionResponse | undefined;

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
    result = await runQuestion(req);

    if (!result || result == undefined) {
      return res.status(500).json({ error: "Timeout waiting for result" });
    }

    if (!result.result) {
      if (result.status == null) return;
      return res.status(Number(result.status)).json({ error: result.error });
    }

    console.log("result");
    console.log(result);
    // Process result
    if (result.result.status.id === 3) {
      // accepted
      console.log("Accepted!");
      const decodedOutput = result.result.stdout;
      return res.json({
        status: "accepted",
        output: decodedOutput,
      });
    } else if (result.result.status.id === 4) {
      // Wrong Answer
      console.log("Wrong Ans!");
      const decodedOutput = result.result.stdout;
      return res.json({
        status: "wrong_answer",
        output: decodedOutput,
        expected: result.expectedOutput,
      });
    } else if (result.result.status.id === 5) {
      // Time Limit Exceeded
      console.log("Time Limit Exceeded");
      const decodedOutput = result.result.stdout
        ? Buffer.from(result.result.stdout, "base64").toString()
        : "";
      return res.json({
        status: "time_limit_exceeded",
        output: decodedOutput,
      });
    } else if (result.result.status.id === 6) {
      // Compilation Error
      console.log("Compilation Error");
      const decodedError = result.result.stderr
        ? Buffer.from(result.result.stderr, "base64").toString()
        : "";
      return res.json({
        status: "compilation_error",
        error: decodedError,
      });
    } else {
      // Runtime Error or other
      console.log("Runtime Error");
      const decodedError = result.result.stderr
        ? Buffer.from(result.result.stderr, "base64").toString()
        : "";
      return res.json({
        status: "runtime_error",
        error: decodedError,
      });
    }
  } catch (error) {
    console.error("Error in run route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
