import { Router, RequestHandler } from "express";

import { login, signup } from "../Controllers/authController";

const router = Router();

router.post("/login", login as RequestHandler);
router.post("/signup", signup as RequestHandler);

export default router;
