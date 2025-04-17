import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createQuestion = async (req: Request, res: Response) => {
  try {
    const { title, description, constraints, testCases, tags } = req.body;

    // Convert testCases array to string format
    console.log(testCases);
    const testCasesString = JSON.stringify(testCases);

    // Ensure tags is an array of strings
    const questionTags = Array.isArray(tags) ? tags : [];

    const question = await prisma.question.create({
      data: {
        title,
        description,
        testCases: testCasesString,
        tags: questionTags,
        constraints,
      },
    });

    // Parse the testCases string back to array for the response
    const questionWithParsedTestCases = {
      ...question,
      testCases: JSON.parse(question.testCases),
    };

    res.status(201).json(questionWithParsedTestCases);
  } catch (error) {
    console.error("Error creating question:", error);
    res.status(500).json({ message: "Error creating question" });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const questions = await prisma.question.findMany({
      skip,
      take: limit,
      orderBy: {
        id: "desc",
      },
    });

    // Parse the testCases string back to array for each question
    const questionsWithParsedTestCases = questions.map((question) => ({
      ...question,
      testCases: JSON.parse(question.testCases),
    }));
    console.log(questionsWithParsedTestCases);
    res.json(questionsWithParsedTestCases);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const questionId = parseInt(req.params.id);
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Parse the testCases string back to array
    const questionWithParsedTestCases = {
      ...question,
      testCases: JSON.parse(question.testCases),
    };

    res.json(questionWithParsedTestCases);
  } catch (error) {
    console.error("Error fetching question:", error);
    res.status(500).json({ message: "Error fetching question" });
  }
};
