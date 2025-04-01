import express, { Router } from "express";
import {
  createQuestion,
  getQuestions,
  getQuestionById,
} from "../Controllers/questionController.js";

const router: Router = express.Router();

// Create a new question
router.post("/", createQuestion as express.RequestHandler);

// Get all questions
router.get("/", getQuestions as express.RequestHandler);

// Get a specific question by ID
router.get("/:id", getQuestionById as express.RequestHandler);

export default router;
