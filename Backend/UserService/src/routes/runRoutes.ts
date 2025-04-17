import { runCode } from "../Controllers/RunController.js";
import express, { Router } from "express";

const router: Router = Router();

// route to run code
router.post("/", runCode as express.RequestHandler);

export default router;
