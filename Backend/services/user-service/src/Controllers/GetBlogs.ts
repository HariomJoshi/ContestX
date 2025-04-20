import { PrismaClient } from "@prisma/client";
import { Request, NextFunction, Router, Response } from "express";

const router = Router();
const pClient = new PrismaClient();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await pClient.blog.findMany();
    console.log(blogs);
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

export default router;
