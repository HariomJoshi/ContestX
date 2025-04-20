import { runCode } from "../controllers/runController";
import { submitCode } from "../controllers/submitController";
import express, { Router } from "express";

const router: Router = Router();

// route to run code
router.post("/run", runCode as express.RequestHandler);
// route to submit code
router.post("/submit", submitCode as express.RequestHandler);

export default router;
