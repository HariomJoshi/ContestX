import { RequestHandler, Router } from "express";
import { runCode } from "../Controllers/runController";
import { submitCode } from "../Controllers/submitController";

const router = Router();

router.use("/run", runCode as RequestHandler);
router.use("/submit", submitCode as RequestHandler);

export default router;
