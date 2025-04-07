import express from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

interface RunRequest {
  code: string;
  language: string;
  testCases: string;
}

interface TestCase {
  input: string;
  output: string;
}

interface Judge0Response {
  token: string;
}

interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  status: {
    id: number;
    description: string;
  };
}

router.post("/", async (req: any, res: any) => {
  try {
    const { code, language, questionId } = req.body;
    const question = await prisma.question.findUnique({
      where: { id: Number(questionId) },
      select: { testCases: true },
    });
    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }
    const testCases = question.testCases;
    // console.log(testCases);
    console.log(code);

    // Parse test cases
    const parsedTestCases: TestCase[] = JSON.parse(testCases);
    if (!Array.isArray(parsedTestCases) || parsedTestCases.length === 0) {
      return res.status(400).json({ error: "Invalid test cases format" });
    }

    // Prepare input for Judge0
    const input = `${parsedTestCases.length}\n${parsedTestCases
      .map((tc) => tc.input)
      .join("\n")}`;
    const expectedOutput = parsedTestCases.map((tc) => tc.output).join("\n");

    // Get complete code with boilerplate
    const completeCode = code;

    // Submit to Judge0
    let token: string;
    console.log("Sending request to Judge0...");
    try {
      const judge0Response = await axios.post<Judge0Response>(
        `${process.env.JUDGE0_API}/submissions`,
        {
          source_code: completeCode,
          language_id: 62, // Java
          stdin: input,
          expected_output: expectedOutput,
          cpu_time_limit: 5,
          wall_time_limit: 5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );
      token = judge0Response.data.token;
      console.log("RESPONSE RECEIVED");
      console.log(judge0Response);
    } catch (error) {
      console.error("Error making Judge0 request:", error);
      throw error;
    }

    // Poll for results
    let result: Judge0Result | null = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const response = await axios.get<Judge0Result>(
        `${process.env.JUDGE0_API}/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            "X-RapidAPI-Host": process.env.JUDGE0_API,
          },
        }
      );

      if (response.data.status.id > 2) {
        // Status 3 means finished
        result = response.data;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }

    if (!result) {
      return res.status(500).json({ error: "Timeout waiting for result" });
    }

    // Process result
    if (result.status.id === 3) {
      // Accepted
      console.log("Accepted!");
      return res.json({
        status: "accepted",
        output: result.stdout,
      });
    } else if (result.status.id === 4) {
      // Wrong Answer
      console.log("Wrong Ans!");
      return res.json({
        status: "wrong_answer",
        output: result.stdout,
        expected: expectedOutput,
      });
    } else if (result.status.id === 5) {
      // Time Limit Exceeded
      console.log("Time Limit Exceeded");
      return res.json({
        status: "time_limit_exceeded",
        output: result.stdout,
      });
    } else if (result.status.id === 6) {
      // Compilation Error
      console.log("Compilation Error");
      return res.json({
        status: "compilation_error",
        error: result.stderr,
      });
    } else {
      // Runtime Error or other
      console.log("Runtime Error");
      return res.json({
        status: "runtime_error",
        error: result.stderr,
      });
    }
  } catch (error) {
    console.error("Error in run route:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
