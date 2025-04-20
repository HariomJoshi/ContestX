import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/authRoutes";
import runRouter from "./routes/runRoutes";
import userRouter from "./routes/userRoutes";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// auth-service
app.use("/api/v1/auth", authRouter);
// user-service
app.use("/api/v1/user", userRouter);
// submission-service
app.use("/api/v1/solve", runRouter);

app.listen(3000, () => {
  console.log("Gateway started on port 3000");
});
