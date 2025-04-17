import express, { Router } from "express";
import { getProfileData } from "../Controllers/profileController.js";

const router: Router = express.Router();

// Get user profile data
router.get("/", getProfileData as express.RequestHandler);

export default router;
