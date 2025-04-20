import express, { Router, RequestHandler } from "express";
import {
  createContest,
  getContests,
  getContestById,
} from "../Controllers/contestController.js";
import { registerUserForContest } from "../Controllers/contestRegisterController.js";

const router: Router = Router();

// Create a new contest
router.post("/", createContest as RequestHandler);

// Get all contests
router.get("/", getContests as RequestHandler);

// Get a specific contest by ID
router.get("/:id/:userId", getContestById as RequestHandler);

// Register user for contest
router.post("/register", registerUserForContest as RequestHandler);

export default router;
