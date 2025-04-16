import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./Auth/login.js";
import errorHandler from "./Middlewares/ErrorHandler.js";
import getUserRouter from "./Controllers/GetUser.js";
import blogRouter from "./Controllers/GetBlogs.js";
import questionRouter from "./routes/questionRoutes.js";
import contestRouter from "./routes/contestRoutes.js";
import runRouter from "./routes/runRoutes.js";
import submitRouter from "./routes/SubmitRoutes.js";
import "./Middlewares/DailyTask.js"; // Import the scheduler
// The scheduler will run independently once imported.
import pkg from "pg";
import morgan from "morgan";
const { Client } = pkg;
const app = express();
dotenv.config();
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/getUser", getUserRouter);
app.use("/api/v1/getBlogs", blogRouter);
app.use("/api/v1/questions", questionRouter);
app.use("/api/v1/contests", contestRouter);
app.use("/api/v1/run", runRouter);
app.use("/api/v1/submit", submitRouter);
app.use(errorHandler);
const client = new Client({
    connectionString: process.env.DATABASE_URL, // corrected typo
});
client.connect(() => {
    console.log("Connected to DB");
});
app.listen(process.env.PORT, () => {
    console.log("Server started on Port:", process.env.PORT);
});
