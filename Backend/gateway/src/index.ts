import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/authRoutes";
import runRouter from "./routes/runRoutes";
import userRouter from "./routes/userRoutes";
import dotenv from "dotenv";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
dotenv.config();

// auth-service
app.use("/api/v1/auth", authRouter);
// user-service
app.use("/api/v1/user", userRouter);
// submission-service
app.use("/api/v1/solve", runRouter);

app.listen(process.env.PORT, () => {
  console.log("Server started on Port: ", process.env.PORT);
});
