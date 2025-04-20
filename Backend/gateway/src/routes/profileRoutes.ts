import express, { Router } from "express";
import { getProfileData } from "../controllers/profileController";

const router: Router = express.Router();

// Get user profile data
router.get("/", getProfileData as express.RequestHandler);

export default router;
