import { PrismaClient } from "@prisma/client";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();
const pClient = new PrismaClient();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  if (req.query.userId === undefined) {
    next({ status: 400, message: "No query parameteres given" });
  }
  const userId: number = Number(req.query.userId);
  console.log("UserId: " + userId);

  const user = await pClient.user.findFirst({
    where: {
      id: userId,
    },
  });
  if (user === null) {
    next({ status: 404, message: "User Not found" });
  } else {
    res.json({
      data: {
        name: user.firstName + " " + user.lastName,
        email: user.email,
        username: user.username,
        ratingsChanged: user.rating_changed,
      },
    });
  }
});

export default router;
