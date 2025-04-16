import { Router, RequestHandler } from "express";
import { submitQuestion } from "../Controllers/SubmitController.js";

const router: Router = Router();

router.post("/", submitQuestion as RequestHandler);

export default router;
