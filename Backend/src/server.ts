import { Router, Request, Response } from "express";
const router = Router();

router.get("/user", (req: Request, res: Response) => {
  res.json({
    data: "User Profile",
  });
});

export default router;
