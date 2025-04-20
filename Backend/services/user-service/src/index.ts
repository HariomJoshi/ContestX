import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./Middlewares/ErrorHandler.js";
import getUserRouter from "./Controllers/GetUser.js";
import blogRouter from "./Controllers/GetBlogs.js";
import questionRouter from "./routes/questionRoutes.js";
import contestRouter from "./routes/contestRoutes.js";
import profileRouter from "./routes/profileRoutes.js";
import "./Middlewares/DailyTask.js"; // Import the scheduler
// The scheduler will run independently once imported.

import morgan from "morgan";

const app = express();
dotenv.config();
app.use(morgan("dev"));
app.use(express.json());

// app.use("/api/v1/auth", authRouter);

app.use("/api/v1/getUser", getUserRouter);
app.use("/api/v1/getBlogs", blogRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/contests", contestRouter);
app.use("/api/v1/profile", profileRouter);

// app.use("/api/v1/run", runRouter);
// app.use("/api/v1/submit", submitRouter);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log("Server started on Port: ", process.env.PORT);
});
