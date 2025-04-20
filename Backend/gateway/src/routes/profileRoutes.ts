import express, { RequestHandler, Router } from "express";
import { getProfileData } from "../controllers/profileController";

const router: Router = express.Router();

// Get user profile data
router.get("/", getProfileData as RequestHandler);

export default router;
