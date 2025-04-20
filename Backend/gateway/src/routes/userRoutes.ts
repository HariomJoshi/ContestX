import express, { RequestHandler, Router } from "express";
import { getUser } from "../controllers/getUserController";
import { getBlogs } from "../controllers/getBlogs";
import questionRouter from "./questionRoutes";
import contestRouter from "./contestRoutes";
import profileRouter from "./profileRoutes";

const router: Router = Router();

// router.get("/getUser", getUser as RequestHandler);
router.get("/getBlogs", getBlogs as RequestHandler);
router.use("/questions", questionRouter);
router.use("/contests", contestRouter);
router.use("/profile", profileRouter);

// NOTE: getUser and profile route are performing same function,
//  correct it once you have differentiated gateway

export default router;
