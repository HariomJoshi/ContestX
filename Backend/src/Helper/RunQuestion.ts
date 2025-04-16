import { PrismaClient } from "@prisma/client";
import { RunQuestionResponse } from "../Controllers/RunController.js";
import { NextFunction, Request, Response } from "express";
import { TestCase, Judge0Response, Judge0Result } from "../types/global.js";
import axios from "axios";
const prisma = new PrismaClient();

export const runQuestion = async (req: Request) => {
  let result: Judge0Result | null = null;
  try {
    const { code, language, questionId } = req.body;
    const question = await prisma.question.findUnique({
      where: { id: Number(questionId) },
      select: { testCases: true },
    });
    if (!question) {
      const res: RunQuestionResponse = {
        status: 404,
        error: "Question not found",
      };
      return res;
      //   return res.status(404).json({ error: "Question not found" });
    }
    const testCases = question.testCases;
    // console.log(testCases);
    // console.log(code);

    // Parse test cases
    const parsedTestCases: TestCase[] = JSON.parse(testCases);
    if (!Array.isArray(parsedTestCases) || parsedTestCases.length === 0) {
      const res: RunQuestionResponse = {
        status: 400,
        error: "Invalid test cases format",
      };
      //   return res.status(400).json({ error: "Invalid test cases format" });
    }

    // Prepare input for Judge0
    const input = `${parsedTestCases.length}\n${parsedTestCases
      .map((tc) => tc.input)
      .join("\n")}`;
    const expectedOutput = parsedTestCases.map((tc) => tc.output).join("\n");

    console.log("Raw input:", input);
    // console.log("Raw expected output:", expectedOutput);
    console.log("Raw code:", code);

    // Submit to Judge0
    let token: string;
    console.log("Sending request to Judge0...");
    try {
      const requestBody = {
        source_code: code,
        language_id: 62, // Java
        stdin: input,
        expected_output: expectedOutput,
        cpu_time_limit: 5,
        wall_time_limit: 5,
      };
      console.log("Request body:", JSON.stringify(requestBody, null, 2));

      const judge0Response = await axios.post<Judge0Response>(
        `${process.env.JUDGE0_API}/submissions?wait=false`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );
      token = judge0Response.data.token;
      console.log("token", token);
      console.log("RESPONSE RECEIVED");
    } catch (error) {
      console.error("Error making Judge0 request:", error);
      throw error;
    }

    // Poll for results
    console.log("Polling for results...");

    let attempts = 0;
    const maxAttempts = 10;
    console.log("maxAttempts", maxAttempts);

    while (attempts < maxAttempts) {
      const response = await axios.get<Judge0Result>(
        `${process.env.JUDGE0_API}/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      if (response.data.status.id > 2) {
        // Status 3 means finished
        result = response.data;
        break;
      }
      console.log("response", response.data.status.id);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      attempts++;
    }
    return { result, expectedOutput };
  } catch (e) {
    console.log("Unexpected error at Run question");
  }
};
