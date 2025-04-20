import express, { Router, RequestHandler } from "express";
import {
  createContest,
  getContests,
  getContestById,
} from "../controllers/contestController";
import { registerInContest } from "../controllers/registerContestController";

const router: Router = express.Router();

// Create a new contest
router.post("/", createContest as RequestHandler);

// Get all contests
router.get("/", getContests as RequestHandler);

// Get a specific contest by ID
router.get("/:id/:userId", getContestById as RequestHandler);

// Register user for contest
router.post("/register", registerInContest as RequestHandler);

export default router;
