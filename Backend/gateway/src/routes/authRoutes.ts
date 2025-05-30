import { RequestHandler, Router } from "express";
import { login, signup } from "../controllers/authController";

const router = Router();

router.post("/login", login as RequestHandler);
router.post("/signup", signup as RequestHandler);

export default router;
