import express, { Router } from "express";
import {
  createContest,
  getContests,
  getContestById,
} from "../controllers/contestController";

const router: Router = express.Router();

// Create a new contest
router.post("/", createContest as express.RequestHandler);

// Get all contests
router.get("/", getContests as express.RequestHandler);

// Get a specific contest by ID
router.get("/:id", getContestById as express.RequestHandler);

export default router;
